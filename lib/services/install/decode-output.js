/**
 * 子进程输出解码：默认 UTF-8；出现替换字符（中文 Windows 的 GBK 输出）时改用 GBK 重解。
 * 用 StringDecoder 跨 chunk 缓冲，避免 UTF-8 多字节字符被 chunk 边界切断后误判为 GBK；
 * GBK 分支同样跨 chunk 缓冲（流式 decode），否则 GBK 首字节止于 chunk 尾时会各留一个替换字符。
 */
import { StringDecoder } from 'node:string_decoder';
export class OutputDecoder {
    utf8 = new StringDecoder('utf8');
    gbk = null;
    push(chunk) {
        const text = this.utf8.write(chunk);
        if (!text.includes('\uFFFD'))
            return text;
        try {
            if (this.gbk === null)
                this.gbk = new TextDecoder('gbk');
            // 流式解码：跨 chunk 共享同一个 decoder，上一 chunk 尾的 GBK 首字节
            // 与本 chunk 的后续字节才能拼回整字（逐 chunk 新建会各自留下替换字符）。
            const gbk = this.gbk.decode(chunk, { stream: true });
            // GBK 能完整解出且（含中文，或本 chunk 全部字节都在等后续字节）才采用：
            // 纯 ASCII 或仍有替换字符时保持 UTF-8 结果
            if (!gbk.includes('\uFFFD') && (gbk === '' || /[\u4e00-\u9fff]/.test(gbk)))
                return gbk;
        }
        catch {
            // 无完整 ICU（TextDecoder 不支持 gbk）时退回 UTF-8 结果
        }
        return text;
    }
}

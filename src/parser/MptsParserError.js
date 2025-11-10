export class MptsParserError extends Error{
constructor(message, line, column, sample, totalPosition, filename=null) {
    super(`Parse error: ${message}

Code:
${sample.replace(/\n/g, '\\n')}

File: ${(filename?filename:'unknown file')}:${line}:${column}`);
    this.messageRaw=message;
    this.line=line;
    this.column=column;
    this.sample=sample;
    this.totalPosition=totalPosition;
}
}

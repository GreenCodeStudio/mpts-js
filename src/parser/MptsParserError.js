export class MptsParserError extends Error{
constructor(message, line, column, sample) {
    super(message+'\r\n'+sample.replace(/\n/g, '\\n')+'\r\n'+line+":"+column);
    this.messageRaw=message;
    this.line=line;
    this.column=column;
    this.sample=sample;
}
}
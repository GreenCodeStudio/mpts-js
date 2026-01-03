export class MptsParserError extends Error{
constructor(message, codePosition, sample) {
    super(`Parse error: ${message}

Code:
${sample.replace(/\n/g, '\\n')}

File: ${codePosition}`);
    this.codePosition=codePosition;
    this.sample=sample;
}
}

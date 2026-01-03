export class MptsExecutionError extends Error{
    constructor(message, codePosition, previous) {
        super(`${message}\r\n${codePosition}`);
        this.codePosition=codePosition;
        this.messageRaw=message;
        this.previous=previous;
    }
}

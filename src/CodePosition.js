export class CodePosition {
    constructor(fileName, lineNumber, columnNumber, fileOffset) {
        this.fileName = fileName ?? null;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
        this.fileOffset = fileOffset;
    }

    toString() {
        return `${this.fileName ?? '<unknown>'}:${this.lineNumber}:${this.columnNumber}`;
    }
}

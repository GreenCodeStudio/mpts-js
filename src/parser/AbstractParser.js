import {MptsParserError} from "./MptsParserError.js";
import {CodePosition} from "../CodePosition.js";

export class AbstractParser {

    text = '';
    fileName = null;
    fileLineOffset = null;
    fileColumnOffset = null;
    filePositionOffset = null;
    position = 0;
    openElements = [];

    readUntil(regexp) {
        let ret = '';
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (regexp.test(char))
                break;
            ret += char;
            this.position++;
        }
        return ret;
    }

    skipWhitespace() {
        this.readUntil(/\S/)
    }

    readUntilText(text) {
        let ret = '';
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (this.text.substr(this.position, text.length) == text)
                break;
            ret += char;
            this.position++;
        }
        return ret;
    }

    throw(message) {
        throw new MptsParserError(
            message,
            this.currentCodePosition,
            this.text.substr(this.position, 10)
        )
    }


    get currentLineOffset() {
        const substr = this.text.substr(0, this.position);
        const count = (substr.match(/\n/g) || []).length;
        return count + (this.fileLineOffset ?? 1);
    }

    get currentColumnOffset() {
        const substr = this.text.substr(0, this.position);
        const lines = substr.split('\n');
        const lineNumber = lines.length - 1;
        const startLine = lines[lineNumber].length;
        return startLine + (lineNumber === 0 ? (this.fileColumnOffset ?? 0) : 0);
    }

    get currentFilePosition() {
        return this.position + (this.filePositionOffset ?? 0);
    }

    get currentCodePosition() {
        return new CodePosition(
            this.fileName,
            this.currentLineOffset,
            this.currentColumnOffset,
            this.currentFilePosition
        );
    }

}

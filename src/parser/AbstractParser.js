import {MptsParserError} from "./MptsParserError.js";

export class AbstractParser {

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
        let lines = this.text.substr(0, this.position).split('\n');
        throw new MptsParserError(message, lines.length, lines[lines.length - 1].length, this.text.substr(this.position, 10), this.position, this.fileName??null)
    }
}

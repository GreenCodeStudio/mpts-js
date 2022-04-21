import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TEVariable} from "../nodes/expressions/TEVariable";
import {TEBoolean} from "../nodes/expressions/TEBoolean";
import {TENumber} from "../nodes/expressions/TENumber";
import {TEString} from "../nodes/expressions/TEString";

export class ExpressionParser {
    constructor(text) {
        this.text = text;
        this.position = 0;
    }

    static Parse(text) {
        return (new ExpressionParser(text)).parseNormal();
    }

    parseNormal() {
        let lastNode = null;
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (/\s/.test(char)) {
                this.position++;
            } else if (/[0-9\.\-+]/.test(char)) {
                let value = this.readUntill(/\s/);
                lastNode = new TENumber(+value);
            } else if (char == '"') {
                this.position++;
                let value = this.readUntill(/"/);
                this.position++;
                lastNode = new TEString(value);
            } else if (char == "'") {
                this.position++;
                let value = this.readUntill(/'/);
                this.position++;
                lastNode = new TEString(value);
            } else {
                let name = this.readUntill(/\s/);
                if (name == 'true')
                    lastNode = new TEBoolean(true)
                else if (name == 'false')
                    lastNode = new TEBoolean(false)
                else
                    lastNode = new TEVariable(name);
            }
        }
        return lastNode;
    }

    readUntill(regexp) {
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
        this.readUntill(/\S/)
    }
}
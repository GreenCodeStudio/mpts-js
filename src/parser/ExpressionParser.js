import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TEVariable} from "../nodes/expressions/TEVariable";

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
            }else{
                let name=this.readUntill(/\s/);
                lastNode=new TEVariable(name);
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
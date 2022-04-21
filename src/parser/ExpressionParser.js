import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TEVariable} from "../nodes/expressions/TEVariable";
import {TEBoolean} from "../nodes/expressions/TEBoolean";
import {TENumber} from "../nodes/expressions/TENumber";
import {TEString} from "../nodes/expressions/TEString";
import {TEEqual} from "../nodes/expressions/TEEqual";
import {AbstractParser} from "./AbstractParser";

export class ExpressionParser extends AbstractParser{
    constructor(text) {
        super();
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
            }else if (char == "=" && this.text[this.position+1]=="=") {
                this.position+=2;
                let right=this.parseNormal();
                lastNode=new TEEqual(lastNode, right);
            } else {
                let name = this.readUntill(/['"\(\)=\s]/);
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

}
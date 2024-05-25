import {TDocumentFragment} from "../nodes/TDocumentFragment.js";
import {TEVariable} from "../nodes/expressions/TEVariable.js";
import {TEBoolean} from "../nodes/expressions/TEBoolean.js";
import {TENumber} from "../nodes/expressions/TENumber.js";
import {TEString} from "../nodes/expressions/TEString.js";
import {TEEqual} from "../nodes/expressions/TEEqual.js";
import {AbstractParser} from "./AbstractParser.js";
import {TEProperty} from "../nodes/expressions/TEProperty.js";
import {TEMethodCall} from "../nodes/expressions/TEMethodCall.js";
import {TEConcatenate} from "../nodes/expressions/TEConcatenate.js";
import {TEAdd} from "../nodes/expressions/TEAdd.js";
import {TESubtract} from "../nodes/expressions/TESubtract.js";
import {TEOrNull} from "../nodes/expressions/TEOrNull.js";

export class ExpressionParser extends AbstractParser {
    constructor(text) {
        super();
        this.text = text;
        this.position = 0;
    }

    static Parse(text, endLevel=0) {
        return (new ExpressionParser(text)).parseNormal(endLevel);
    }

    parseNormal(endLevel = 0) {
        let lastNode = null;
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (/\s/.test(char)) {
                this.position++;
            } else if (lastNode && char == '.') {
                this.position++;
                let name = this.readUntil(/['"\(\)=\.:\s>+\-*?]/);
                lastNode = new TEProperty(lastNode, name);
            } else if (/[0-9\.]/.test(char)) {
                this.position++;
                let value = char+this.readUntil(/[^0-9\.e]/);
                lastNode = new TENumber(+value);
            } else if (char == '"') {
                this.position++;
                let value = this.readUntil(/"/);
                this.position++;
                lastNode = new TEString(value);
            } else if (char == "'") {
                this.position++;
                let value = this.readUntil(/'/);
                this.position++;
                lastNode = new TEString(value);
            } else if (char == "(") {
                if (lastNode) {
                    lastNode = new TEMethodCall(lastNode);
                    this.position++;
                    this.skipWhitespace();
                    while (this.text[this.position] != ')') {
                        if (this.position >= this.text.length) this.throw('Unexpected end of input');

                        let value = this.parseNormal(2);
                        lastNode.args.push(value);
                        if(this.text[this.position] ==',')
                            this.position++;
                    }
                    this.position++;
                } else {
                    this.position++;
                    let value = this.parseNormal(1);
                    this.position++;
                    lastNode = value;
                }
            } else if (char == ")") {
                if (endLevel >= 1) {
                    break;
                } else {
                    this.throw("( not opened");
                }
            } else if (char == "=" && this.text[this.position + 1] == "=") {
                this.position += 2;
                let right = this.parseNormal(2);
                lastNode = new TEEqual(lastNode, right);
            }  else if (char == "?"&& this.text[this.position + 1] == "?") {
                if (endLevel >= 5) {
                    break;
                }
                this.position+=2;
                let right = this.parseNormal(5);
                lastNode = new TEOrNull(lastNode, right);
            } else if (char == ",") {
                if (endLevel >= 2) {
                    break;
                }
                else {
                    this.throw("Unexpected character");
                }
            }else if (char == "+") {
                if (endLevel >= 4) {
                    break;
                }
                this.position++;
                let right = this.parseNormal(4);
                lastNode = new TEAdd(lastNode, right);
            } else if (char == "-") {
                if (endLevel >= 4) {
                    break;
                }
                this.position++;
                let right = this.parseNormal(4);
                lastNode = new TESubtract(lastNode, right);
            } else if (char == ":") {
                this.position++;
                let right = this.parseNormal(3);
                lastNode = new TEConcatenate(lastNode, right);
            } else if (char == ">" || char == "\\") {
                if (lastNode) {
                    break
                } else {
                    this.throw("Unexpected character");
                }
            } else {
                if (lastNode) {
                    break;
                }
                let name = this.readUntil(/['"\(\)=\.\s:>/+\-*?,]/);
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

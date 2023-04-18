import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TEVariable} from "../nodes/expressions/TEVariable";
import {TEBoolean} from "../nodes/expressions/TEBoolean";
import {TENumber} from "../nodes/expressions/TENumber";
import {TEString} from "../nodes/expressions/TEString";
import {TEEqual} from "../nodes/expressions/TEEqual";
import {AbstractParser} from "./AbstractParser";
import {TEProperty} from "../nodes/expressions/TEProperty";
import {TEMethodCall} from "../nodes/expressions/TEMethodCall";
import {TEConcatenate} from "../nodes/expressions/TEConcatenate";

export class ExpressionParser extends AbstractParser {
    constructor(text) {
        super();
        this.text = text;
        this.position = 0;
    }

    static Parse(text) {
        return (new ExpressionParser(text)).parseNormal();
    }

    parseNormal(endLevel = 0) {
        let lastNode = null;
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (/\s/.test(char)) {
                this.position++;
            } else if (lastNode && char == '.') {
                this.position++;
                let name = this.readUntill(/['"\(\)=\.:\s]/);
                lastNode = new TEProperty(lastNode, name);
            } else if (/[0-9\.\-+]/.test(char)) {
                let value = this.readUntill(/[^0-9\.\-+e]/);
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
            } else if (char == "(") {
                if (lastNode) {
                    lastNode = new TEMethodCall(lastNode);
                    this.position++;
                    this.skipWhitespace();
                    while (this.text[this.position] != ')') {
                        if (this.position >= this.text.length) throw new Error('Unexpected end of input');

                        let value = this.parseNormal(2);
                        lastNode.args.push(value);
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
                    throw new Error("( not opened");
                }
            } else if (char == "=" && this.text[this.position + 1] == "=") {
                this.position += 2;
                let right = this.parseNormal(2);
                lastNode = new TEEqual(lastNode, right);
            } else if (char == ":") {
                this.position++;
                let right = this.parseNormal(3);
                lastNode = new TEConcatenate(lastNode, right);
            } else if (char == ">" || char == "\\") {
                if (lastNode) {
                    break
                } else {
                    throw new Error("Unexpected character");
                }
            } else {
                if (lastNode) {
                    break;
                }
                let name = this.readUntill(/['"\(\)=\.\s:>/]/);
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
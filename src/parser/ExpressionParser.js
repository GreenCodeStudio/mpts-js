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
import {TEMultiply} from "../nodes/expressions/TEMultiply.js";
import {TEDivide} from "../nodes/expressions/TEDivide.js";
import {TEModulo} from "../nodes/expressions/TEModulo.js";

export class ExpressionParser extends AbstractParser {
    constructor(text) {
        super();
        this.text = text;
        this.position = 0;
    }

    static Parse(text, endLevel = 0) {
        return (new ExpressionParser(text)).parseNormal(endLevel);
    }

    parseNormal(endLevel = 0) {
        let lastNode = null;
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            // const partCodePosition=this.currentCodePosition;
            if (/\s/.test(char)) {
                this.position++;
            } else if (lastNode && char == '.') {
                this.position++;
                let name = this.readUntil(/['"\(\)=\.:\s>+\-*?]/);
                lastNode = new TEProperty(lastNode, name, true);
            } else if (lastNode && char == '?' && this.text[this.position + 1] == '.') {
                this.position++;
                let name = this.readUntil(/['"\(\)=\.:\s>+\-*?]/);
                lastNode = new TEProperty(lastNode, name);
            } else if (/[0-9\.]/.test(char)) {
                this.position++;
                let value = char + this.readUntil(/[^0-9\.e]/);
                if (/^(\.e*|e+)/.test(char)) {
                    this.position--;
                    this.throw("Unexpected '" + char + "'");
                }
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

                        let value = this.parseNormal(11);
                        lastNode.args.push(value);
                        if (this.text[this.position] == ',')
                            this.position++;
                    }
                    this.position++;
                } else {
                    this.position++;
                    let value = this.parseNormal(10);
                    this.position++;
                    lastNode = value;
                }
            } else if (char == ")") {
                if (endLevel == 10) {
                    this.position++;
                    break;
                }
                if (endLevel >= 10) {
                    break;
                } else {
                    this.throw("( not opened");
                }
            } else if (char == "=") {
                if (this.text[this.position + 1] != "=") {
                    this.throw("Assignment '=' is not allowed in expressions");
                }
                if (endLevel >= 40) {
                    break;
                }
                this.position += 2;
                let right = this.parseNormal(40);
                lastNode = new TEEqual(lastNode, right);
            } else if (char == "!" && this.text[this.position + 1] == "=") {
                if (endLevel >= 40) {
                    break;
                }
                this.position += 2;
                let right = this.parseNormal(40);
                lastNode = new TENotEqual(lastNode, right);
            } else if (char == "&" && this.text[this.position + 1] == "&") {
                if (endLevel >= 20) {
                    break
                }
                this.position += 2;
                let right = this.parseNormal(20);
                lastNode = new TEAnd(lastNode, right);
            } else if (char == "|" && this.text[this.position + 1] == "|") {
                if (endLevel >= 20) {
                    break
                }
                this.position += 2;
                let right = this.parseNormal(20);
                lastNode = new TEOr(lastNode, right);
            }
            else if (char == "?" && this.text[this.position + 1] == "?") {
                if (endLevel >= 20) {
                    break;
                }
                this.position += 2;
                let right = this.parseNormal(20);
                lastNode = new TEOrNull(lastNode, right);
            }else if (char == "+") {
                if (endLevel >= 60) {
                    break;
                }
                this.position++;
                let right = this.parseNormal(60);
                lastNode = new TEAdd(lastNode, right);
            } else if (char == "-") {
                if (endLevel >= 60) {
                    break;
                }
                this.position++;
                let right = this.parseNormal(60);
                lastNode = new TESubtract(lastNode, right);
            } else if (char == "*") {
                if (endLevel >= 70) {
                    break;
                }
                this.position++;
                let right = this.parseNormal(70);
                lastNode = new TEMultiply(lastNode, right);
            } else if (char == "/") {
                if (endLevel >= 70) {
                    break;
                }
                this.position++;
                let right = this.parseNormal(70);
                lastNode = new TEDivide(lastNode, right);
            } else if (char == "%") {
                if (endLevel >= 70) {
                    break;
                }
                this.position++;
                let right = this.parseNormal(70);
                lastNode = new TEModulo(lastNode, right);
            } else if (char == "!") {
                if (endLevel >= 30) {
                    break;
                }
                if (lastNode) {
                    this.throw("Unexpected '!'");
                }
                this.position++;
                let right = this.parseNormal(30);
                lastNode = new TENegate(right);
            } else if (char == ":") {
                this.position++;
                let right = this.parseNormal(3);
                lastNode = new TEConcatenate(lastNode, right);
            } else if (char == ">") {
                if (endLevel == 0 || endLevel == 1) {
                    if (lastNode) {
                        break
                    } else {
                        this.throw("Unexpected character")
                    }
                } else {//in parenthesis
                    if(endLevel>=40){
                        break;
                    }
                    this.position++;
                    let orEqual=this.text[this.position]=="=";
                    if(orEqual){
                        this.position++;
                    }
                    let right = this.parseNormal(40);
                    lastNode=new TEComparsion(lastNode, right,true, orEqual)
                }
            }else if(char=="<"){
                if (endLevel >=40) {
                    break;
                }
                this.position++;
                let orEqual=this.text[this.position]=="=";
                if(orEqual){
                    this.position++;
                }
                let right = this.parseNormal(40);
                lastNode=new TEComparsion(lastNode, right,false, orEqual)
            }

            else {
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

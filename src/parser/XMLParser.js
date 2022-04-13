import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TText} from "../nodes/TText";
import {TElement} from "../nodes/TElement";
import {re} from "@babel/core/lib/vendor/import-meta-resolve";
import {TEVariable} from "../nodes/expressions/TEVariable";
import {TExpressionText} from "../nodes/TExpressionText";
import {TAttribute} from "../nodes/TAttribute";
import {ExpressionParser} from "./ExpressionParser";
import {TExpressionAttribute} from "../nodes/TExpressionAttribute";

export class XMLParser {
    constructor(text) {
        this.text = text;
        this.position = 0;
        this.openElements = [new TDocumentFragment()];
    }

    static Parse(text) {
        return (new XMLParser(text)).parseNormal();
    }

    parseNormal() {
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            let element = this.openElements[this.openElements.length - 1];
            let last = element.children[element.children.length - 1];
            if (char == '<') {
                if (this.text[this.position + 1] == '/') {
                    this.position += 2;
                    let name = this.parseElementEnd();
                    if (element instanceof TElement && element.tagName == name) {
                        this.openElements.pop();
                    } else {
                        throw new Error(`Element <${name}> not opened as last`);
                    }
                } else {
                    this.position++;
                    let result = this.parseElement();
                    element.children.push(result.element)
                    if (!result.autoclose)
                        this.openElements.push(result.element);
                }
            } else if (char == '{' && this.text[this.position + 1] == '{') {
                this.position += 2;

                let result = this.parseExpression('}}');
                let node = new TExpressionText();
                node.expression = result;
                element.children.push(node)
            } else {
                if (!last || !(last instanceof TText)) {
                    last = new TText();
                    element.children.push(last);
                }
                last.text += char;
                this.position++;
            }
        }
        return this.openElements[0];
    }

    parseElement() {
        let autoclose = false;
        let element = new TElement();
        element.tagName = "";
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (char == '>' || char == ' ' || char == '/')
                break;
            element.tagName += char;
            this.position++;
        }

        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (char == '>') {
                this.position++;
                break;
            } else if (char == '/') {
                this.position++;
                autoclose = true;
            } else if (/\s/.test(char)) {
                this.position++;
            } else {
                let type = 'static'
                if (char == ':') {
                    this.position++;
                    type = 'expression'
                }
                let name = this.readUntill(/[\s=]/);
                let value = null;
                this.skipWhitespace()
                if (this.text[this.position] == '=') {
                    this.position++
                    this.skipWhitespace()

                    if (this.text[this.position] == '"') {
                        this.position++
                        value = this.readUntill(/"/);
                        this.position++
                    } else if (this.text[this.position] == "'") {
                        this.position++
                        value = this.readUntill(/'/);
                        this.position++
                    } else {
                        value = this.readUntill(/[\s/]/);
                    }
                }
                if (type == 'static')
                    element.attributes.push(new TAttribute(name, value))
                else
                    element.attributes.push(new TExpressionAttribute(name, ExpressionParser.Parse(value)))
            }
        }
        return {element, autoclose};
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

    parseElementEnd() {
        let name = "";
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (char == '>' || char == ' ' || char == '/')
                break;
            name += char;
            this.position++;
        }

        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (char == '>') {
                this.position++;
                break;
            }
            this.position++;
        }
        return name;
    }

    parseExpression(end) {
        let text = "";
        while (this.position < this.text.length) {
            if (this.text.slice(this.position, this.position + end.length) == end) {
                this.position += end.length;
                break;
            }
            text += this.text[this.position];
            this.position++;
        }
        return ExpressionParser.Parse(text);
    }

    skipWhitespace() {
        this.readUntill(/\S/)
    }
}
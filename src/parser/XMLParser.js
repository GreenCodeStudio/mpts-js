import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TText} from "../nodes/TText";
import {TElement} from "../nodes/TElement";
import {re} from "@babel/core/lib/vendor/import-meta-resolve";
import {TEVariable} from "../nodes/expressions/TEVariable";
import {TExpressionText} from "../nodes/TExpressionText";

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
                    this.position+=2;
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
            }
            if (char == '/') {
                autoclose = true;
            }
            this.position++;
        }
        return {element, autoclose};
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
        let name = "";
        while (this.position < this.text.length) {
            if (this.text.slice(this.position, this.position + end.length) == end) {
                this.position += end.length;
                break;
            }
            name += this.text[this.position];
            this.position++;
        }
        let variable = new TEVariable();
        variable.name = name;
        return variable;
    }
}
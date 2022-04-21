import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TText} from "../nodes/TText";
import {TElement} from "../nodes/TElement";
import {re} from "@babel/core/lib/vendor/import-meta-resolve";
import {TEVariable} from "../nodes/expressions/TEVariable";
import {TExpressionText} from "../nodes/TExpressionText";
import {TAttribute} from "../nodes/TAttribute";
import {TIf} from "../nodes/TIf";
import {ExpressionParser} from "./ExpressionParser";
import {TEString} from "../nodes/expressions/TEString";

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

                    if (name.startsWith(':')) {
                        this.closeSpecialElement(name, this.openElements);
                    } else if (element instanceof TElement && element.tagName == name) {
                        this.openElements.pop();
                    } else {
                        throw new Error(`Element <${name}> not opened as last`);
                    }
                } else {
                    this.position++;
                    let result = this.parseElement();
                    if (result.element.tagName.startsWith(':')) {
                        this.convertToSpecialElement(result, element);

                    } else {
                        element.children.push(result.element)
                        if (!result.autoclose)
                            this.openElements.push(result.element);
                    }
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
        element.parsePosition = this.position;
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
                let name = this.readUntill(/[\s=]/);
                let value = null;
                this.skipWhitespace()
                if (this.text[this.position] == '=') {
                    this.position++
                    this.skipWhitespace()

                    if (this.text[this.position] == '"') {
                        this.position++
                        value = new TEString(this.readUntill(/"/));
                        this.position++
                    } else if (this.text[this.position] == "'") {
                        this.position++
                        value = new TEString(this.readUntill(/'/));
                        this.position++
                    } else if (this.text[this.position] == "(") {
                        this.position++
                        value = ExpressionParser.Parse(this.readUntill(/\)/));
                        this.position++
                    } else {
                        value = ExpressionParser.Parse(this.readUntill(/[\s>/]/));
                    }
                }
                element.attributes.push(new TAttribute(name, value))
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

    convertToSpecialElement(result, element) {
        if (result.element.tagName.toLowerCase() == ':if') {
            let node = new TIf();
            const expression = result.element.attributes.find(x => x.name == 'condition').expression;
            node.conditions.push({expression, children: []});
            element.children.push(node);

            if (!result.autoclose)
                this.openElements.push(node);
        } else if (result.element.tagName.toLowerCase() == ':else-if') {
            const last = element.children[element.children.length - 1];
            if (!(last instanceof TIf && last.else == null))
                throw new Error("need if before else-if")

            const expression = result.element.attributes.find(x => x.name == 'condition').expression;
            last.conditions.push({expression, children: []});

            if (!result.autoclose)
                this.openElements.push(last);
        } else if (result.element.tagName.toLowerCase() == ':else') {
            const last = element.children[element.children.length - 1];
            if (!(last instanceof TIf && last.else == null))
                throw new Error("need if before else")

            last.else = {children: []};
            if (!result.autoclose)
                this.openElements.push(last);
        }
    }

    closeSpecialElement(tagName, openElements) {
        const last = openElements[openElements.length - 1]
        if (tagName.toLowerCase() == ':if') {
            if (last instanceof TIf && last.conditions.length == 1 && last.else == null) {
                openElements.pop()
            } else {
                throw new Error("Last opened element is not <:if>");
            }
        } else if (tagName.toLowerCase() == ':else-if') {
            if (last instanceof TIf && last.conditions.length > 1 && last.else == null) {
                openElements.pop()
            } else {
                throw new Error("Last opened element is not <:else-if>");
            }

        } else if (tagName.toLowerCase() == ':else') {
            if (last instanceof TIf && last.else != null) {
                openElements.pop()
            } else {
                throw new Error("Last opened element is not <:else>");
            }
        }
    }
}
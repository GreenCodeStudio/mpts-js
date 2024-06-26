import {TDocumentFragment} from "../nodes/TDocumentFragment.js";
import {TText} from "../nodes/TText.js";
import {TElement} from "../nodes/TElement.js";
import {TExpressionText} from "../nodes/TExpressionText.js";
import {TAttribute} from "../nodes/TAttribute.js";
import {TIf} from "../nodes/TIf.js";
import {ExpressionParser} from "./ExpressionParser.js";
import {AbstractParser} from "./AbstractParser.js";
import {TLoop} from "../nodes/TLoop.js";
import {TComment} from "../nodes/TComment.js";
import {TForeach} from "../nodes/TForeach.js";
import {TExpressionSubnode} from "../nodes/TExpressionSubnode.js";

export class AbstractMLParser extends AbstractParser {
    constructor(text) {
        super();
        this.text = text;
        this.position = 0;
        this.openElements = [new TDocumentFragment()];
    }


    parseNormal() {
        while (this.position < this.text.length) {
            const positionCopy = this.position;
            const char = this.text[this.position];
            let element = this.openElements[this.openElements.length - 1];
            let last = element.children[element.children.length - 1];
            if (char == '<') {
                if (this.text.substr(this.position, 2) == '<<') {
                    this.position += 2;
                    let result = this.parseExpression('>>');
                    let node = new TExpressionSubnode();
                    node.expression = result;
                    element.children.push(node)
                } else if (this.text.substr(this.position, 4) == '<!--') {
                    this.position += 4;
                    let text = this.readUntilText('-->');
                    this.position += 3;
                    element.children.push(new TComment(text))
                } else if (this.text[this.position + 1] == '/') {
                    this.position += 2;
                    let name = this.parseElementEnd();

                    if (name.startsWith(':')) {
                        this.closeSpecialElement(name, this.openElements);
                    } else if (element instanceof TElement && element.tagName == name) {
                        this.openElements.pop();
                    } else if (this.allowAutoClose && this.openElements.some(e => e instanceof TElement && e.tagName == name)) {
                        this.openElements.reverse();
                        const closing = this.openElements.find(e => e instanceof TElement && e.tagName == name)
                        this.openElements.splice(0, this.openElements.indexOf(closing) + 1);
                        this.openElements.reverse();
                    } else {
                        this.position = positionCopy;
                        this.throw(`Last opened element is not <${name}>`);
                    }
                } else {
                    this.position++;
                    let result = this.parseElement();
                    if (result.element.tagName.startsWith(':')) {
                        this.convertToSpecialElement(result, element);

                    } else {
                        this.addElement(result.element, result.autoclose)
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
        if (this.openElements.length > 1 && !this.allowAutoClose) {
            this.throw(`Element <${this.openElements[this.openElements.length - 1].tagName}> not closed`)
        }
        return this.openElements[0];
    }

    parseElement() {
        let autoclose = false;
        let element = new TElement();
        element.parsePosition = this.position;
        while (this.position < this.text.length) {
            const char = this.text[this.position];
            if (char == '>' || char == ' ' || char == '/')
                break;
            element.tagName += char;
            this.position++;
        }

        while (this.position < this.text.length) {
            let char = this.text[this.position];
            if (char == '>') {
                this.position++;
                break;
            } else if (char == '/') {
                this.position++;
                autoclose = true;
            } else if (/\s/.test(char)) {
                this.position++;
            } else {
                let name = this.readUntil(/[\s=/]/);
                let value = null;
                this.skipWhitespace()
                char = this.text[this.position];
                if (char == '=') {
                    this.position++
                    this.skipWhitespace()

                    const char2 = this.text[this.position];
                    const parser = new ExpressionParser(this.text.substring(this.position));
                    value = parser.parseNormal()
                    this.position += parser.position;
                }
                element.attributes.push(new TAttribute(name, value))
            }
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
        let text = "";
        while (this.position < this.text.length) {
            if (this.text.substring(this.position, this.position + end.length) == end) {
                this.position += end.length;
                break;
            }
            text += this.text[this.position];
            this.position++;
        }
        return ExpressionParser.Parse(text);
    }

    clearLastWhitespace(element) {
        while (element.children.length > 0) {
            const last = element.children[element.children.length - 1];
            if (last instanceof TText && last.text.trim() == "") {
                element.children.pop();
            } else {
                break;
            }
        }
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
            this.clearLastWhitespace(element);
            const last = element.children[element.children.length - 1];
            if (!(last instanceof TIf && last.else == null))
                this.throw("need if before else-if")

            const expression = result.element.attributes.find(x => x.name == 'condition').expression;
            last.conditions.push({expression, children: []});

            if (!result.autoclose)
                this.openElements.push(last);
        } else if (result.element.tagName.toLowerCase() == ':else') {
            this.clearLastWhitespace(element);
            const last = element.children[element.children.length - 1];
            if (!(last instanceof TIf && last.else == null))
                this.throw("need if before else")

            last.else = {children: []};
            if (!result.autoclose)
                this.openElements.push(last);
        } else if (result.element.tagName.toLowerCase() == ':loop') {
            let count = result.element.attributes.find(x => x.name == 'count').expression;
            let node = new TLoop(count);

            element.children.push(node);

            if (!result.autoclose)
                this.openElements.push(node);
        } else if (result.element.tagName.toLowerCase() == ':foreach') {
            let collection = result.element.attributes.find(x => x.name == 'collection').expression;
            let item = result.element.attributes.find(x => x.name == 'item')?.expression.name;
            let key = result.element.attributes.find(x => x.name == 'key')?.expression.name;
            let node = new TForeach(collection, item, key);

            element.children.push(node);

            if (!result.autoclose)
                this.openElements.push(node);
        }
    }


    closeSpecialElement(tagName) {
        tagName = tagName.toLowerCase();
        const last = this.openElements[this.openElements.length - 1]
        if (tagName == ':if') {
            if (last instanceof TIf && last.conditions.length == 1 && last.else == null) {
                this.openElements.pop()
            } else {
                this.throw("Last opened element is not <:if>");
            }
        } else if (tagName == ':else-if') {
            if (last instanceof TIf && last.conditions.length > 1 && last.else == null) {
                this.openElements.pop()
            } else {
                this.throw("Last opened element is not <:else-if>");
            }

        } else if (tagName == ':else') {
            if (last instanceof TIf && last.else != null) {
                this.openElements.pop()
            } else {
                this.throw("Last opened element is not <:else>");
            }
        } else if (tagName == ':loop') {
            if (last instanceof TLoop) {
                this.openElements.pop()
            } else {
                this.throw("Last opened element is not <:loop>");
            }
        } else if (tagName == ':foreach') {
            if (last instanceof TForeach) {
                this.openElements.pop()
            } else {
                this.throw("Last opened element is not <:foreach>");
            }
        }
    }
}

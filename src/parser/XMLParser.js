import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TText} from "../nodes/TText";
import {TElement} from "../nodes/TElement";
import {re} from "@babel/core/lib/vendor/import-meta-resolve";

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
                this.position++;
                let result = this.parseElement();
                element.children.push(result.element)
                if (!result.autoclose)
                    this.openElements.push(element);
            } else if (char == '{' && this.text[this.position + 1] == '{') {
                this.position++;
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
}
import {XMLParser} from "./XMLParser";
import {AbstractMLParser} from "./AbstractMLParser";
import {TElement} from "../nodes/TElement";

export class HTMLParser extends AbstractMLParser {
    voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    onlySiblingsElements = ['li', 'dt', 'dd', 'p', 'rt', 'rp', 'optgroup', 'option', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th'];
    allowAutoClose = true;

    static Parse(text) {
        return (new HTMLParser(text)).parseNormal();
    }

    addElement(element, autoclose = false) {
        let parent = this.openElements[this.openElements.length - 1];
        if (parent instanceof TElement && this.onlySiblingsElements.includes(element.tagName.toLowerCase()) && parent.tagName.toLowerCase()===element.tagName.toLowerCase()){
            this.openElements.pop();
            parent = this.openElements[this.openElements.length - 1];
        }
        parent.children.push(element)
        if (!autoclose && !this.voidElements.includes(element.tagName.toLowerCase()))
            this.openElements.push(element);
    }
}

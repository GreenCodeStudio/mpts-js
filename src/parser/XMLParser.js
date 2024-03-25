import {TDocumentFragment} from "../nodes/TDocumentFragment";
import {TText} from "../nodes/TText";
import {TElement} from "../nodes/TElement";
import {TEVariable} from "../nodes/expressions/TEVariable";
import {TExpressionText} from "../nodes/TExpressionText";
import {TAttribute} from "../nodes/TAttribute";
import {TIf} from "../nodes/TIf";
import {ExpressionParser} from "./ExpressionParser";
import {TEString} from "../nodes/expressions/TEString";
import {AbstractParser} from "./AbstractParser";
import {TLoop} from "../nodes/TLoop";
import {TComment} from "../nodes/TComment";
import {TForeach} from "../nodes/TForeach";
import {MptsParserError} from "./MptsParserError";
import {AbstractMLParser} from "./AbstractMLParser";

export class XMLParser extends AbstractMLParser {
    voidElements=[];
    allowAutoClose = false;
    constructor(text) {
        super();
        this.text = text;
        this.position = 0;
        this.openElements = [new TDocumentFragment()];
    }

    static Parse(text) {
        return (new XMLParser(text)).parseNormal();
    }
    addElement(element, autoclose=false){
        let parent = this.openElements[this.openElements.length - 1];
        parent.children.push(element)
        if (!autoclose)
            this.openElements.push(element);
    }
}

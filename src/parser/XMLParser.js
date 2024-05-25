import {TDocumentFragment} from "../nodes/TDocumentFragment.js";
import {TText} from "../nodes/TText.js";
import {TElement} from "../nodes/TElement.js";
import {TEVariable} from "../nodes/expressions/TEVariable.js";
import {TExpressionText} from "../nodes/TExpressionText.js";
import {TAttribute} from "../nodes/TAttribute.js";
import {TIf} from "../nodes/TIf.js";
import {ExpressionParser} from "./ExpressionParser.js";
import {TEString} from "../nodes/expressions/TEString.js";
import {AbstractParser} from "./AbstractParser.js";
import {TLoop} from "../nodes/TLoop.js";
import {TComment} from "../nodes/TComment.js";
import {TForeach} from "../nodes/TForeach.js";
import {MptsParserError} from "./MptsParserError.js";
import {AbstractMLParser} from "./AbstractMLParser.js";

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
    addElement(element, selfclose=false){
        let parent = this.openElements[this.openElements.length - 1];
        parent.children.push(element)
        if (!selfclose)
            this.openElements.push(element);
    }
}

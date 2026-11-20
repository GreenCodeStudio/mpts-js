import {getUniqName} from "../utils.js";
import {TNode} from "./TNode.js";

export class TDocumentType extends TNode{
    content = ''

    execute(env) {
        let ret = env.document.createDocumentType(this.content);
        return ret;
    }

    compileJS(scopedVariables=new Set()) {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createDocumentType(' + JSON.stringify(this.content) + ');';
        return {code, rootName};
    }
    compileJSVue(scopedVariables = new Set()) {
        return ``;
    }
}

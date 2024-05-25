import {getUniqName} from "../utils.js";
import he from "he";
import {TNode} from "./TNode.js";

export class TText extends TNode{
    text = "";

    execute(env) {
        return env.document.createTextNode(he.decode(this.text));
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createTextNode(' + JSON.stringify(he.decode(this.text)) + ');';
        return {code, rootName};
    }

    compileJSVue(scopedVariables = new Set()) {
        return JSON.stringify(this.text);
    }
}

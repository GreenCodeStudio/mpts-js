import {getUniqName} from "../utils.js";
import he from "he";
import {TNode} from "./TNode.js";

export class TComment extends TNode {
    text = "";

    constructor(text = "") {
        super();
        this.text = text;
    }

    execute(env) {
        return env.document.createComment(he.decode(this.text));
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createComment(' + JSON.stringify(he.decode(this.text)) + ');';
        return {code, rootName};
    }
}

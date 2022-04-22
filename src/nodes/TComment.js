import {getUniqName} from "../utils";
import he from "he";
import {TNode} from "./TNode";

export class TComment extends TNode{
    text = "";

    execute(env) {
        return env.document.createComment(he.decode(this.text));
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createComment(' + JSON.stringify(he.decode(this.text)) + ');';
        return {code, rootName};
    }
}
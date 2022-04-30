import {getUniqName} from "../utils";
import he from "he";
import {TText} from "./TText";
import {TNode} from "./TNode";

export class TExpressionText extends TNode{
    expression = null;

    execute(env) {
        return env.document.createTextNode(this.expression.execute(env));
    }

    compileJS(scopedVariables = new Set()) {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createTextNode(' + this.expression.compileJS(scopedVariables).code + ');';
        return {code, rootName};
    }
}
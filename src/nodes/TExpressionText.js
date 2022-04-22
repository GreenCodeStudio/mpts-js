import {getUniqName} from "../utils";
import he from "he";
import {TText} from "./TText";
import {TNode} from "./TNode";

export class TExpressionText extends TNode{
    expression = null;

    execute(env) {
        return env.document.createTextNode(this.expression.execute(env));
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createTextNode(' + this.expression.compileJS().code + ');';
        return {code, rootName};
    }
}
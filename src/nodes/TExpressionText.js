import {getUniqName} from "../utils.js";
import {TNode} from "./TNode.js";

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
    compileJSVue(scopedVariables = new Set()) {
        return this.expression.compileJS(scopedVariables).code;
    }
}

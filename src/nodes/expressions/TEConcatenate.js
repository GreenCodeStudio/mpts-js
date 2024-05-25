import {TEExpression} from "./TEExpression.js";

export class TEConcatenate extends TEExpression {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    execute(env) {
        return (''+this.left.execute(env))+this.right.execute(env);
    }
    compileJS(scopedVariables = new Set()) {
        let code="(''+";
        code+=this.left.compileJS(scopedVariables).code;
        code+='+';
        code+=this.right.compileJS(scopedVariables).code;
        code+=')';
        return {code};
    }
}

import {TEExpression} from "./TEExpression";

export class TEOrNull extends TEExpression {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    execute(env) {
        let subEnv={...env, allowUndefined:true};
        let left=this.left.execute(subEnv)
        if (left != null) {
            return left;
        } else {
            return this.right.execute(env);
        }
    }
    compileJS(scopedVariables = new Set()) {
        let code='(';
        code+=this.left.compileJS(scopedVariables).code;
        code+='??';
        code+=this.right.compileJS(scopedVariables).code;
        code+=')';
        return {code};
    }
}
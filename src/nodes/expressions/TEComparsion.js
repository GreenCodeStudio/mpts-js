import {TEExpression} from "./TEExpression.js";

export class TEComparsion extends TEExpression {
    constructor(left, right, isGreaterThan, orEqual) {
        super();
        this.left = left;
        this.right = right;
        this.isGreaterThan = isGreaterThan;
        this.orEqual = orEqual;
    }
    execute(env) {
        const l=this.left.execute(env);
        const r=this.right.execute(env);
        if(this.isGreaterThan){
            if(this.orEqual){
                return l>=r;
            }else{
                return l>r;
            }
        }else{
            if(this.orEqual){
                return l<=r;
            }else{
                return l<r;
            }
        }
    }
    compileJS(scopedVariables = new Set()) {
        const l=this.left.compileJS(scopedVariables);
        const r=this.right.compileJS(scopedVariables);
        let code="(";
        code+=l.code;
        if(this.isGreaterThan){
            code+=this.orEqual?'>=':'>';
        }else{
            code+=this.orEqual?'<=':'<';
        }
        code+=r.code;
        code+=')';
        return {code};
    }
}

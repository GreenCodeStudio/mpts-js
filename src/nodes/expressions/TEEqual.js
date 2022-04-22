import {TEExpression} from "./TEExpression";

export class TEEqual extends TEExpression {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    execute(env) {
        return this.left.execute(env)==this.right.execute(env);
    }
}
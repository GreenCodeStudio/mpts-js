export class TEEqual {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    execute(env) {
        return this.left.execute(env)==this.right.execute(env);
    }
}
import {TEExpression} from "./TEExpression.js";

export class TENegate extends TEExpression {
    constructor(value) {
        super();
        this.value = value;
    }
    execute(env) {
        return (!this.value.execute(env));
    }
    compileJS(scopedVariables = new Set()) {
        let code="(!(";
        code+=this.value.compileJS(scopedVariables).code;
        code+='))';
        return {code};
    }
}

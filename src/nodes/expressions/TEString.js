import {TEExpression} from "./TEExpression.js";

export class TEString extends TEExpression {
    value = "";

    constructor(value = "") {
        super();
        this.value = "" + value;
    }

    execute(env) {
        return "" + this.value;
    }

    compileJS() {
        let code = JSON.stringify("" + this.value);

        return {code};
    }
}

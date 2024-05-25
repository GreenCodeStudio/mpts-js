import {TEExpression} from "./TEExpression.js";

export class TEBoolean extends TEExpression{
    value = false;

    constructor(value = false) {
        super();
        this.value = value;
    }

    execute(env) {
        return !!this.value;
    }

    compileJS() {
        let code = this.value?'true':'false';
        return {code};
    }
}

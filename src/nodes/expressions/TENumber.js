import {getUniqName} from "../../utils";
import {TEExpression} from "./TEExpression";

export class TENumber extends TEExpression {
    value = NaN;

    constructor(value = 0) {
        super();
        this.value = +value;
    }

    execute(env) {
        return +this.value;
    }

    compileJS() {
        let code = JSON.stringify(+this.value);
        return {code};
    }
}
import {getUniqName} from "../../utils";
import {TEExpression} from "./TEExpression";

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
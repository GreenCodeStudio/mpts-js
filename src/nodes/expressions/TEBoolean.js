import {getUniqName} from "../../utils";
import {TEExpression} from "./TEExpression";

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
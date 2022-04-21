import {getUniqName} from "../../utils";

export class TENumber {
    value = "";

    constructor(value = 0) {
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
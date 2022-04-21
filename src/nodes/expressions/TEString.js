import {getUniqName} from "../../utils";

export class TEString {
    value = "";

    constructor(value = "") {
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
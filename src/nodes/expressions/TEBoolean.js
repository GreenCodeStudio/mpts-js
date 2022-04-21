import {getUniqName} from "../../utils";

export class TEBoolean {
    value = false;

    constructor(value = false) {
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
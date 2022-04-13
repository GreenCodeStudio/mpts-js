import {getUniqName} from "../../utils";

export class TEVariable {
    name = "";

    constructor(name = "") {
        this.name = name;
    }

    execute(env) {
        return env.variables[this.name];
    }

    compileJS() {
        let code = 'variables[' + JSON.stringify(this.name) + ']';
        return {code};
    }
}
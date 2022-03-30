import {getUniqName} from "../../utils";

export class TEVariable{
    name = "";

    execute(env) {
        return env.variables[this.name];
    }

    compileJS() {
        let code = 'variables['+JSON.stringify(this.name)+']';
        return {code};
    }
}
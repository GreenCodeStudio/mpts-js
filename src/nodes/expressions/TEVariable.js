import {getUniqName} from "../../utils";
import {TEExpression} from "./TEExpression";

export class TEVariable extends TEExpression {
    name = "";

    constructor(name = "") {
        super();
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
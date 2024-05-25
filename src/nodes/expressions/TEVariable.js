import {TEExpression} from "./TEExpression.js";

export class TEVariable extends TEExpression {
    name = "";

    constructor(name = "") {
        super();
        this.name = name;
    }

    execute(env) {
        return env.variables[this.name];
    }

    compileJS(scopedVariables = new Set()) {
        let code;
        if (scopedVariables.has(this.name)) {
            code = this.safeJsName(this.name);
        } else {
            code = 'variables[' + JSON.stringify(this.name) + ']';
        }
        return {code};
    }
}

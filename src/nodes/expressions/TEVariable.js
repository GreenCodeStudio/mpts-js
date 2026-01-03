import {TEExpression} from "./TEExpression.js";

export class TEVariable extends TEExpression {
    name = "";

    constructor(name = "", codePosition = null) {
        super();
        this.name = name;
        this.codePosition = codePosition;
    }

    execute(env) {
        if (env.allowUndefined) {
            return env.variables[this.name] ?? null;
        } else {
            if (this.name in env.variables) {
                return env.variables[this.name];
            } else {
                this.throw("Undefined variable: " + this.name);
            }
        }
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

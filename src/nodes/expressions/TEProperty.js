import {TEExpression} from "./TEExpression.js";

export class TEProperty extends TEExpression {
    source = "";
    name = "";
    orNull = false;

    constructor(source, name = "", orNull = false) {
        super();
        this.source = source;
        this.name = name;
        this.orNull = orNull;
    }

    execute(env) {
        let clonedEnv = env.scope();
        let parent = this.source.execute(clonedEnv);
        if (this.orNull || clonedEnv.allowUndefined) {
            env.allowUndefined = true;
        }
        if (env.allowUndefined) {
            parent = parent ?? {}
            return parent[this.name] ?? null;
        } else {
            if (parent === null || parent === undefined || !(this.name in parent)) {
                this.throw(`Undefined property: ${this.name}`);
            }
            return parent[this.name];
        }
    }

    compileJS(scopedVariables = new Set()) {
        let code = this.source.compileJS(scopedVariables).code + '[' + JSON.stringify(this.name) + ']';
        return {code};
    }
}

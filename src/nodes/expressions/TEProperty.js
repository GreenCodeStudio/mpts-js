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
        let parent = this.source.execute(env);
        if (env.allowUndefined)
            parent = parent ?? {}
        return parent[this.name];
    }

    compileJS(scopedVariables = new Set()) {
        let code = this.source.compileJS(scopedVariables).code + '[' + JSON.stringify(this.name) + ']';
        return {code};
    }
}

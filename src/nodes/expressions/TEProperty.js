import {getUniqName} from "../../utils";
import {TEExpression} from "./TEExpression";

export class TEProperty extends TEExpression {
    source = "";
    name = "";

    constructor(source, name = "") {
        super();
        this.source = source;
        this.name = name;
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
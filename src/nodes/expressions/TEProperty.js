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
        return this.source.execute(env)[this.name];
    }

    compileJS(scopedVariables=new Set()) {
        let code = this.source.compileJS(scopedVariables).code + '[' + JSON.stringify(this.name) + ']';
        return {code};
    }
}
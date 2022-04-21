import {getUniqName} from "../utils";
import he from "he";
import {TText} from "./TText";

export class TExpressionText extends TText{
    expression = null;

    execute(env) {
        return env.document.createTextNode(this.expression.execute(env));
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createTextNode(' + this.expression.compileJS().code + ');';
        return {code, rootName};
    }
}
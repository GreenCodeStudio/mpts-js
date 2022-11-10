import {getUniqName} from "../utils";
import {TNode} from "./TNode";

export class TIf extends TNode {
    conditions = []
    else = null;

    execute(env) {
        for (const condition of this.conditions) {
            if (condition.expression.execute(env)) {
                return this.executeCondition(condition, env)
            }
        }
        if (this.else) {
            return this.executeCondition(this.else, env)
        }
        return null;
    }

    executeCondition(condition, env) {
        if (condition.children.length == 1)
            return condition.children[0].execute(env)

        let ret = env.document.createDocumentFragment();
        for (const child of condition.children) {
            ret.appendChild(child.execute(env))
        }
        return ret;
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'let ' + rootName + '=document.createDocumentFragment();';
        for (const condition of this.conditions) {
            code += ((condition == this.conditions[0]) ? 'if' : 'else if')
                + '(' + condition.expression.compileJS().code + '){'
            for (const child of condition.children) {
                let childResult = child.compileJS();
                code += childResult.code;
                code += rootName + ".append(" + childResult.rootName + ");"
            }
            code += '}'
        }
        return {code, rootName};
    }

    get children() {
        if (this.else) return this.else.children
        else return this.conditions[this.conditions.length - 1].children;
    }
}
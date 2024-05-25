import {getUniqName} from "../utils.js";
import {TNode} from "./TNode.js";

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

    compileJS(scopedVariables) {
        let rootName = getUniqName();
        let code = 'let ' + rootName + '=document.createDocumentFragment();';
        for (const condition of this.conditions) {
            code += ((condition == this.conditions[0]) ? 'if' : 'else if')
                + '(' + condition.expression.compileJS(scopedVariables).code + '){'
            for (const child of condition.children) {
                let childResult = child.compileJS(scopedVariables);
                code += childResult.code;
                code += rootName + ".append(" + childResult.rootName + ");"
            }
            code += '}'
        }
        if (this.else) {
            code += 'else{'
            for (const child of this.else.children) {
                let childResult = child.compileJS(scopedVariables);
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
    compileJSVue(scopedVariables = new Set()) {
        let code=this.else?.compileJSVue(scopedVariables).code;
        for(let condition of [...this.conditions].reverse()){
            code=`(${condition.expression.compileJS(scopedVariables).code} ? ([${condition.children.map(c=>c.compileJSVue(scopedVariables)).join(',')}]) : ${code})`;
        }
        return code;
    }
}

import {getUniqName} from "../utils";
import {TNode} from "./TNode";

export class TElement extends TNode {
    tagName = "";
    children = [];
    attributes = [];

    execute(env) {
        let ret = env.document.createElement(this.tagName);
        for (const attr of this.attributes) {
            if (attr.expression) {
                let value = attr.expression.execute(env);
                if (typeof value === 'function')
                    ret[attr.name] = value;
                else
                    ret.setAttribute(attr.name, attr.expression.execute(env));
            } else
                ret.setAttribute(attr.name, attr.name);
        }
        for (const child of this.children) {
            ret.appendChild(child.execute(env))
        }
        return ret;
    }

    compileJS(scopedVariables = new Set()) {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createElement(' + JSON.stringify(this.tagName) + ');';
        for (const attr of this.attributes) {
            if (attr.expression) {
                let attrValueName = getUniqName();
                code+=attrValueName+'='+attr.expression.compileJS(scopedVariables).code+';';
                code+=`if(typeof ${attrValueName}==='function')${rootName}[${JSON.stringify(attr.name)}]=${attrValueName};else ${rootName}.setAttribute(${JSON.stringify(attr.name)},${attrValueName});`;
            }
            else
                code += rootName + ".setAttribute(" + JSON.stringify(attr.name) + ", " + JSON.stringify(attr.name) + ");";
        }
        for (const child of this.children) {
            let childResult = child.compileJS(scopedVariables);
            code += childResult.code;
            code += rootName + ".append(" + childResult.rootName + ");"
        }
        return {code, rootName};
    }
}
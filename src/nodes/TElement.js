import {getUniqName} from "../utils";

export class TElement {
    tagName = "";
    children = [];
    attributes = [];

    execute(env) {
        let ret = env.document.createElement(this.tagName);
        for (const child of this.children) {
            ret.appendChild(child.execute(env))
        }
        return ret;
    }

    compileJS() {
        let rootName = getUniqName();
        let code = 'const ' + rootName + '=document.createElement(' + JSON.stringify(this.tagName) + ');';
        for (const child of this.children) {
            let childResult = child.compileJS();
            code += childResult.code;
            code += rootName + ".append(" + childResult.rootName + ");"
        }
        return {code, rootName};
    }
}
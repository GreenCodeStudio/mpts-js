import {TNode} from "./TNode";
import {getUniqName} from "../utils";

export class TForeach extends TNode {
    children = [];

    constructor(collection, item = null, key = null) {
        super();
        this.collection = collection;
        this.item = item;
        this.key = key;
    }

    execute(env) {
        let ret = env.document.createDocumentFragment();
        let collection = this.collection.execute(env);
        let i = 0;
        for (let x of collection) {
            for (const child of this.children) {
                let envScoped = env.scope();
                if (this.item)
                    envScoped.variables[this.item] = x;

                if (this.key)
                    envScoped.variables[this.key] = i;

                ret.appendChild(child.execute(envScoped))
            }
            i++;
        }
        return ret;
    }

    compileJS(scopedVariables = new Set()) {
        let rootName = getUniqName();
        let code = 'let ' + rootName + '=document.createDocumentFragment();';

        code += 'for(let [_foreachKey,_foreachValue] of Object.entries(' + this.collection.compileJS().code + ')){';
        let subScope = new Set(Array.from(scopedVariables));

        if (this.key) {
            code += 'let ' + this.key + ' = _foreachKey;'
            subScope.add(this.key);
        }
        if (this.item) {
            code += 'let ' + this.item + ' = _foreachValue;'
            subScope.add(this.item);
        }
        for (const child of this.children) {
            let childResult = child.compileJS(subScope);
            code += childResult.code;
            code += rootName + ".append(" + childResult.rootName + ");"
        }
        code += '}';
        return {code, rootName};
    }
}
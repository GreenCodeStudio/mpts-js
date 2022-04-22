import {TNode} from "./TNode";

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
}
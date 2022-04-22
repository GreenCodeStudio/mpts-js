export class Environment {
    allowExecution = false;
    variables = {};
    document = global.document;

    scope(newVariables = {}) {
        let ret = new Environment();
        ret.allowExecution = this.allowExecution;
        ret.variables = Object.create(this.variables);
        ret.document = this.document;
        Object.assign(ret.variables, newVariables);
        return ret;
    }
}
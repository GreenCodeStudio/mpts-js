import {TAttribute} from "./TAttribute";

export class TExpressionAttribute extends TAttribute {
    constructor(name, expression) {
        super(name, null);
        this.expression = expression;
    }
}
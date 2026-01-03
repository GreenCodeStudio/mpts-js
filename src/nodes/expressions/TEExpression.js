import {MptsExecutionError} from "../../MptsExecutionError.js";

export class TEExpression {
    safeJsName(name) {
        return name.replace(/\r\n\(\)\./g, '')
    }

    throw(message) {
        throw new MptsExecutionError(message, this.codePosition);
    }
}

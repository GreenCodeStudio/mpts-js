export class TEExpression {
    safeJsName(name){
        return name.replace(/\r\n\(\)\./g, '')
    }
}
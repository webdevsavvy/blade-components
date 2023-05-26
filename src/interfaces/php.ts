/* eslint-disable @typescript-eslint/naming-convention */
export enum PhpVariableType {
    STRING,
    OBJECT,
    ARRAY,
    INTEGER,
    FLOAT,
}

export class PhpVariable {

    public name: string;
    public type: PhpVariableType;

    constructor(type: string|null, name: string) {
        this.name = name;
        switch (type) {
            case 'string':
                this.type = PhpVariableType.STRING;
                break;
            case 'array':
                this.type = PhpVariableType.ARRAY;
                break;
            case 'int':
            case 'integer':
                this.type = PhpVariableType.INTEGER;
                break;
            case 'float':
                this.type = PhpVariableType.FLOAT;
                break;
            case 'object':
                this.type = PhpVariableType.OBJECT;
                break;
            default:
                this.type = PhpVariableType.OBJECT;
        }
    }

    attributeSnippetString(index = 1) {
        switch (this.type) {
            case PhpVariableType.STRING:
                return `${this.name}="$${index}"`;
            default:
                return `:${this.name}="$${index}"`;
        }
    }

}
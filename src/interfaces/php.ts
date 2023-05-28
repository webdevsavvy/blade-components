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

    constructor(type: string | null, name: string) {
        this.name = name;
        switch (type) {
            case "string":
                this.type = PhpVariableType.STRING;
                break;
            case "array":
                this.type = PhpVariableType.ARRAY;
                break;
            case "int":
            case "integer":
                this.type = PhpVariableType.INTEGER;
                break;
            case "float":
                this.type = PhpVariableType.FLOAT;
                break;
            case "object":
                this.type = PhpVariableType.OBJECT;
                break;
            default:
                this.type = PhpVariableType.OBJECT;
        }
    }

    attributeSnippetString(index = 1): string {
        switch (this.type) {
            case PhpVariableType.STRING:
                return `${this.name}="$${index}"`;
            default:
                return `:${this.name}="$${index}"`;
        }
    }
}

export enum BladePropType {
    UNDEFINED,
    STRING,
    ARRAY,
    OBJECT,
    NUMERIC,
}

function parseDefaults(string: string): [boolean, BladePropType] {
    if (typeof string === 'undefined' || string === null) {
        return [false, BladePropType.UNDEFINED];
    }

    if (string.match(/\[.*\]/) !== null) {
        return [true, BladePropType.ARRAY];
    }

    if (string.match(/\'.*\'/) !== null) {
        return [true, BladePropType.STRING];
    }

    if (string.match(/\d+(?:.\d+)?/) !== null) {
        return [true, BladePropType.NUMERIC];
    }

    if (string.match(/\w+(?:::class)?(?:\(\))/) !== null) {
        return [true, BladePropType.OBJECT];
    }

    return [false, BladePropType.UNDEFINED];
}

export class BladeProp {
    public name: string;
    public hasDefaults: boolean;
    public defaultType: BladePropType;

    constructor(
        name: string,
        hasDefaults: boolean = false,
        defaultType: BladePropType = BladePropType.UNDEFINED
    ) {
        this.name = name;
        this.hasDefaults = hasDefaults;
        this.defaultType = defaultType;
    }

    static fromRawPropString(propString: string): BladeProp {
        const parsedString = propString.match(/\'(.+)\'\s*(?:=>)?\s*([._\(\)\"\'\-]+)?,?/);

        if (parsedString !== null) {
            const name = parsedString[1];
            const rawDefault = parsedString[2];

            if (rawDefault !== null) {
                const [hasDefaults, defaultType] = parseDefaults(rawDefault);
                return new BladeProp(name, hasDefaults, defaultType);
            }

            return new BladeProp(name);
        }

        throw new Error("String does not contain blade prop " + `name:${this.name} parsedString:${parsedString} propString:${propString}`);
    }

    propSnippetString(index: number): string {
        return `${
            this.defaultType !== BladePropType.STRING && this.defaultType !== BladePropType.UNDEFINED ? ":" : ""
        }${this.name.replace(/['=>\s]/g, "")}="$${index}"`;
    }
}

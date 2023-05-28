import * as fs from "fs/promises";
import * as path from "path";
import { undot } from "./strings";
import { BladeProp, PhpVariable } from "../interfaces/php";

export async function fileContainsVariable(
    filePath: string,
    variableName: string
): Promise<boolean | null | undefined> {
    const fileContents = await fs.readFile(filePath, { encoding: "utf-8" });

    return fileContents.includes(variableName);
}

export async function getVariablesFromClassFile(filePath: string) {
    const fileContents = await fs.readFile(filePath, { encoding: "utf-8" });

    return Array.from(fileContents.matchAll(/public\s*(\w*)\s*\$(\w+)/g)).map(
        (val) => new PhpVariable(val[1], val[2] ?? null)
    );
}

export async function getPropsFromBladeFile(filePath: string): Promise<BladeProp[]> {

    const fileContents = await fs.readFile(filePath, { encoding: 'utf-8' });

    const rawProps = /@props\(\[\s*([\'\w,\s=>\[\]\.\\\:\(\)]+)\]\)/gm.exec(fileContents);

    if (rawProps !== null) {

        try {
            if (rawProps[1].includes(",")) {
                const propsArray = rawProps[1].split(",").filter(string => !!string);

                return propsArray.map((prop) => {
                    return BladeProp.fromRawPropString(prop);
                });
            } else {
                return [BladeProp.fromRawPropString(rawProps[1])];
            }
        } catch (error) {
            console.error(error);
        }

    }

    return Promise.resolve([]);
}

export function pathFromDot(string: string): string {
    return undot(string).join(path.sep);
}

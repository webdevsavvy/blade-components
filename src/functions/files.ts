import * as fs from "fs/promises";
import * as path from "path";
import { undot } from "./strings";

export async function fileContainsVariable(
    filePath: string,
    variableName: string
): Promise<boolean | null | undefined> {
    const fileContents = await fs.readFile(filePath, { encoding: "utf-8" });

    return fileContents.includes(variableName);
}

export async function getAttributesFromClassFile(filePath: string) {
    const fileContents = await fs.readFile(filePath, { encoding: "utf-8" });
    const match = /public\s*\w*\s*\$(\w+)/g.exec(fileContents);

    return Array.from(fileContents.matchAll(/public\s*\w*\s*\$(\w+)/g)).map(
        (val) => val[1]
    );
}

export function pathFromDot(string: string): string {
    return undot(string).join(path.sep);
}

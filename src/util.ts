import * as fs from 'fs/promises';

export async function fileContainsVariable(filePath: string, variableName: string): Promise<boolean | null | undefined> {

    const fileContents = await fs.readFile(filePath, { encoding: 'utf-8' });

    return fileContents.includes(variableName);
}

export function kebabToPascal(string: string) {

    function clearUpper(string: string) {
        return string.replace(/-/, '').toUpperCase();
    }

    return string.replace(/(^\w|-\w)/g, clearUpper);
}

export async function getAttributesFromClassFile(filePath:string) {

    const fileContents = await fs.readFile(filePath, { encoding: 'utf-8' });
    const match = /public\s*\w*\s*\$(\w+)/g.exec(fileContents);

    return Array.from(fileContents.matchAll(/public\s*\w*\s*\$(\w+)/g)).map(val => val[1]);
}
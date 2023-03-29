import * as fs from 'fs/promises';

export async function fileContainsVariable(filePath: string, variableName: string): Promise<boolean | null | undefined> {

    const fileContents = await fs.readFile(filePath, { encoding: 'utf-8' });

    return fileContents.includes(variableName);
}
export function kebabToPascal(string: string): string {
    return string.replace(/(^\w|-\w)/g, clearUpper);
}

export function undot(string: string): string[] {
    return string.split('.');
}

export function dot(stringArray: string[]): string {
    return stringArray.join('.');
}

function clearUpper(string: string) {
    return string.replace(/-/, "").toUpperCase();
}



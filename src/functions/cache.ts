import { ExtensionContext } from "vscode";
import {
    BladeComponent,
    ClassComponent,
    ComponentCache,
} from "../interfaces/components";
import {
    fileContainsVariable,
    getBladeComponentFiles,
    getClassComponentFiles,
    getPropsFromBladeFile,
    getVariablesFromClassFile,
} from "./files";
import path = require("path");

function cacheId(context: ExtensionContext) {
    return `__${context.extension.id}_component_cache__`;
}

export function getComponentCache(context: ExtensionContext) {
    const cacheName = cacheId(context);

    let defaultValue: ComponentCache = {
        classComponents: [],
        bladeComponents: [],
    };

    return context.workspaceState.get(cacheName, defaultValue);
}

export async function updateComponentCache(context: ExtensionContext) {
    const cache = await clearCache(context);

    const [bladeComponentFiles, classComponentFiles] = await Promise.all([
        getBladeComponentFiles(),
        getClassComponentFiles(),
    ]);

    for (const file of classComponentFiles) {
        let relativeViewUri = file.fsPath.split(
            path.join("View", "Components")
        )[1];

        let descriptor =
            "x-" +
            relativeViewUri
                .replace(".php", "")
                .replace(path.sep, " ")
                .replaceAll(path.sep, ".")
                .replace(/\B(?=[A-Z])/g, "-")
                .trim()
                .toLowerCase();

        const variables = await getVariablesFromClassFile(file.fsPath);

        const attributes = variables.map((variable, index) => {
            return variable.attributeSnippetString(index + 1);
        });

        const classComponent: ClassComponent = {
            uri: relativeViewUri.replace(path.sep, ""),
            fsPath: file.fsPath,
            descriptor: descriptor,
            snippetString: `<${descriptor} ${attributes.join(" ")} />`,
        };

        cache.classComponents.push(classComponent);
    }

    for (const file of bladeComponentFiles) {
        let relativeViewUri = file.fsPath.split(
            path.join("views", "components")
        )[1];

        let descriptor =
            "x-" +
            relativeViewUri
                .replace(".blade.php", "")
                .replace(path.sep, " ")
                .replaceAll(path.sep, ".")
                .trim();

        let propIndex = 1;

        const props = (await getPropsFromBladeFile(file.fsPath)).map(
            (prop, index) => {
                propIndex++;
                return prop.propSnippetString(index + 1);
            }
        );

        let snippetString = "";

        let slot = false;

        const propString = props.length > 0 ? " " + props.join(" ") + " " : "";

        if (await fileContainsVariable(file.fsPath, "$slot")) {
            snippetString = `<${descriptor}${propString}>$${propIndex}</${descriptor}>`;

            slot = true;
        } else {
            snippetString = `<${descriptor}${propString}/>`;

            slot = false;
        }

        const bladeComponent: BladeComponent = {
            uri: relativeViewUri.replace(path.sep, ""),
            fsPath: file.fsPath,
            descriptor: descriptor,
            slot: slot,
            snippetString: snippetString,
        };

        cache.bladeComponents.push(bladeComponent);
    }

    context.workspaceState.update(cacheId(context), cache);
}

async function clearCache(context: ExtensionContext) {
    await context.workspaceState.update(cacheId(context), undefined);

    return getComponentCache(context);
}

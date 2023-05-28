import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    Position,
    SnippetString,
    TextDocument,
    workspace,
} from "vscode";
import * as path from "path";
import { fileContainsVariable, getPropsFromBladeFile, getVariablesFromClassFile } from "../functions/files";

export default class TagsProvider implements CompletionItemProvider {
    async provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): Promise<CompletionItem[]> {
        const completionItems: CompletionItem[] = [];

        await pushComponentClassFilesCompletion(completionItems);

        await pushComponentTemplateFilesCompletion(completionItems);

        return completionItems;
    }
}

async function pushComponentClassFilesCompletion(
    completionItems: CompletionItem[]
) {
    const viewClassFiles = await workspace.findFiles(
        "**/View/Components/**/*.php",
        "**/vendor/**"
    );

    for (const file of viewClassFiles) {
        let relativeViewUri = file.fsPath.split(
            path.join("View", "Components")
        )[1];

        let descriptor =
            "x-" +
            relativeViewUri
                .replace(".php", "")
                .replace(path.sep, " ")
                .replace(path.sep, ".")
                .replace(/\B(?=[A-Z])/g, "-")
                .trim()
                .toLowerCase();

        const classVariables = await getVariablesFromClassFile(file.fsPath);

        const attributes = classVariables.map((variable, index) => {
            return variable.attributeSnippetString(index + 1);
        });
        
        const completionItem = new CompletionItem(descriptor);

        completionItem.insertText = new SnippetString(`<${descriptor} ${attributes.join(' ')} />`);

        completionItem.documentation = 'Insert the component tag with the public variables declared in the class file as attributes';

        completionItem.detail = `View Class: ${relativeViewUri}`;

        completionItems.push(completionItem);
    }
}

async function pushComponentTemplateFilesCompletion(
    completionItems: CompletionItem[]
) {
    const viewFiles = await workspace.findFiles(
        "**/resources/views/components/**/*.blade.php",
        "**/vendor/**"
    );

    for (const file of viewFiles) {
        let relativeViewUri = file.fsPath.split(
            path.join("views", "components")
        )[1];

        let descriptor =
            "x-" +
            relativeViewUri
                .replace(".blade.php", "")
                .replace(path.sep, " ")
                .replace(path.sep, ".")
                .trim();

        const completionItem = new CompletionItem(descriptor);

        const props = (await getPropsFromBladeFile(file.fsPath)).map((prop, index) => {
            return prop.propSnippetString(index + 1);
        });

        if (await fileContainsVariable(file.fsPath, "$slot")) {

            completionItem.insertText = new SnippetString(
                `<${descriptor} ${props.length > 0 ? props.join(' ') + ' ': ''}>` + "$999" + `</${descriptor}>`
            );

            completionItem.detail = `Blade View (with slots): ${relativeViewUri}`;
        } else {
            completionItem.insertText = new SnippetString(
                `<${descriptor} ${
                    props.length > 0 ? props.join(" ") + " " : ""
                }/>`
            );

            completionItem.detail = `Blade View: ${relativeViewUri}`;
        }

        if (!completionItems.includes(completionItem)) {
            completionItems.push(completionItem);
        }
    }
}

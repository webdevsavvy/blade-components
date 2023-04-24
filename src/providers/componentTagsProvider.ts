import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    CompletionList,
    Position,
    SnippetString,
    TextDocument,
    workspace,
} from "vscode";
import * as path from 'path';
import { fileContainsVariable } from "../util";

export default class ComponentTagsProvider implements CompletionItemProvider {
    async provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): Promise<
        CompletionItem[] | CompletionList<CompletionItem> | null | undefined
    > {
        const completionItems: CompletionItem[] = [];

        await pushComponentClassFilesCompletion(completionItems);
        
        await pushComponentTemplateFilesCompletion(completionItems);

        return completionItems;
    }
}

async function pushComponentClassFilesCompletion(completionItems: CompletionItem[]) {
    const viewClassFiles = await workspace.findFiles(
        "**/View/Components/**/*.php",
        "**/vendor/**"
    );

    for (const file of viewClassFiles) {
        let relativeViewUri = file.fsPath.split(path.join("View", "Components"))[1];

         let descriptor = "x-" + relativeViewUri
            .replace(".php", "")
            .replace(path.sep, " ")
            .replace(path.sep, ".")
            .replace(/\B(?=[A-Z])/g, "-")
            .trim()
            .toLowerCase();

        const completionItem = new CompletionItem(descriptor);

        completionItem.insertText = new SnippetString(
            `<${descriptor} />`
        );

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
        let relativeViewUri = file.fsPath.split(path.join("views", "components"))[1];

        let descriptor = "x-" + relativeViewUri
            .replace(".blade.php", "")
            .replace(path.sep, " ")
            .replace(path.sep, ".")
            .trim();

        const completionItem = new CompletionItem(descriptor);

        if (await fileContainsVariable(file.fsPath, "$slot")) {
            completionItem.insertText = new SnippetString(
                `<${descriptor}>` + "${1}" + `</${descriptor}>`
            );

            completionItem.detail = `Blade View (with slots): ${relativeViewUri}`;
        } else {
            completionItem.insertText = new SnippetString(`<${descriptor} />`);

            completionItem.detail = `Blade View: ${relativeViewUri}`;
        }

        if (!completionItems.includes(completionItem)) { completionItems.push(completionItem); }
    }
}

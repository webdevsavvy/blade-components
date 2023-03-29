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
        let relativeViewUri = file.fsPath.split("View\\Components\\")[1];

        relativeViewUri = relativeViewUri.replace(".php", "");

        let descriptor = "x-";

        if (relativeViewUri.includes("\\")) {
            const segments = relativeViewUri.split("\\");

            segments[segments.length - 1] = segments[segments.length - 1]
                .split(/(?=[A-Z])/)
                .join("-")
                .toLowerCase();

            console.log(segments);
            descriptor += segments.join(".").toLowerCase();
        } else {
            descriptor += relativeViewUri
                .split(/(?=[A-Z])/)
                .join("-")
                .toLowerCase();
        }

        console.log(descriptor);

        const completionItem = new CompletionItem(descriptor);

        completionItem.insertText = new SnippetString(
            `<${descriptor}>` + "${1}" + `</${descriptor}>`
        );

        completionItem.detail = file.fsPath;

        completionItems.push(completionItem);
    }
}

async function pushComponentTemplateFilesCompletion(
    completionItems: CompletionItem[]
) {
    const viewFiles = await workspace.findFiles(
        "**/resources/views/components/*.blade.php",
        "**/vendor/**"
    );

    for (const file of viewFiles) {
        let relativeViewUri = file.fsPath.split("\\views\\")[1];

        relativeViewUri = relativeViewUri
            .replace(".blade.php", "")
            .replace("components\\", "");

        const descriptor = "x-" + relativeViewUri.split("\\").join(".");

        const completionItem = new CompletionItem(descriptor);

        if (await fileContainsVariable(file.fsPath, "$slot")) {
            completionItem.insertText = new SnippetString(
                `<${descriptor}>` + "${1}" + `</${descriptor}>`
            );
        } else {
            completionItem.insertText = new SnippetString(`<${descriptor} />`);
        }

        if (!completionItems.includes(completionItem)) { completionItems.push(completionItem); }
    }
}

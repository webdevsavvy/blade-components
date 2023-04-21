import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    CompletionList,
    Position,
    SnippetString,
    TextDocument,
    Uri,
    workspace,
} from "vscode";
import * as path from "path";
import { fileContainsVariable } from "../util";
import { readFile } from "fs/promises";

export default class ClassComponentsProvider implements CompletionItemProvider {
    async provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): Promise<
        CompletionItem[] | CompletionList<CompletionItem> | null | undefined
    > {
        const completionItems: CompletionItem[] = [];

        await pushClassComponentsCompletion(completionItems);

        return completionItems;
    }
}

async function pushClassComponentsCompletion(
    completionItems: CompletionItem[]
) {
    const classFiles = await workspace.findFiles(
        "**/View/Components/**/*.php",
        "**/vendor/**"
    );

    for (const file of classFiles) {
        let relativeViewUri = file.fsPath.split(
            path.join("View", "Components")
        )[1];

        relativeViewUri = relativeViewUri
            .replace(".php", "")
            .replace(path.sep, " ")
            .trim();

        let descriptor = "x-";

        if (relativeViewUri.includes(" ")) {
            descriptor += relativeViewUri
                .replace(" ", ".")
                .replace(/\B(?=[A-Z])/g, "-")
                .toLowerCase();

        } else {
            descriptor += relativeViewUri
                .replace(/\B(?=[A-Z])/g, "-")
                .toLowerCase();
        }

        const completionItem = new CompletionItem(descriptor);

        completionItem.insertText = new SnippetString(
            `<${descriptor}>` + "${1}" + `</${descriptor}>`
        );

        completionItem.detail = file.fsPath;

        completionItems.push(completionItem);
    }
}

async function getReferencedView(file: Uri) {
    const fileContents = await readFile(file.fsPath);
}
import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemLabel,
    CompletionItemProvider,
    ExtensionContext,
    Position,
    SnippetString,
    TextDocument,
    workspace,
} from "vscode";
import * as path from "path";
import {
    fileContainsVariable,
    getPropsFromBladeFile,
    getVariablesFromClassFile,
} from "../functions/files";
import { getComponentCache } from "../functions/cache";

export default class TagsProvider implements CompletionItemProvider {
    private extContext: ExtensionContext;

    constructor(extContext: ExtensionContext) {
        this.extContext = extContext;
    }

    async provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): Promise<CompletionItem[]> {
        const completionItems: CompletionItem[] = [];

        await pushComponentClassFilesCompletion(
            completionItems,
            this.extContext
        );

        await pushComponentTemplateFilesCompletion(
            completionItems,
            this.extContext
        );

        return completionItems;
    }
}

async function pushComponentClassFilesCompletion(
    completionItems: CompletionItem[],
    context: ExtensionContext
) {
    const cache = getComponentCache(context);

    for (const component of cache.classComponents) {
        const label: CompletionItemLabel = {
            label: component.descriptor,
            description: component.uri,
            detail: ' ' + "Insert class component",
        };

        const completionItem = new CompletionItem(label);

        completionItem.insertText = new SnippetString(component.snippetString);

        completionItem.documentation =
            "Insert the component tag with the public variables declared in the class file as attributes";

        if (!completionItems.includes(completionItem)) {
            completionItems.push(completionItem);
        }
    }
}

async function pushComponentTemplateFilesCompletion(
    completionItems: CompletionItem[],
    context: ExtensionContext
) {
    const cache = getComponentCache(context);

    for (const component of cache.bladeComponents) {
        const label: CompletionItemLabel = {
            label: component.descriptor,
            description: component.snippetString,
            detail: ' ' + component.uri,
        };

        const completionItem = new CompletionItem(label);

        completionItem.insertText = new SnippetString(component.snippetString);

        if (!completionItems.includes(completionItem)) {
            completionItems.push(completionItem);
        }
    }
}

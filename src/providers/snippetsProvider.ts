import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    CompletionList,
    Position,
    ProviderResult,
    SnippetString,
    TextDocument,
} from "vscode";

export default class SnippetsProvider implements CompletionItemProvider {
    provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {

        const slotCompletion = new CompletionItem("slot");
        slotCompletion.insertText = new SnippetString(
            "<x-slot${1}>${2}</x-slot>"
        );

        return [slotCompletion];
    }
}

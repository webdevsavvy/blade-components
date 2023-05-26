import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    CompletionList,
    OutputChannel,
    Position,
    ProviderResult,
    SnippetString,
    TextDocument,
    window,
    workspace,
} from "vscode";
import { CompletionItemKind } from "vscode";
import { getVariablesFromClassFile, pathFromDot } from "../functions/files";
import { kebabToPascal } from "../functions/strings";

export default class AttributesProvider implements CompletionItemProvider {
        
    async provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): Promise<CompletionItem[]> {
        const completionItems: CompletionItem[] = [];

        const currentLineContent = document
            .lineAt(position)
            .text.substring(0, position.character);

        const match = /.*<x-([a-zA-Z\-]+)\s+.*/g.exec(currentLineContent);

        if (!match || match.length < 2) {
            return completionItems;
        }
        
        const classPath = kebabToPascal(pathFromDot(match[1]));        

        const componentClassFiles = await workspace.findFiles(
            `**/View/Components/${classPath}.php`,
            "**/vendor/**"
        );

        const n = await getVariablesFromClassFile(componentClassFiles[0].fsPath);

        n.forEach(variable => {
            
            const completionItem = new CompletionItem(variable.name, CompletionItemKind.Field);

            completionItem.insertText = new SnippetString(variable.attributeSnippetString());

            completionItems.push(completionItem);

        });

        return completionItems;
    }
}

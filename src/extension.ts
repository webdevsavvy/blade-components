import { ExtensionContext, languages } from "vscode";
import ComponentTagsProvider from "./providers/componentTagsProvider";
import SnippetsProvider from "./providers/snippetsProvider";

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        languages.registerCompletionItemProvider(
            "blade",
            new SnippetsProvider()
        ),
        languages.registerCompletionItemProvider(
            "blade",
            new ComponentTagsProvider(),
            "x"
        )
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}

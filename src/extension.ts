import { ExtensionContext, languages, window } from "vscode";
import TagsProvider from "./providers/TagsProvider";
import AttributesProvider from "./providers/AttributesProvider";

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        languages.registerCompletionItemProvider(
            { scheme: "file", language: "blade" },
            new TagsProvider(),
            "x"
        ),
        languages.registerCompletionItemProvider(
            "blade",
            new AttributesProvider(),
            ":"
        )
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}

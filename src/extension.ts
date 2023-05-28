import { ExtensionContext, commands, languages, window, workspace } from "vscode";
import TagsProvider from "./providers/TagsProvider";
import AttributesProvider from "./providers/AttributesProvider";
import { updateComponentCache } from "./functions/cache";

export function activate(context: ExtensionContext) {
    updateComponentCache(context);

    context.subscriptions.push(
        languages.registerCompletionItemProvider(
            { scheme: "file", language: "blade" },
            new TagsProvider(context),
            "x"
        ),
        languages.registerCompletionItemProvider(
            "blade",
            new AttributesProvider(context),
            ":"
        ),
        commands.registerCommand('blade-components.refreshCache', () => {
            updateComponentCache(context);
        })
    );

   
    console.log("blade-components activated");
}

// this method is called when your extension is deactivated
export function deactivate(context: ExtensionContext) {
    console.log("blade-components deactivated");
}

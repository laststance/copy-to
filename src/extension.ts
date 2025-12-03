import * as vscode from 'vscode';
import { copyToDestination } from './copyUtils';

/**
 * Extension activation entry point.
 * Called when the extension is first activated (e.g., when the command is invoked).
 *
 * @param context - Extension context for managing subscriptions and state
 *
 * @example
 * // VSCode calls this automatically when:
 * // - User right-clicks in File Explorer and selects "Copy to..."
 * // - User runs the command from Command Palette
 */
export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    'copy-to.copyToDestination',
    async (uri: vscode.Uri | undefined, uris: vscode.Uri[] | undefined) => {
      // Handle both single and multi-selection
      // - Single selection: uri is set, uris is undefined
      // - Multi selection: uri is first item, uris contains all items
      const targets = uris ?? (uri ? [uri] : []);

      if (targets.length === 0) {
        vscode.window.showWarningMessage('No files or folders selected.');
        return;
      }

      await copyToDestination(targets);
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * Extension deactivation cleanup.
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
  // No cleanup required
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        context.workspaceState.update('previousFile', context.workspaceState.get('activeFile'));
        context.workspaceState.update('activeFile', editor.document.fileName);
      }
    })
  );

  let switchFile = vscode.commands.registerCommand('switch-active-file.switchActiveFile', () => {
    const previousFile = context.workspaceState.get('previousFile');
    if (previousFile !== undefined) {
      vscode.window.showTextDocument(vscode.Uri.file(context.workspaceState.get('previousFile') || ''));
    }
  });

  context.subscriptions.push(switchFile);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { filesInMemoryProvider } from './files-in-memory-provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const treeProvider = new filesInMemoryProvider(context);

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        context.workspaceState.update('previousFile', context.workspaceState.get('activeFile'));
        context.workspaceState.update('activeFile', editor.document.fileName);

        treeProvider.refresh();
      }
    })
  );

  // Register the commands

  let switchFile = vscode.commands.registerCommand('switch-active-file.switchActiveFile', () => {
    const previousFile = context.workspaceState.get('previousFile');
    if (previousFile !== undefined) {
      vscode.window.showTextDocument(vscode.Uri.file(context.workspaceState.get('previousFile') || ''));
    }
  });

  let focusView = vscode.commands.registerCommand('switch-active-file.focusView', () => {
    if (context.workspaceState.get('viewFocused')) {
      vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
      context.workspaceState.update('viewFocused', false);
      return;
    } else {
      vscode.commands.executeCommand("switch-active-file.focus")
      context.workspaceState.update('viewFocused', true);
    }
  });

  let registerFile = vscode.commands.registerCommand('switch-active-file.registerFile', () => {
    const activeFile:string = context.workspaceState.get('activeFile') || '';
    if (activeFile.length > 0) {
      const registeredFiles:Array<String> = context.workspaceState.get('registeredFiles') || [];
      if (registeredFiles.includes(activeFile)) {
        registeredFiles.splice(registeredFiles.indexOf(activeFile), 1);
      } else {
        registeredFiles.push(activeFile);
        if (registeredFiles.length > 9) {
          registeredFiles.shift();
        }
      }
      context.workspaceState.update('registeredFiles', registeredFiles);
      treeProvider.refresh();
    }
  });

  context.subscriptions.push(switchFile);
  context.subscriptions.push(focusView);
  context.subscriptions.push(registerFile);

  vscode.window.registerTreeDataProvider('switch-active-file', treeProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}

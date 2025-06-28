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
        context.workspaceState.update('activeFile', editor.document.uri.toString());

        treeProvider.refresh();
      }
    })
  );

  // Register the commands

  let switchFile = vscode.commands.registerCommand('switch-active-file.switchActiveFile', () => {
    const previousFileUri = context.workspaceState.get('previousFile') as string;
    if (previousFileUri) {
      vscode.window.showTextDocument(vscode.Uri.parse(previousFileUri));
    }
  });

  let focusView = vscode.commands.registerCommand('switch-active-file.focusView', () => {
    if (context.workspaceState.get('viewFocused')) {
      vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
      context.workspaceState.update('viewFocused', false);
      return;
    } else {
      vscode.commands.executeCommand("switch-active-file.focus");
      context.workspaceState.update('viewFocused', true);
    }
  });

  let registerFile = vscode.commands.registerCommand('switch-active-file.registerFile', () => {
    const activeFile:string = context.workspaceState.get('activeFile') || '';
    if (activeFile.length > 0) {
      const registeredFiles:Array<string> = context.workspaceState.get('registeredFiles') || [];
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

  let switchToRegisteredFile1 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile1', () => {
    switchToRegisteredFile(context, 0);
  });
  let switchToRegisteredFile2 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile2', () => {
    switchToRegisteredFile(context, 1);
  });
  let switchToRegisteredFile3 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile3', () => {
    switchToRegisteredFile(context, 2);
  });
  let switchToRegisteredFile4 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile4', () => {
    switchToRegisteredFile(context, 3);
  });
  let switchToRegisteredFile5 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile5', () => {
    switchToRegisteredFile(context, 4);
  });
  let switchToRegisteredFile6 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile6', () => {
    switchToRegisteredFile(context, 5);
  });
  let switchToRegisteredFile7 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile7', () => {
    switchToRegisteredFile(context, 6);
  });
  let switchToRegisteredFile8 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile8', () => {
    switchToRegisteredFile(context, 7);
  });
  let switchToRegisteredFile9 = vscode.commands.registerCommand('switch-active-file.switchToRegisteredFile9', () => {
    switchToRegisteredFile(context, 8);
  });

  let switchToFile = vscode.commands.registerCommand('switch-active-file.switchToFile', (fileItem) => {
    vscode.window.showTextDocument(vscode.Uri.file(fileItem.tooltip));
  });

  let removeFile = vscode.commands.registerCommand('switch-active-file.removeFile', (fileItem) => {
    const registeredFiles:Array<string> = context.workspaceState.get('registeredFiles') || [];
    if (registeredFiles.includes(fileItem.tooltip)) {
      registeredFiles.splice(registeredFiles.indexOf(fileItem.tooltip), 1);
      context.workspaceState.update('registeredFiles', registeredFiles);
      treeProvider.refresh();
    }
  });

  context.subscriptions.push(switchFile);
  context.subscriptions.push(focusView);
  context.subscriptions.push(registerFile);
  context.subscriptions.push(switchToRegisteredFile1);
  context.subscriptions.push(switchToRegisteredFile2);
  context.subscriptions.push(switchToRegisteredFile3);
  context.subscriptions.push(switchToRegisteredFile4);
  context.subscriptions.push(switchToRegisteredFile5);
  context.subscriptions.push(switchToRegisteredFile6);
  context.subscriptions.push(switchToRegisteredFile7);
  context.subscriptions.push(switchToRegisteredFile8);
  context.subscriptions.push(switchToRegisteredFile9);
  context.subscriptions.push(switchToFile);
  context.subscriptions.push(removeFile);

  vscode.window.registerTreeDataProvider('switch-active-file', treeProvider);
}

function switchToRegisteredFile(context: vscode.ExtensionContext, index: number) {
  const registeredFiles:Array<string> = context.workspaceState.get('registeredFiles') || [];
  if (registeredFiles.length > index) {
    vscode.window.showTextDocument(vscode.Uri.file(registeredFiles[index]));
  }
}
// This method is called when your extension is deactivated
export function deactivate() {}

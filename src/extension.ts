// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "switch-active-file" is now active!');

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        context.workspaceState.update('previousFile', context.workspaceState.get('activeFile'));
        context.workspaceState.update('activeFile', editor.document.fileName);
      }
    })
  );

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('switch-active-file.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Switch active file!');
	});

  let switchFile = vscode.commands.registerCommand('switch-active-file.switchActiveFile', () => {
    const previousFile = context.workspaceState.get('previousFile');
    if (previousFile !== undefined) {
      vscode.window.showTextDocument(vscode.Uri.file(context.workspaceState.get('previousFile') || ''));
    }
  });

	context.subscriptions.push(disposable);
  context.subscriptions.push(switchFile);
}

// This method is called when your extension is deactivated
export function deactivate() {}

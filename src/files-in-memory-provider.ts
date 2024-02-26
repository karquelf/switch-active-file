import * as vscode from 'vscode';

export class filesInMemoryProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | null | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {
    this.context = context;
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (!element) {
      return Promise.resolve([new vscode.TreeItem('last viewed file', vscode.TreeItemCollapsibleState.Expanded)]);
    } else {
      if (element.label === 'last viewed file') {
        if (!this.context.workspaceState.get('previousFile')) {
          return Promise.resolve([]);
        }

        const previousFileName:string = (this.context.workspaceState.get('previousFile') as string).split('/').pop() || '';
        const previousFileItem = new vscode.TreeItem(previousFileName);
        previousFileItem.tooltip = this.context.workspaceState.get('previousFile');

        return Promise.resolve([previousFileItem]);
      }
    }

    return Promise.resolve([]);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

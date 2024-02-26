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
      return Promise.resolve([
        new vscode.TreeItem('last viewed file', vscode.TreeItemCollapsibleState.Expanded),
        new vscode.TreeItem('registered files', vscode.TreeItemCollapsibleState.Expanded),
      ]);
    } else {
      switch (element.label) {
        case 'last viewed file':
          return this.getLastViewedFile();
        case 'registered files':
          return this.getRegisteredFiles();
      }
    }

    return Promise.resolve([]);
  }

  private async getLastViewedFile(): Promise<vscode.TreeItem[]> {
    if (!this.context.workspaceState.get('previousFile')) {
      return [];
    }

    const previousFileName:string = (this.context.workspaceState.get('previousFile') as string).split('/').pop() || '';
    const previousFileItem = new vscode.TreeItem(previousFileName);
    previousFileItem.tooltip = this.context.workspaceState.get('previousFile');

    return [previousFileItem];
  }

  private async getRegisteredFiles(): Promise<vscode.TreeItem[]> {
    const registeredFiles:Array<string> = this.context.workspaceState.get('registeredFiles') || [];
    return registeredFiles.map((file) => {
      const fileName:string = file.split('/').pop() || '';
      const fileItem = new vscode.TreeItem(fileName);
      fileItem.tooltip = String(file);
      fileItem.contextValue = 'registeredFile';
      return fileItem;
    });
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

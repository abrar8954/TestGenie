import * as vscode from 'vscode';
import { getWebviewContent } from './webview/webview-html';
import * as dotenv from 'dotenv';
import { messageRecievedFromWebViewHandler } from './msg-recieve-handler';
import { unitTestProcess } from './utils/helper';
import { projectName } from './utils/constants';


dotenv.config();

export function activate(context: vscode.ExtensionContext) {
	// Create the unit test icon
	const unitTestButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	unitTestButton.text = "$(beaker) Create Unit Test";
	unitTestButton.command = 'testgenie.generateUnitTest';
	unitTestButton.show();

	const disposable_main = vscode.commands.registerCommand('testgenie.Main', async () => {
		const panel = vscode.window.createWebviewPanel(
			'MainView',
			'TestGenie',
			vscode.ViewColumn.One,
			{
				enableScripts: true, // Ensure scripts can run
				retainContextWhenHidden: true,
			}
		);

		const reactAppUri = panel.webview.asWebviewUri(
			vscode.Uri.joinPath(context.extensionUri, 'out', 'webview.js')
		);

		panel.webview.html = getWebviewContent(reactAppUri);

		messageRecievedFromWebViewHandler(panel, context);

		console.log(projectName, 'projectName');


	});


	// Register the command to create the test file
	const disposable_generateUnitTest = vscode.commands.registerCommand('testgenie.generateUnitTest', async () => {
		unitTestProcess(context, unitTestButton);
	});

	context.subscriptions.push(disposable_main, disposable_generateUnitTest, unitTestButton);

}

export function deactivate() { }




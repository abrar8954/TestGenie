
import * as vscode from 'vscode';
import { getObjectLocally, storeObjectLocally } from './utils/helper';
import { projectName } from './utils/constants';

export const messageRecievedFromWebViewHandler = (panel: vscode.WebviewPanel, context: vscode.ExtensionContext,) => {
    panel.webview.onDidReceiveMessage(async message => {
        console.log('messageRecievedFromWebViewHandler:', message.command);

        console.log(projectName, 'projectName');

        if (message.command === 'locallyStoreObject') {

            const {
                apiProvider,
                apiKey,
                customInstructions,
                approveReadOnly
            } = message.message;

            const settingsData = {
                apiProvider: apiProvider,
                apiKey: apiKey,
                customInstructions: customInstructions,
                approveReadOnly: approveReadOnly
            }




            storeObjectLocally(context, `${projectName}_settingsData`, settingsData);

            // const workspaceRootPath: any = getRootProjectPath()
            // writeEnvFile(workspaceRootPath, 'CHAT_GROQ_API_KEY', apiKey);


        }

        if (message.command === 'locallyGetObject') {

            const settingsData = await getObjectLocally(context, projectName);

            panel.webview.postMessage({
                command: 'getSettingsData',
                settingsData: settingsData,

            })

        }


    });

}
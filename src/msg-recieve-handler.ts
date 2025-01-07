
import * as vscode from 'vscode';
import { getObjectLocally, getProjectType, storeObjectLocally } from './utils/helper';
import { projectName } from './utils/constants';

export const messageRecievedFromWebViewHandler = (panel: vscode.WebviewPanel, context: vscode.ExtensionContext,) => {
    panel.webview.onDidReceiveMessage(async message => {
        console.log('messageRecievedFromWebViewHandler:', message.command);


        if (message.command === 'ready') {


        }

        if (message.command === 'locallyStoreObject') {

            const {
                apiProvider,
                apiKey,
                customInstructions,
                approveReadOnly,
                appStatus
            } = message.message;

            const settingsData = {
                apiProvider: apiProvider,
                apiKey: apiKey,
                customInstructions: customInstructions,
                approveReadOnly: approveReadOnly,
                appStatus: appStatus
            }




            storeObjectLocally(context, `${projectName}_settingsData`, settingsData);

            // const workspaceRootPath: any = getRootProjectPath()
            // writeEnvFile(workspaceRootPath, 'CHAT_GROQ_API_KEY', apiKey);


        }

        if (message.command === 'locallyGetObject') {

            const settingsData = await getObjectLocally(context, `${projectName}_settingsData`);

            panel.webview.postMessage({
                command: 'getSettingsData',
                settingsData: settingsData,

            })

        }


    });

}
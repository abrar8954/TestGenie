
import * as vscode from 'vscode';
import { getObjectLocally, getProjectType, storeObjectLocally } from './utils/helper';
import { projectName } from './utils/constants';

export const messageRecievedFromWebViewHandler = (panel: vscode.WebviewPanel, context: vscode.ExtensionContext,) => {
    panel.webview.onDidReceiveMessage(async message => {
        console.log('messageRecievedFromWebViewHandler:', message.command);


        if (message.command === 'ready') {
            const projectType: any = getProjectType()

            switch (projectType) {
                case 'CRA':
                    vscode.window.showInformationMessage('This is a Create React App (CRA) project.');
                    break;
                default:
                    vscode.window.showInformationMessage('Not Found Project Type');
                    break;
            }


        }

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

            const settingsData = await getObjectLocally(context, `${projectName}_settingsData`);

            panel.webview.postMessage({
                command: 'getSettingsData',
                settingsData: settingsData,

            })

        }


    });

}
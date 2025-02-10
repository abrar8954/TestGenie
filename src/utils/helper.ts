import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';
import { generateUnitTestCode } from '../agents/generate-unit-tests';
import { selectInstallCommands } from './commands';

const workspaceFolders = vscode.workspace.workspaceFolders;
let generateUT: number = 0;

export const storeObjectLocally = (
    context: vscode.ExtensionContext,
    key: string,
    value: {}
) => {
    const myExtensionState = context.globalState;
    // Convert the value object to a JSON string
    const serializedValue = JSON.stringify(value);
    console.log(serializedValue, 'storeObjectLocally-set');


    // Update the global state with the key and serialized value
    myExtensionState.update(key, serializedValue);
};

export const getObjectLocally = (context: vscode.ExtensionContext, key: string) => {
    const myExtensionState = context.globalState;
    const serializedValue = myExtensionState.get<string>(key);
    if (serializedValue) {
        console.log(serializedValue, 'getObjectLocally-get');

        return JSON.parse(serializedValue);
    }
    return null;
};


export async function getRootProjectName(): Promise<string | undefined> {
    await vscode.workspace.fs.stat(vscode.Uri.file(vscode.workspace.rootPath || ''));
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].name;
    } else {
        return undefined;
    }
}

// Function to write to .env file
export const writeEnvFile = async (
    workspaceRootPath: string,
    keyName: string,
    keyValue: string
) => {
    try {
        const envFilePath = path.join(workspaceRootPath, '.env');

        const envContent = `# .env\n${keyName}=${keyValue}\n`;

        // Write the .env file
        fs.writeFileSync(envFilePath, envContent, { encoding: 'utf-8' });
        vscode.window.showInformationMessage(`.env file created at: ${envFilePath}`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error writing .env file: ${error.message}`);
    }
};


export function getRootProjectPath(): string | undefined {
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace root folder path found.');
        return;
    }
    const workspaceRoot = workspaceFolders[0].uri.fsPath;

    return workspaceRoot;
}


export const unitTestProcess = async (context: vscode.ExtensionContext, unitTestButton: any) => {

    try {

        // if (generateUT === 0 || generateUT === 1)
        //     generateUT++;


        // if (generateUT === 2) {
        unitTestButton.text = "$(sync~spin) Generating Unit Test...";
        const editor = vscode.window.activeTextEditor;


        if (!editor) {
            vscode.window.showErrorMessage("No active file to create a unit test for.");
            unitTestButton.text = "$(beaker) Create Unit Test";

            return;
        }

        const openFilePath = editor.document.fileName;
        const componentCode = editor.document.getText();
        const openFileName = path.basename(openFilePath, path.extname(openFilePath));
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        const fileFormat = path.extname(openFilePath).slice(1);
        // const projectType: any = await getProjectType()
        let testFolderPath;
        let testFilePath;
        const projectName = await getRootProjectName();
        const projectType = await getProjectType();
        const settingsData = getObjectLocally(context, `${projectName}_settingsData`);
        const { apiKey, appStatus } = settingsData;

        console.log('openFilePath--', appStatus);


        if (!projectRoot) {
            vscode.window.showErrorMessage("Cannot determine project root.");
            return;
        }

        console.log('projectType ', 'projectType');

        switch (projectType) {
            case 'CRA':
                testFolderPath = path.join(projectRoot, 'src/tests/unit_tests');
                break;
            case 'VITEST':
                testFolderPath = path.join(projectRoot, 'tests/unit_tests');
                break;
            case 'REACTNATIVEEXPO':
                testFolderPath = path.join(projectRoot, 'components/__tests__');
                break;
            case 'REACTNATIVECLI':
            case 'NEXTJS':
                testFolderPath = path.join(projectRoot, '__tests__');
                break;
            default:
                testFolderPath = path.join(projectRoot, 'tests/unit_tests');
                break;
        }



        // Create folders if they doesn't exist
        if (!fs.existsSync(testFolderPath)) {
            fs.mkdirSync(testFolderPath, { recursive: true });

        }

        switch (projectType) {

            case 'REACTNATIVEEXPO':
                testFilePath = path.join(testFolderPath, `${openFileName}-test.${fileFormat}`);
                break;
            default:
                testFilePath = path.join(testFolderPath, `${openFileName}.test.${fileFormat}`);
                break;
        }



        const unitTestCode = await generateUnitTestCode(componentCode, openFilePath, testFilePath, apiKey);

        // Ensure unitTestCode is of type string
        const testContent: string = unitTestCode ?? ''; // Default to empty string if undefined


        // Create or overwrite the test file
        fs.writeFileSync(testFilePath, testContent);
        vscode.window.showInformationMessage(`Unit test created at ${testFilePath}`);

        // Open the new test file
        const document = await vscode.workspace.openTextDocument(testFilePath);
        vscode.window.showTextDocument(document);
        unitTestButton.text = "$(beaker) Create Unit Test";

        installReqPackages();

        if (appStatus === 'Initial') {


            const savedSettingsData = getObjectLocally(context, `${projectName}_settingsData`);

            const updatedSettingsData = {
                ...savedSettingsData,
                appStatus: 'Running'
            };


            storeObjectLocally(context, `${projectName}_settingsData`, updatedSettingsData);
        }

        // }

    } catch (error: any) {
        unitTestButton.text = "$(beaker) Create Unit Test";
        vscode.window.showErrorMessage(`Something went wrong: ${error.message || error}`);
        console.error("Error details:", error);

    }


}


export async function getProjectType() {
    // Get the root folder of the VS Code workspace
    const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    if (!projectRoot) {
        vscode.window.showErrorMessage("No workspace folder found!");
        return;
    }

    const packageJsonPath = path.join(projectRoot, 'package.json'); // Path to package.json

    try {
        // Use fs.promises to read the file asynchronously
        const data = await fs.promises.readFile(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(data);


        const testScript = packageJson.scripts && packageJson.scripts.test;
        const startScript = packageJson.scripts && packageJson.scripts.start;
        console.log(testScript, 'and', startScript);



        if (testScript === 'react-scripts test') {

            return 'CRA';

        } else if (testScript === 'vitest') {

            return 'VITEST';

        } else if (testScript === 'jest --watchAll') {

            return 'REACTNATIVEEXPO';

        } else if (testScript === 'jest' && !(startScript === 'next start')) {

            return 'REACTNATIVECLI';

        } else if (testScript === 'jest' && startScript === 'next start') {

            return 'NEXTJS';

        } else {

            return 'DEFAULT';
        }

    } catch (err: any) {
        vscode.window.showErrorMessage(`Error handling package.json: ${err.message}`);
    }

}


export const installReqPackages = async () => {
    const projectType: any = await getProjectType();
    const terminal: vscode.Terminal = vscode.window.createTerminal('Install Dependencies');
    terminal.show();

    // Command to be executed
    const command = selectInstallCommands()

    // Send the command to the terminal
    terminal.sendText(command);
};
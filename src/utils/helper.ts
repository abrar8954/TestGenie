import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';
import { generateUnitTestCode } from '../agents/generate-unit-tests';
// import { projectName } from './constants';


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


export function getRootProjectName(): string | undefined {
    if (workspaceFolders && workspaceFolders.length > 0) {
        // Return the name of the first workspace folder, typically the root project folder name
        return workspaceFolders[0].name;
    } else {
        // No workspace folder is open
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

    if (generateUT === 0 || generateUT === 1)
        generateUT++;


    if (generateUT === 2) {
        unitTestButton.text = "$(sync~spin) Generating Unit Test...";

        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage("No active file to create a unit test for.");
            return;
        }

        const openFilePath = editor.document.fileName;
        const componentCode = editor.document.getText();
        const openFileName = path.basename(openFilePath, path.extname(openFilePath));
        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

        if (!projectRoot) {
            vscode.window.showErrorMessage("Cannot determine project root.");
            return;
        }

        const testFolderPath = path.join(projectRoot, 'unit_tests');
        const testFilePath = path.join(testFolderPath, `${openFileName}.test.ts`);

        // Create "unit tests" folder if it doesn't exist
        if (!fs.existsSync(testFolderPath)) {
            fs.mkdirSync(testFolderPath);
        }

        const projectName = getRootProjectName();
        const settingsData = getObjectLocally(context, `${projectName}_settingsData`);

        const { apiKey } = settingsData;

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
    }
}

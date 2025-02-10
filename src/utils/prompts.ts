export const selectPrompts = (componentCode: string, openFilePath: string, testFilePath: string, projectType: string) => {
    let prompt = "";

    switch (projectType) {
        case "REACTNATIVEEXPO":
            prompt = `Generate a complete Jest unit test code for: ${componentCode}. The import path for the component being tested corresponds to ${openFilePath}, while the path for the Jest unit tests corresponds to ${testFilePath}. Ensure these paths are correctly placed in the generated Jest unit test code. Import name for this should be the same as the component. 
            Ensure all imports and exports are correct and consistent across files.`;
            break;

        case "REACTNATIVECLI":
            prompt = `Generate a complete Jest unit test code for: ${componentCode} by using react-test-renderer library. The import path for the component being tested corresponds to ${openFilePath}, while the path for the Jest unit tests corresponds to ${testFilePath}. Ensure these paths are correctly placed in the generated Jest unit test code. Import name for this should be the same as the component. 
                Ensure all imports and exports are correct and consistent across files.`;
            break;


        default:
            prompt = `Generate a complete Jest unit test code for: ${componentCode}. The import path for the component being tested corresponds to ${openFilePath}, while the path for the Jest unit tests corresponds to ${testFilePath}. Ensure these paths are correctly placed in the generated Jest unit test code. Import name for this should be the same as the component. 
            Ensure all imports and exports are correct and consistent across files. Also, ensure this import '@testing-library/jest-dom'; is on top of other imports.`;
            break;
    }

    return prompt;
};

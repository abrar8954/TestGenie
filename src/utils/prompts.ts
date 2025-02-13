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
            prompt = `Generate a complete Jest unit test code for: ${componentCode}. Path for component import is: '../../componentName'. Check both and add the correct path in the generated test file. Ensure these paths are correctly placed in the generated Jest unit test code. Import name for this should be the same as the component. 
            Ensure all imports and exports are correct and consistent across files. Also, ensure these import '@testing-library/jest-dom';, import React from 'react'; on top of other imports.
            Impotant: Generate screen by looking into these issues:
            1- Avoid destructuring queries from 'render' result, use 'screen.getByText' instead.
            2- Property 'href' or 'value' or 'something else' does not exist on type 'HTMLElement'.
            3- Property 'getByRole' does not exist on type 'Screen'.
            4- Avoid using container methods. Prefer using the methods from Testing Library, such as "getByRole()".
            5- Avoid direct Node access. Prefer using the methods from Testing Library.
            6- Do not put anything that might be possibly 'null' or 'undefined'.
            7- No overload matches this call.
               Overload 1 of 3, '(object: () => any, method: never): SpyInstance<never, never, any>', gave the following error.
               Argument of type '"handleLogin"' is not assignable to parameter of type 'never'.`;
            break;
    }

    return prompt;
};

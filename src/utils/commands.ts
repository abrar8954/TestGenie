import { projectType } from "./constants";

console.log('projectType: ', projectType);


export const selectInstallCommands = () => {
    let command = "";

    switch (projectType) {
        case "REACTNATIVEEXPO":
            command = 'npm install --save-dev jest jest-expo @testing-library/react-native @testing-library/jest-native';
            break;

        case "VITEST":
            command = 'npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom vitest @types/jest';
            break;

        default:
            command = 'npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest';
            break;
    }

    return command;
};

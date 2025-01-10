import { getProjectType, getRootProjectName } from "./helper";

export let projectName: any;
export let projectType: any;

async function initializeProjectDetails() {
    projectName = await getRootProjectName();
    projectType = await getProjectType();
}

// Call the function to initialize the values
initializeProjectDetails();

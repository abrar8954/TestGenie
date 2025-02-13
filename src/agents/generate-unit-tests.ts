import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { selectPrompts } from "../utils/prompts";
import { getProjectType } from "../utils/helper";

export async function generateUnitTestCode(componentCode: string, openFilePath: string, testFilePath: string, apiKey: string): Promise<string | undefined> {
    // const apiKey = process.env.CHAT_GROQ_API_KEY;

    const model = new ChatGroq({
        apiKey: apiKey,
        model: "llama3-70b-8192",
    }) as any;

    const memory = new MemorySaver();
    const agent = await createReactAgent({
        llm: model,
        tools: [],
        checkpointSaver: memory,
    });

    try {
        console.log("Generating Unit Test Code - openFilePath", openFilePath);
        console.log("Generating Unit Test Code - testFilePath", testFilePath);

        // const userInput = `Generate a complete jest unit tests code for: ${componentCode}. Import path for component for which test is going to be write is related to this: ${openFilePath} and for jest unit tests is this: ${testFilePath} put accordingly in generated jest unit tests code. Import name for this should be same as component. 
        // Ensure all imports and exports are correct and consistent across file and also check for .`;
        // const userInput = `Generate a complete jest unit tests code for: ${componentCode}. The import path for the component being tested corresponds to ${openFilePath}, while the path for the Jest unit tests corresponds to ${testFilePath}. Ensure these paths are correctly placed in the generated Jest unit test code. Import name for this should be same as component. 
        // Ensure all imports and exports are correct and consistent across file and also check for .This import '@testing-library/jest-dom'; should be on top of other imports.`;  
        const projectType: any = await getProjectType();
        console.log(projectType, ': projectType - generateUnitTestCode');

        const userInput = selectPrompts(componentCode, openFilePath, testFilePath, projectType);
        const response = await agent.invoke(
            { messages: [new HumanMessage(userInput)] },
            { configurable: { thread_id: "1" } }
        );

        console.log(response.messages[1].content, "Generating Unit Test Code----");

        // Extract the Jest test code using a simple regex to capture the content between the code block
        const match = response.messages[1].content.match(/```([^`]+)```/);
        if (match) {
            return match[1]; // Return only the test code (inside the code block)
        } else {
            console.error("Test code not found in the response.");
            return undefined;
        }
    } catch (error) {
        console.error("Error during React component generation:", error);
        throw error;
    }
}


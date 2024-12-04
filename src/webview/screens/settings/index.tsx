
import React, { useEffect, useState } from "react";
import Button1 from "../../components/button1";

export function Settings() {
    const [settingsData, setSettingsData] = useState({
        apiProvider: "Google Gemini", // Default API Provider
        apiKey: "", // Store Gemini API key
        customInstructions: "", // Store custom instructions text
        approveReadOnly: false, // Checkbox for approving read-only operations
    });

    const handleInputChange = (field: keyof typeof settingsData, value: any) => {
        setSettingsData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const apiProviderOptions = ["Google Gemini", "Anthropic", "OpenAI", "Ollama"];


    const storeSettingsDataLocally = () => {

        console.log('storeSettingsDataLocally');


        window.postMessage({
            command: 'callLocallyStoreObject',
            message: settingsData
        }, '*');

    };

    //This thing is showing 'nothing showing anything bug'
    useEffect(() => {
        window.postMessage({
            command: 'callLocallyGetObject',
            message: settingsData
        }, '*');
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {

            const message = event.data;

            if (message.command === 'getSettingsData') {

                setSettingsData(message.settingsData);

            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);


    return (
        <div style={styles.container}>
            <h1 style={styles.title}>TestGenie</h1>

            {/* API Provider Section */}
            <div style={styles.section}>
                <label style={styles.label}>API Provider</label>
                <select
                    style={styles.input}
                    value={settingsData.apiProvider}
                    onChange={(e) => handleInputChange("apiProvider", e.target.value)}>

                    {apiProviderOptions.map((provider, index) => (
                        <option key={index} value={provider}>
                            {provider}
                        </option>
                    ))}
                </select>
            </div>

            {/* API Key Section */}
            <div style={styles.section}>
                <label style={styles.label}>Gemini API Key</label>
                <input
                    type="password"
                    placeholder="******************"
                    style={styles.input}
                    value={settingsData.apiKey}
                    onChange={(e) => handleInputChange("apiKey", e.target.value)}
                />
                <p style={styles.description}>
                    This key is stored locally and only used to make API requests from this extension.
                </p>
            </div>

            {/* Model Section */}
            {/* <div style={styles.section}>
                <label style={styles.label}>Model</label>
                <select style={styles.input}>
                    <option>gemini-1.5-flash-002</option>
                </select>
                <div style={styles.statusContainer}>
                    <p style={styles.statusSuccess}>✓ Supports images</p>
                    <p style={styles.statusError}>✗ Does not support computer use</p>
                </div>
                <p style={styles.description}>Max output: 8,192 tokens</p>
            </div> */}

            {/* Custom Instructions */}
            <div style={styles.section}>
                <label style={styles.label}>Custom Instructions</label>
                <textarea
                    placeholder="e.g. 'Run unit tests at the end', 'Use TypeScript with async/await', 'Speak in Spanish'"
                    style={{ ...styles.input, height: "60px" }}
                    value={settingsData.customInstructions}
                    onChange={(e) => handleInputChange("customInstructions", e.target.value)}
                ></textarea>
                <p style={styles.description}>
                    These instructions are added to the end of the system prompt sent with every request.
                </p>
            </div>

            {/* Approve Read-Only Operations */}
            <div style={styles.checkboxSection}>
                <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={settingsData.approveReadOnly}
                    onChange={(e) => handleInputChange("approveReadOnly", e.target.checked)} />
                <label style={styles.checkboxLabel}>Always approve read-only operations</label>
            </div>

            <Button1 text={'Save'} onClick={() => storeSettingsDataLocally()} />

            {/* Footer */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    If you have any questions or feedback, feel free to open an issue at{" "}
                    <a href="https://github.com/example/example" style={styles.link}>
                        https://github.com/example/example
                    </a>
                </p>
                <p style={styles.version}>v2.1.6</p>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#1e1e2e",
        color: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "100%",  // Ensures 100% width
        minWidth: "100%", // Ensures it takes at least the full width
        maxWidth: "600px", // Optional: limits the maximum width to prevent overflow on large screens
        boxSizing: "border-box" as "border-box", // Ensures padding/border are included in width calculation
        height: "100%", // Makes the container take 100% height of its parent
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        fontWeight: "bold",
        textAlign: "center" as "center",  // Explicitly cast to "center"
    },
    section: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        backgroundColor: "#2e2e3e",
        color: "#fff",
        fontSize: "14px",
        boxSizing: "border-box" as "border-box",  // Explicitly cast to "border-box"
    },
    description: {
        fontSize: "12px",
        marginTop: "8px",
        color: "#aaa",
    },
    statusContainer: {
        display: "flex",
        gap: "10px",
        marginTop: "8px",
        flexWrap: "wrap" as "wrap",  // Explicitly cast to "wrap"
    },
    statusSuccess: {
        color: "#4caf50",
        fontSize: "14px",
    },
    statusError: {
        color: "#f44336",
        fontSize: "14px",
    },
    checkboxSection: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    checkbox: {
        marginRight: "8px",
    },
    checkboxLabel: {
        fontSize: "14px",
    },
    footer: {
        // marginTop: "20px",
        fontSize: "12px",
        color: "#aaa",
        textAlign: "center" as "center",  // Explicitly cast to "center"
        position: 'absolute' as 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)', // Centers horizontally
    },
    footerText: {
        marginBottom: "8px",
    },
    link: {
        color: "#1e90ff",
        textDecoration: "none",
    },
    version: {
        fontSize: "12px",
    },
};

export default Settings;

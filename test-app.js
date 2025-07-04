// Test script for Desi Cloud Job Title Generator

// Mock user data
const userData = {
    name: "Rahul Sharma",
    cloudService: "Serverless",
    workStyle: "Jugaadu",
    superpower: "Can fix WiFi with jugaad"
};

// Mock DOM elements
const mockDOM = {
    jobTitle: { textContent: "" },
    jobDescription: { textContent: "" },
    resultUserName: { textContent: "" },
    resultContainer: { 
        style: { display: "none" },
        scrollIntoView: () => console.log("Scrolling to result")
    },
    loadingDiv: { style: { display: "none" } },
    formContainer: { style: { display: "block" } }
};

// Import the necessary functions from script.js
const fs = require('fs');
const vm = require('vm');

// Create a context with our mock DOM
const context = {
    document: {
        getElementById: (id) => {
            switch(id) {
                case 'jobTitle': return mockDOM.jobTitle;
                case 'jobDescription': return mockDOM.jobDescription;
                case 'resultUserName': return mockDOM.resultUserName;
                case 'resultContainer': return mockDOM.resultContainer;
                case 'loadingDiv': return mockDOM.loadingDiv;
                case 'formContainer': return mockDOM.formContainer;
                case 'useAI': return { checked: true };
                default: return null;
            }
        }
    },
    console: console,
    setTimeout: setTimeout,
    window: {
        useMockResponses: true,
        bedrockEnabled: true,
        features: {
            showDebugInfo: true
        }
    }
};

// Read the script.js file
const scriptContent = fs.readFileSync('script.js', 'utf8');

// Extract the generateJobTitle function
const functionMatch = scriptContent.match(/function generateJobTitle\(userData\) \{[\s\S]*?\}/);
if (!functionMatch) {
    console.error("Could not find generateJobTitle function in script.js");
    process.exit(1);
}

// Extract the mockBedrockResponse function
const mockBedrockMatch = scriptContent.match(/function mockBedrockResponse\(userData\) \{[\s\S]*?return new Promise[\s\S]*?\}\);[\s\S]*?\}/);
if (!mockBedrockMatch) {
    console.error("Could not find mockBedrockResponse function in script.js");
    process.exit(1);
}

// Extract the showResult function
const showResultMatch = scriptContent.match(/function showResult\(result\) \{[\s\S]*?\}/);
if (!showResultMatch) {
    console.error("Could not find showResult function in script.js");
    process.exit(1);
}

// Extract the showLoading function
const showLoadingMatch = scriptContent.match(/function showLoading\(\) \{[\s\S]*?\}/);
if (!showLoadingMatch) {
    console.error("Could not find showLoading function in script.js");
    process.exit(1);
}

// Combine the functions
const combinedCode = `
${functionMatch[0]}
${mockBedrockMatch[0]}
${showResultMatch[0]}
${showLoadingMatch[0]}

// Test template-based generation
console.log("Testing template-based generation:");
const templateResult = generateJobTitle(${JSON.stringify(userData)});
console.log("Job Title:", templateResult.title);
console.log("Description:", templateResult.description);
console.log();

// Test mock Bedrock generation
console.log("Testing mock Bedrock generation:");
mockBedrockResponse(${JSON.stringify(userData)})
    .then(result => {
        console.log("Job Title:", result.title);
        console.log("Description:", result.description);
    });
`;

// Run the code in our context
vm.createContext(context);
vm.runInContext(combinedCode, context);

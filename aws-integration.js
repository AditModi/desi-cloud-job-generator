// AWS Integration for Desi Cloud Job Title Generator
// This file contains functions to integrate with AWS Bedrock for AI-powered job title generation

// Import AWS SDK for Bedrock
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

// Import configuration
const { ENV, AWS_CONFIG } = require("./config");

/**
 * Generate job title using AWS Bedrock
 * @param {Object} userData - User input data
 * @returns {Promise<Object>} Generated job title and description
 */
async function generateJobTitleWithBedrock(userData) {
    const prompt = createPrompt(userData);
    
    try {
        // Call AWS Bedrock API
        const response = await callBedrockAPI(prompt, userData);
        return parseBedrockResponse(response, userData.name);
    } catch (error) {
        console.error('Error calling Bedrock API:', error);
        // Throw the error to be handled by the caller
        throw error;
    }
}

/**
 * Create a structured prompt for the AI model
 * @param {Object} userData - User input data
 * @returns {string} Formatted prompt
 */
function createPrompt(userData) {
    return `You are a creative AI career coach for Indian techies. Given the details below, invent a unique, futuristic, and quirky cloud job title and write a playful, respectful, and desi-flavored job description (2-3 lines). Use Hinglish or Indian English, include local tech culture or pop culture references, and keep the tone positive and fun. Avoid stereotypes and ensure the description is friendly for all genders.

Inputs:
Name: ${userData.name}
Favourite cloud service or tech area: ${userData.cloudService}
Preferred work style: ${userData.workStyle}
Secret superpower or quirky skill: ${userData.superpower}

Output Format:
Job Title: [Desi, quirky, futuristic title]
Description: [2-3 lines, Hinglish or Indian English, using local references, workplace humor, and a positive, inclusive tone.]

Example:
Job Title: Data Dabbawala
Description: Ananya is the Data Dabbawala who delivers perfect queries faster than Mumbai's lunchboxes. Her teamwork and snack-finding skills keep the whole cloud crew happy and productive. Even the servers wait for her next move!

Generate a creative and unique job title now:`;
}

/**
 * Call AWS Bedrock API
 * @param {string} prompt - The prompt to send to the model
 * @param {Object} userData - User input data for context
 * @returns {Promise<string>} Model response
 */
async function callBedrockAPI(prompt, userData) {
    // Check if we should use mock in development mode
    if (ENV.NODE_ENV === 'development' && ENV.FEATURES.USE_MOCK_IN_DEV) {
        console.log("Using mock response in development mode");
        return mockBedrockResponse(userData);
    }
    
    try {
        // Create Bedrock client
        const client = new BedrockRuntimeClient({ 
            region: AWS_CONFIG.region 
        });
        
        // Prepare the request payload for Claude 3 Haiku
        const input = {
            modelId: AWS_CONFIG.bedrock.modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: AWS_CONFIG.bedrock.maxTokens,
                temperature: AWS_CONFIG.bedrock.temperature,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        };
        
        // Send the request to Bedrock
        const command = new InvokeModelCommand(input);
        const response = await client.send(command);
        
        // Parse the response
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        return responseBody.content[0].text;
    } catch (error) {
        console.error("Error calling Bedrock:", error);
        
        // If we're in development mode, provide a mock response as fallback
        if (ENV.NODE_ENV === 'development') {
            console.log("Falling back to mock response after error");
            return mockBedrockResponse(userData);
        }
        
        throw error;
    }
}

/**
 * Generate a mock response for development/testing
 * @param {Object} userData - User input data
 * @returns {string} Mock response
 */
function mockBedrockResponse(userData) {
    // Create more personalized mock responses based on user inputs
    let jobTitle;
    
    switch(userData.cloudService) {
        case 'Serverless':
            jobTitle = 'Function Fusion Maharaja';
            break;
        case 'AI/ML':
            jobTitle = 'Neural Nawaab';
            break;
        case 'Security':
            jobTitle = 'Digital Darwaan 3000';
            break;
        case 'Databases':
            jobTitle = 'Query Qutub Minar';
            break;
        case 'IoT':
            jobTitle = 'Sensor Samrat';
            break;
        default:
            jobTitle = 'Cloud Computing Rockstar';
    }
    
    const description = `${userData.name} is the ${jobTitle} who combines ${userData.workStyle.toLowerCase()} with ${userData.superpower.toLowerCase()} to create tech magic. Their approach to cloud computing is as unique as finding a quiet corner in a Delhi market!`;
    
    return `Job Title: ${jobTitle}\nDescription: ${description}`;
}

/**
 * Parse the response from Bedrock API
 * @param {string} response - Raw response from Bedrock
 * @param {string} userName - User's name for the result
 * @returns {Object} Parsed job title and description
 */
function parseBedrockResponse(response, userName) {
    const lines = response.split('\n');
    let jobTitle = '';
    let description = '';
    
    for (const line of lines) {
        if (line.startsWith('Job Title:')) {
            jobTitle = line.replace('Job Title:', '').trim();
        } else if (line.startsWith('Description:')) {
            description = line.replace('Description:', '').trim();
        }
    }
    
    return {
        title: jobTitle || 'Cloud Computing Specialist',
        description: description || `${userName} is a dedicated cloud professional with amazing skills!`,
        userName: userName
    };
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateJobTitleWithBedrock,
        callBedrockAPI,
        parseBedrockResponse
    };
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateJobTitleWithBedrock,
        callBedrockAPI,
        parseBedrockResponse
    };
}

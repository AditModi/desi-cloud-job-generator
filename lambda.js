// AWS Lambda Handler for Desi Cloud Job Title Generator

// Import required modules
const { generateJobTitleWithBedrock } = require('./aws-integration');

/**
 * AWS Lambda function handler
 * @param {Object} event - API Gateway event
 * @returns {Object} API Gateway response
 */
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        // Parse user data from request body
        const userData = JSON.parse(event.body);
        
        // Validate required fields
        if (!userData.name || !userData.cloudService || !userData.workStyle || !userData.superpower) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }
        
        // Generate job title using AWS Bedrock
        const result = await generateJobTitleWithBedrock(userData);
        
        // Return the result
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('Lambda error:', error);
        
        // Return error response
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

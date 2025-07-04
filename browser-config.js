// Browser configuration for Desi Cloud Job Title Generator

// Set global configuration for the browser environment
window.bedrockEnabled = true;

// For local development, we'll use mock responses
window.useMockResponses = true;

// API endpoint for AWS Lambda function
// This would be your actual API Gateway endpoint when deployed
window.apiEndpoint = '/api/generate';

// Feature flags
window.features = {
    useAIByDefault: false,  // Whether to check the AI toggle by default
    showDebugInfo: true     // Whether to show debug information in the console
};

// Initialize configuration
document.addEventListener('DOMContentLoaded', function() {
    // Set default state of AI toggle based on configuration
    const aiToggle = document.getElementById('useAI');
    if (aiToggle) {
        aiToggle.checked = window.features.useAIByDefault;
    }
    
    // Log debug information if enabled
    if (window.features.showDebugInfo) {
        console.log('Bedrock integration enabled:', window.bedrockEnabled);
        console.log('Using mock responses:', window.useMockResponses);
        console.log('API endpoint:', window.apiEndpoint);
    }
});

// Test script for Desi Cloud Job Title Generator

// Import the job title templates and description templates from script.js
const fs = require('fs');
const scriptContent = fs.readFileSync('script.js', 'utf8');

// Extract the job title templates
const jobTitleTemplatesMatch = scriptContent.match(/const jobTitleTemplates = (\{[\s\S]*?\});/);
if (!jobTitleTemplatesMatch) {
    console.error("Could not find jobTitleTemplates in script.js");
    process.exit(1);
}

// Extract the description templates
const descriptionTemplatesMatch = scriptContent.match(/const descriptionTemplates = (\{[\s\S]*?\});/);
if (!descriptionTemplatesMatch) {
    console.error("Could not find descriptionTemplates in script.js");
    process.exit(1);
}

// Extract the superpower descriptions
const superpowerDescriptionsMatch = scriptContent.match(/const superpowerDescriptions = (\{[\s\S]*?\});/);
if (!superpowerDescriptionsMatch) {
    console.error("Could not find superpowerDescriptions in script.js");
    process.exit(1);
}

// Evaluate the templates
const jobTitleTemplates = eval(`(${jobTitleTemplatesMatch[1]})`);
const descriptionTemplates = eval(`(${descriptionTemplatesMatch[1]})`);
const superpowerDescriptions = eval(`(${superpowerDescriptionsMatch[1]})`);

// Generate job title function
function generateJobTitle(userData) {
    // Get random job title for the selected cloud service
    const titles = jobTitleTemplates[userData.cloudService] || ['Cloud Computing Specialist'];
    const jobTitle = titles[Math.floor(Math.random() * titles.length)];
    
    // Get description template for work style
    const descriptions = descriptionTemplates[userData.workStyle] || ['works with dedication and skill'];
    const workStyleDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Get superpower description
    const superpowerDesc = superpowerDescriptions[userData.superpower] || 'Has amazing technical skills!';
    
    // Create full description
    const fullDescription = `${userData.name} is the ${jobTitle} who ${workStyleDesc}. ${superpowerDesc}`;
    
    return {
        title: jobTitle,
        description: fullDescription,
        userName: userData.name
    };
}

// Mock AI generation
function mockAIGeneration(userData) {
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
    
    return {
        title: jobTitle,
        description: description,
        userName: userData.name
    };
}

// Test data
const testUsers = [
    {
        name: "Rahul Sharma",
        cloudService: "Serverless",
        workStyle: "Jugaadu",
        superpower: "Can fix WiFi with jugaad"
    },
    {
        name: "Priya Patel",
        cloudService: "AI/ML",
        workStyle: "Night owl",
        superpower: "Can debug anything at 3 AM"
    },
    {
        name: "Amit Kumar",
        cloudService: "Security",
        workStyle: "Perfectionist",
        superpower: "Never forgets to backup"
    },
    {
        name: "Sneha Gupta",
        cloudService: "Databases",
        workStyle: "Team player",
        superpower: "Can explain complex tech in simple Hindi"
    },
    {
        name: "Vikram Singh",
        cloudService: "DevOps",
        workStyle: "Frugal innovator",
        superpower: "Finds parking spots in Bangalore"
    }
];

// Test template-based generation
console.log("=== TEMPLATE-BASED GENERATION ===\n");
testUsers.forEach(user => {
    const result = generateJobTitle(user);
    console.log(`Name: ${user.name}`);
    console.log(`Cloud Service: ${user.cloudService}`);
    console.log(`Work Style: ${user.workStyle}`);
    console.log(`Superpower: ${user.superpower}`);
    console.log(`Job Title: ${result.title}`);
    console.log(`Description: ${result.description}`);
    console.log();
});

// Test mock AI generation
console.log("=== MOCK AI GENERATION ===\n");
testUsers.forEach(user => {
    const result = mockAIGeneration(user);
    console.log(`Name: ${user.name}`);
    console.log(`Cloud Service: ${user.cloudService}`);
    console.log(`Work Style: ${user.workStyle}`);
    console.log(`Superpower: ${user.superpower}`);
    console.log(`Job Title: ${result.title}`);
    console.log(`Description: ${result.description}`);
    console.log();
});

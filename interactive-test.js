#!/usr/bin/env node

// Interactive test script for Desi Cloud Job Title Generator
const readline = require('readline');
const fs = require('fs');

// Extract the job title templates and description templates from script.js
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
        case 'DevOps':
            jobTitle = 'Pipeline Pandit';
            break;
        case 'Networking':
            jobTitle = 'Bandwidth Baadshah';
            break;
        case 'Storage':
            jobTitle = 'S3 Samosa Specialist';
            break;
        case 'Analytics':
            jobTitle = 'Data Dhaba Owner';
            break;
        case 'Containers':
            jobTitle = 'Kubernetes Kulfi King';
            break;
        case 'Microservices':
            jobTitle = 'API Autowallah';
            break;
        case 'Edge Computing':
            jobTitle = 'Edge Ek Number';
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

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    
    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        crimson: '\x1b[38m'
    },
    
    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
        crimson: '\x1b[48m'
    }
};

// Clear the console
console.clear();

// Print welcome message
console.log(`${colors.fg.cyan}${colors.bright}=== Desi Cloud Job Title Generator ===\n${colors.reset}`);
console.log(`${colors.fg.yellow}This interactive test allows you to generate job titles using both template-based and AI-powered methods.\n${colors.reset}`);

// Get user input
function getUserInput() {
    console.log(`${colors.fg.green}${colors.bright}Please enter your information:${colors.reset}\n`);
    
    rl.question(`${colors.fg.white}Your Name: ${colors.reset}`, (name) => {
        // Show cloud service options
        console.log(`\n${colors.fg.white}Available Cloud Services:${colors.reset}`);
        const cloudServices = Object.keys(jobTitleTemplates);
        cloudServices.forEach((service, index) => {
            console.log(`${index + 1}. ${service}`);
        });
        
        rl.question(`\n${colors.fg.white}Select Cloud Service (1-${cloudServices.length}): ${colors.reset}`, (serviceIndex) => {
            const cloudService = cloudServices[parseInt(serviceIndex) - 1] || cloudServices[0];
            
            // Show work style options
            console.log(`\n${colors.fg.white}Available Work Styles:${colors.reset}`);
            const workStyles = Object.keys(descriptionTemplates);
            workStyles.forEach((style, index) => {
                console.log(`${index + 1}. ${style}`);
            });
            
            rl.question(`\n${colors.fg.white}Select Work Style (1-${workStyles.length}): ${colors.reset}`, (styleIndex) => {
                const workStyle = workStyles[parseInt(styleIndex) - 1] || workStyles[0];
                
                // Show superpower options
                console.log(`\n${colors.fg.white}Available Superpowers:${colors.reset}`);
                const superpowers = Object.keys(superpowerDescriptions);
                superpowers.forEach((power, index) => {
                    console.log(`${index + 1}. ${power}`);
                });
                
                rl.question(`\n${colors.fg.white}Select Superpower (1-${superpowers.length}): ${colors.reset}`, (powerIndex) => {
                    const superpower = superpowers[parseInt(powerIndex) - 1] || superpowers[0];
                    
                    // Ask which generation method to use
                    rl.question(`\n${colors.fg.white}Use AI-powered generation? (y/n): ${colors.reset}`, (useAI) => {
                        const userData = {
                            name,
                            cloudService,
                            workStyle,
                            superpower
                        };
                        
                        console.log(`\n${colors.fg.yellow}Generating job title...${colors.reset}\n`);
                        
                        // Simulate loading
                        setTimeout(() => {
                            if (useAI.toLowerCase() === 'y') {
                                // Use mock AI generation
                                const result = mockAIGeneration(userData);
                                showResult(result, true);
                            } else {
                                // Use template-based generation
                                const result = generateJobTitle(userData);
                                showResult(result, false);
                            }
                            
                            // Ask if user wants to generate another job title
                            rl.question(`\n${colors.fg.white}Generate another job title? (y/n): ${colors.reset}`, (again) => {
                                if (again.toLowerCase() === 'y') {
                                    console.clear();
                                    getUserInput();
                                } else {
                                    console.log(`\n${colors.fg.cyan}${colors.bright}Thank you for using Desi Cloud Job Title Generator!${colors.reset}`);
                                    rl.close();
                                }
                            });
                        }, 1500);
                    });
                });
            });
        });
    });
}

// Show result
function showResult(result, isAI) {
    console.log(`${colors.fg.magenta}${colors.bright}=== Your Desi Cloud Job Title ===\n${colors.reset}`);
    console.log(`${colors.fg.cyan}${colors.bright}${result.title}${colors.reset}`);
    console.log(`\n${colors.fg.white}${result.description}${colors.reset}`);
    console.log(`\n${colors.fg.yellow}- ${result.userName}${colors.reset}`);
    console.log(`\n${colors.dim}(Generated using ${isAI ? 'AI-powered' : 'template-based'} method)${colors.reset}`);
}

// Start the interactive test
getUserInput();

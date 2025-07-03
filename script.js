// Job title generation logic
const jobTitleTemplates = {
    'Serverless': [
        'Lambda Lassi Master',
        'Function Falooda Specialist',
        'Serverless Samosa Chef',
        'Event-Driven Dosa Expert'
    ],
    'AI/ML': [
        'Algorithm Aloo Tikki',
        'Neural Network Naan Baker',
        'Machine Learning Masala Mixer',
        'Data Science Dhokla Maker'
    ],
    'Security': [
        'Cyber Security Chowkidar',
        'Firewall Pani Puri Vendor',
        'Encryption Idli Specialist',
        'Zero Trust Zomato Delivery'
    ],
    'Databases': [
        'Data Dabbawala',
        'Query Quesadilla Master',
        'NoSQL Noodle Expert',
        'Schema Sambar Specialist'
    ],
    'IoT': [
        'IoT Imli Connector',
        'Sensor Sev Puri Master',
        'Edge Computing Egg Roll',
        'Device Dhaba Manager'
    ],
    'Networking': [
        'Network Nimbu Paani Mixer',
        'Load Balancer Laddu Maker',
        'CDN Chai Distributor',
        'Bandwidth Bhel Puri Expert'
    ],
    'DevOps': [
        'CI/CD Chole Bhature',
        'Pipeline Pakoda Fryer',
        'Container Kulfi Maker',
        'Deployment Dahi Vada'
    ],
    'Storage': [
        'Cloud Storage Chutney Keeper',
        'Backup Biryani Specialist',
        'Archive Achar Manager',
        'Data Lake Dal Expert'
    ],
    'Analytics': [
        'Big Data Bhajiya Analyst',
        'Metrics Momo Counter',
        'Dashboard Dosa Designer',
        'Insights Idiyappam Expert'
    ],
    'Containers': [
        'Docker Dabeli Master',
        'Kubernetes Kachori King',
        'Pod Pav Bhaji Specialist',
        'Orchestration Uttapam Expert'
    ],
    'Microservices': [
        'Service Mesh Samosa Architect',
        'API Gateway Aloo Paratha',
        'Microservice Misal Pav Master',
        'Distributed Dhokla Designer'
    ],
    'Edge Computing': [
        'Edge Ennai Kathirikai Expert',
        'Latency Lemon Rice Reducer',
        'Regional Rasam Router',
        'Proximity Poha Processor'
    ]
};

const descriptionTemplates = {
    'Jugaadu': [
        'finds creative solutions faster than finding parking in Bangalore',
        'can fix any cloud issue with the same spirit as fixing a broken rickshaw',
        'turns complex problems into simple solutions like making perfect chai'
    ],
    'Team player': [
        'brings teams together like a good Bollywood movie brings families',
        'collaborates better than street vendors sharing space',
        'makes teamwork as smooth as butter chicken'
    ],
    'WFH expert': [
        'masters remote work like a pro gamer masters PUBG',
        'runs virtual meetings smoother than Mumbai local trains',
        'balances work-life like balancing spices in dal'
    ],
    'Night owl': [
        'codes through the night like a dedicated street food vendor',
        'debugs at 3 AM with the energy of a Bollywood dance number',
        'burns the midnight oil like Diwali celebrations'
    ],
    'Code-ninja': [
        'writes code faster than making instant Maggi',
        'debugs with the precision of a cricket commentator',
        'deploys solutions quicker than ordering food on Swiggy'
    ],
    'Early bird': [
        'starts coding before the chai wallah opens shop',
        'catches bugs earlier than morning newspaper delivery',
        'begins work with the enthusiasm of first day of IPL'
    ],
    'Meeting master': [
        'runs meetings smoother than a well-oiled auto rickshaw',
        'facilitates discussions like a seasoned cricket captain',
        'keeps everyone engaged like a good Bollywood plot twist'
    ],
    'Documentation guru': [
        'documents code better than family WhatsApp group admins',
        'writes guides clearer than Google Maps directions',
        'maintains records like a dedicated CA during tax season'
    ],
    'Multitasker': [
        'juggles tasks like a street performer juggling fire',
        'handles multiple projects like managing joint family dynamics',
        'switches contexts faster than changing TV channels during ads'
    ],
    'Perfectionist': [
        'polishes code like polishing brass during Diwali',
        'perfects solutions with the dedication of a classical musician',
        'fine-tunes systems like tuning a harmonium'
    ]
};

const superpowerDescriptions = {
    'Can fix WiFi with jugaad': 'Even the routers respect their innovative troubleshooting skills!',
    'Never misses chai break': 'Keeps the team caffeinated and motivated throughout the day!',
    'Can code during power cuts': 'Nothing stops their coding flow, not even load shedding!',
    'Meme-master': 'Lightens up Slack channels and makes standups actually fun!',
    'Always finds the best snacks': 'The office snack game is always on point with them around!',
    'Can debug anything at 3 AM': 'Production issues fear their late-night debugging superpowers!',
    'Makes the best filter coffee': 'Fuels the entire dev team with perfect South Indian coffee!',
    'Can explain complex tech in simple Hindi': 'Makes cloud computing as easy to understand as Bollywood plots!',
    'Never forgets to backup': 'Data loss is just a myth in their presence!',
    'Can work through any Bollywood song': 'Productivity increases with every beat drop!',
    'Always has the right cable': 'The human equivalent of a Swiss Army knife for tech problems!',
    'Can make friends with any API': 'APIs actually enjoy working with them!'
};

// Form handling
document.getElementById('jobTitleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('userName'),
        cloudService: formData.get('cloudService'),
        workStyle: formData.get('workStyle'),
        superpower: formData.get('superpower')
    };
    
    showLoading();
    
    // Simulate API call delay for better UX
    setTimeout(() => {
        const result = generateJobTitle(userData);
        showResult(result);
    }, 2000);
});

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

function showLoading() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('loadingDiv').style.display = 'block';
}

function showResult(result) {
    document.getElementById('loadingDiv').style.display = 'none';
    document.getElementById('jobTitle').textContent = result.title;
    document.getElementById('jobDescription').textContent = result.description;
    document.getElementById('resultUserName').textContent = `- ${result.userName}`;
    document.getElementById('resultContainer').style.display = 'block';
    
    // Scroll to result
    document.getElementById('resultContainer').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

function shareResult() {
    const jobTitle = document.getElementById('jobTitle').textContent;
    const jobDescription = document.getElementById('jobDescription').textContent;
    const userName = document.getElementById('resultUserName').textContent;
    
    const shareText = `🚀 Check out my Desi Cloud Job Title!\n\n${jobTitle}\n\n${jobDescription}\n\n${userName}\n\n#DesiCloudJobs #TechCareers #CloudComputing`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Desi Cloud Job Title',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Job title copied to clipboard! Share it with your friends! 🎉');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Job title copied to clipboard! Share it with your friends! 🎉');
        });
    }
}

function generateAgain() {
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('formContainer').style.display = 'block';
    
    // Scroll back to form
    document.getElementById('formContainer').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Add some fun interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to form elements
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add typing effect to subtitle
    const subtitle = document.querySelector('.subtitle');
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    setTimeout(typeWriter, 1000);
});

// Easter egg: Konami code for special job title
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Show special job title
        showResult({
            title: '🎮 Ultimate Jugaad Master Supreme 🎮',
            description: 'You have unlocked the legendary title! You are the chosen one who can solve any tech problem with pure desi jugaad and unlimited chai power. Even Stack Overflow asks you for solutions!',
            userName: 'The Konami Code Master'
        });
        
        konamiCode = []; // Reset
    }
});

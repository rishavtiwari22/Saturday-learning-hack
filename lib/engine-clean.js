const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const Jimp = require('jimp');
require('dotenv').config();

// Configuration
const CHALLENGE_DIR = path.join(__dirname, '../challenges');
const OUTPUT_DIR = path.join(__dirname, '../outputs');
const PROGRESS_PATH = path.join(require('os').homedir(), '.prompt-challenge', 'progress.json');
const THRESHOLD = 0.75;

// Challenge definitions
const CHALLENGES = [
  {
    id: '1',
    title: 'Cute Cat Portrait',
    hint: 'Create a portrait of a cute cat with big eyes, sitting in a garden',
    image: 'cat_reference.jpg',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Futuristic City',
    hint: 'Design a futuristic cityscape with neon lights and flying cars',
    image: 'city_reference.jpg',
    difficulty: 'Intermediate'
  },
  {
    id: '3',
    title: 'Fantasy Dragon',
    hint: 'Create a majestic dragon flying over mountains with magical effects',
    image: 'dragon_reference.jpg',
    difficulty: 'Advanced'
  }
];

// Initialize directories and progress file
function initSetup() {
  fs.ensureDirSync(CHALLENGE_DIR);
  fs.ensureDirSync(OUTPUT_DIR);
  fs.ensureDirSync(path.dirname(PROGRESS_PATH));
}

function getProgress() {
  initSetup();
  if (!fs.existsSync(PROGRESS_PATH)) {
    const initialProgress = {
      user: 'default',
      challenges: { '1': { status: 'unlocked' } }
    };
    fs.writeJsonSync(PROGRESS_PATH, initialProgress);
    return initialProgress;
  }
  return fs.readJsonSync(PROGRESS_PATH);
}

function saveProgress(progress) {
  fs.writeJsonSync(PROGRESS_PATH, progress);
}

// Initialize challenges and create reference images
async function initializeChallenges() {
  initSetup();
  
  // Create challenge JSON files
  for (const challenge of CHALLENGES) {
    const challengePath = path.join(CHALLENGE_DIR, `${challenge.id}.json`);
    if (!fs.existsSync(challengePath)) {
      fs.writeJsonSync(challengePath, challenge);
    }
  }
  
  // Create reference images
  for (const challenge of CHALLENGES) {
    const imagePath = path.join(CHALLENGE_DIR, challenge.image);
    if (!fs.existsSync(imagePath)) {
      await createReferenceImage(challenge);
    }
  }
  
  console.log(chalk.green('✓ Challenges initialized successfully!'));
}

// Create placeholder reference images
async function createReferenceImage(challenge) {
  const imagePath = path.join(CHALLENGE_DIR, challenge.image);
  const image = new Jimp(512, 512, 0x2563ebff);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  
  const title = challenge.title.toUpperCase();
  const lines = title.split(' ');
  
  let y = 200;
  for (const line of lines) {
    const textWidth = Jimp.measureText(font, line);
    const x = (512 - textWidth) / 2;
    image.print(font, x, y, line);
    y += 40;
  }
  
  await image.writeAsync(imagePath);
}

// List all challenges with status
async function listChallenges() {
  await initializeChallenges();
  const progress = getProgress();
  
  console.log(chalk.bold.blue('\\n🎯 Prompt Engineering Challenges\\n'));
  
  for (const challenge of CHALLENGES) {
    const challengeProgress = progress.challenges[challenge.id];
    const status = challengeProgress?.status || 'locked';
    const score = challengeProgress?.score;
    
    let icon, color;
    switch (status) {
      case 'completed':
        icon = '✅';
        color = chalk.green;
        break;
      case 'in_progress':
        icon = '⏳';
        color = chalk.yellow;
        break;
      case 'unlocked':
        icon = '🆕';
        color = chalk.blue;
        break;
      default:
        icon = '🔒';
        color = chalk.gray;
    }
    
    console.log(`${icon} ${color.bold(challenge.title)} [${challenge.difficulty}]`);
    console.log(`   ${chalk.gray(challenge.hint)}`);
    if (score) {
      console.log(`   ${chalk.cyan('Score:')} ${chalk.white(score.toFixed(2))}`);
    }
    console.log();
  }
  
  console.log(chalk.dim('💡 Use "pe start <id>" to begin a challenge'));
}

// Start a challenge
async function startChallenge(id) {
  const challenge = CHALLENGES.find(c => c.id === id);
  if (!challenge) {
    console.log(chalk.red('❌ Challenge not found'));
    return;
  }
  
  const progress = getProgress();
  const challengeProgress = progress.challenges[id];
  const status = challengeProgress?.status || 'locked';
  
  if (status === 'locked') {
    console.log(chalk.red('🔒 This challenge is locked. Complete previous challenges first.'));
    return;
  }
  
  // Show challenge info
  console.log(chalk.bold.blue(`\\n🎯 Challenge ${id}: ${challenge.title}\\n`));
  console.log(chalk.yellow(`💡 ${challenge.hint}\\n`));
  
  // Show reference image if it exists
  const imagePath = path.join(CHALLENGE_DIR, challenge.image);
  if (fs.existsSync(imagePath)) {
    console.log(chalk.gray(`📸 Reference: ${challenge.image}\\n`));
  }
  
  // Prompt template
  console.log(chalk.bold.cyan('📝 Prompt Template:'));
  console.log(chalk.gray('Subject: [main object/action]'));
  console.log(chalk.gray('Style: [realistic, anime, artistic]'));
  console.log(chalk.gray('Details: [specific features, colors, mood]'));
  console.log(chalk.gray('Quality: [high detail, 4K, sharp]\\n'));
  
  // Get user prompt
  const { prompt } = await inquirer.prompt([{
    type: 'input',
    name: 'prompt',
    message: '✏️  Enter your prompt:',
    validate: input => input.trim().length > 5 || 'Prompt must be at least 5 characters'
  }]);
  
  console.log(chalk.yellow('\\n🎨 Generating image...'));
  
  try {
    // Generate image (placeholder for now)
    const outputPath = await generateImage(prompt, id);
    
    // Calculate similarity score (mock)
    const score = await calculateSimilarity();
    
    // Update progress
    const newStatus = score >= THRESHOLD ? 'completed' : 'in_progress';
    progress.challenges[id] = {
      status: newStatus,
      score: score,
      prompt: prompt,
      lastAttempt: new Date().toISOString()
    };
    
    // Unlock next challenge if completed
    if (newStatus === 'completed') {
      const nextId = (parseInt(id) + 1).toString();
      const nextChallenge = CHALLENGES.find(c => c.id === nextId);
      if (nextChallenge && !progress.challenges[nextId]) {
        progress.challenges[nextId] = { status: 'unlocked' };
      }
    }
    
    saveProgress(progress);
    
    // Show results
    console.log(chalk.bold('\\n📊 Results:'));
    console.log(`   Similarity Score: ${chalk.cyan(score.toFixed(3))}`);
    console.log(`   Threshold: ${chalk.gray(THRESHOLD)}`);
    
    if (newStatus === 'completed') {
      console.log(chalk.green.bold('\\n🎉 Challenge completed!'));
      const nextId = (parseInt(id) + 1).toString();
      if (CHALLENGES.find(c => c.id === nextId)) {
        console.log(chalk.yellow(`🔓 Challenge ${nextId} unlocked!`));
      }
    } else {
      console.log(chalk.yellow('\\n📈 Keep improving your prompt!'));
    }
    
    console.log(chalk.blue(`\\n🖼️  Image saved: ${path.basename(outputPath)}`));
    
  } catch (error) {
    console.error(chalk.red('❌ Error:'), error.message);
  }
}

// Generate image (placeholder implementation)
async function generateImage(prompt, challengeId) {
  const outputPath = path.join(OUTPUT_DIR, `challenge_${challengeId}_${Date.now()}.png`);
  
  // Create placeholder image with prompt text
  const image = new Jimp(512, 512, 0x1a1a1aff);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  
  // Word wrap prompt
  const words = prompt.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length > 40) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());
  
  // Draw text
  let y = 200;
  for (const line of lines.slice(0, 8)) {
    image.print(font, 20, y, line);
    y += 25;
  }
  
  await image.writeAsync(outputPath);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return outputPath;
}

// Calculate similarity (mock implementation)
async function calculateSimilarity() {
  console.log(chalk.gray('   🧮 Calculating similarity...'));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return random score for demo
  return Math.random() * 0.4 + 0.5; // 0.5 to 0.9
}

// Show progress
async function showProgress() {
  const progress = getProgress();
  console.log(chalk.bold.blue('\\n📈 Your Progress\\n'));
  console.log(JSON.stringify(progress, null, 2));
}

// Retry challenge
async function retryChallenge(id) {
  await startChallenge(id);
}

module.exports = {
  listChallenges,
  startChallenge,
  retryChallenge,
  showProgress,
  initializeChallenges
};

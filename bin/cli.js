#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const engine = require('../lib/engine');
const fs = require('fs-extra');
const path = require('path');

const program = new Command();
const PROGRESS_PATH = path.join(require('os').homedir(), '.prompt-challenge', 'progress.json');

program
  .name('pe')
  .description('🎯 Prompt Engineering CLI Challenge')
  .version('1.0.0');

// List challenges
program
  .command('list')
  .alias('ls')
  .description('List all challenges and status')
  .action(async () => {
    try {
      await engine.listChallenges();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
  });

// Start challenge
program
  .command('start <id>')
  .description('Start a challenge (e.g., pe start 1)')
  .action(async (id) => {
    try {
      await engine.startChallenge(id);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
  });

// Retry challenge
program
  .command('retry <id>')
  .description('Retry a challenge')
  .action(async (id) => {
    try {
      await engine.retryChallenge(id);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
  });

// Show progress
program
  .command('progress')
  .description('Show your progress')
  .action(() => {
    try {
      if (fs.existsSync(PROGRESS_PATH)) {
        const progress = fs.readJsonSync(PROGRESS_PATH);
        console.log(chalk.bold.blue('\\n📈 Your Progress:\\n'));
        
        let completed = 0;
        let total = 0;
        
        for (const [id, data] of Object.entries(progress.challenges)) {
          total++;
          if (data.status === 'completed') {
            completed++;
            console.log(chalk.green(`✅ Challenge ${id}: Completed (Score: ${data.score.toFixed(2)})`));
          } else if (data.status === 'in_progress') {
            console.log(chalk.yellow(`⏳ Challenge ${id}: In Progress (Score: ${data.score?.toFixed(2) || 'N/A'})`));
          } else if (data.status === 'unlocked') {
            console.log(chalk.blue(`🆕 Challenge ${id}: Available`));
          }
        }
        
        console.log(chalk.bold(`\\n🏆 Progress: ${completed}/${total} completed`));
      } else {
        console.log(chalk.yellow('📊 No progress yet. Run "pe init" to start!'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
  });

// Initialize
program
  .command('init')
  .description('Initialize challenges')
  .action(async () => {
    try {
      await engine.initializeChallenges();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
  });

// Status check
program
  .command('status')
  .description('Check API configuration status')
  .action(() => {
    console.log(chalk.bold.blue('\n🔧 API Configuration Status\n'));
    
    // Check Hugging Face
    if (process.env.HUGGINGFACE_TOKEN) {
      console.log(chalk.green('✅ Hugging Face API: Configured (Real AI image generation enabled)'));
    } else {
      console.log(chalk.yellow('⚠️  Hugging Face API: Not configured (Using placeholder images)'));
      console.log(chalk.gray('   💡 Get free token at: https://huggingface.co/settings/tokens'));
    }
    
    // Check Google API
    if (process.env.GOOGLE_API_KEY) {
      console.log(chalk.green('✅ Google Gemini API: Configured (AI-powered similarity scoring)'));
    } else {
      console.log(chalk.yellow('⚠️  Google Gemini API: Not configured (Using random scoring)'));
      console.log(chalk.gray('   💡 Get free API key at: https://aistudio.google.com/app/apikey'));
    }
    
    console.log(chalk.dim('\n📝 Create a .env file with your API keys to enable full functionality'));
  });

// Show help if no command
if (!process.argv.slice(2).length) {
  console.log(chalk.bold.blue('\\n🎯 Prompt Engineering Challenge\\n'));
  console.log(chalk.yellow('Quick start:'));
  console.log('  pe init    - Setup challenges');
  console.log('  pe status  - Check API configuration');  
  console.log('  pe list    - View challenges');
  console.log('  pe start 1 - Begin first challenge\\n');
  program.outputHelp();
}

program.parse(process.argv);

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

// Show help if no command
if (!process.argv.slice(2).length) {
  console.log(chalk.bold.blue('\\n🎯 Prompt Engineering Challenge\\n'));
  console.log(chalk.yellow('Quick start:'));
  console.log('  pe init    - Setup challenges');
  console.log('  pe list    - View challenges');
  console.log('  pe start 1 - Begin first challenge\\n');
  program.outputHelp();
}

program.parse(process.argv);

# Prompt Engineering CLI Challenge

A simple CLI tool to practice prompt engineering skills through interactive challenges.

## ✨ Features

- 🎯 **Progressive Challenges** - Unlock new challenges as you improve
- 📊 **Smart Scoring** - AI-powered similarity comparison
- 🎨 **Image Generation** - Create images from your prompts
- 📈 **Progress Tracking** - Save your journey locally

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Initialize challenges
npm run start init

# List available challenges
npm run start list

# Start your first challenge
npm run start start 1
```

## 📋 Commands

| Command | Description |
|---------|-------------|
| `pe init` | Setup challenges and reference images |
| `pe list` | Show all challenges and their status |
| `pe start <id>` | Begin a specific challenge |
| `pe retry <id>` | Retry a challenge |
| `pe progress` | View your current progress |

## 🎯 How It Works

1. **View Challenges**: Use `pe list` to see available challenges
2. **Start Challenge**: Pick a challenge with `pe start 1`
3. **Craft Prompt**: Follow the template to create your prompt
4. **Generate Image**: The tool creates an image from your prompt
5. **Get Scored**: AI compares your result to the reference
6. **Progress**: Score ≥ 0.75 unlocks the next challenge

## 📝 Prompt Template

```
Subject: [main object/action]
Style: [realistic, anime, artistic]
Details: [specific features, colors, mood]
Quality: [high detail, 4K, sharp]
```

**Example:**
```
Subject: cute cat portrait
Style: realistic photography
Details: big blue eyes, sitting in garden, fluffy white fur
Quality: high detail, soft lighting, 4K
```

## 🔧 Installation

### Global Installation
```bash
npm install -g .
pe list  # Use 'pe' command anywhere
```

### Local Development
```bash
npm install
node bin/cli.js list
```

## 📁 Project Structure

```
prompt-cli/
├── bin/cli.js          # CLI entry point
├── lib/engine.js       # Core functionality
├── challenges/         # Challenge definitions & references
├── outputs/           # Generated images
└── package.json       # Dependencies
```

## 🔮 Future Enhancements

- **Real AI Integration**: Connect to Hugging Face, Replicate, or local models
- **CLIP Scoring**: Implement proper image similarity using CLIP embeddings
- **Custom Challenges**: Let users create their own challenges
- **Web Dashboard**: MERN stack interface for better UX

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

MIT License - Use it, modify it, share it!

---

**Ready to become a prompt engineering master?** 🚀

```bash
npm install
npm run start init
npm run start start 1
```

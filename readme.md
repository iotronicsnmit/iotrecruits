# Iotronics - Recruitment Challenge

An interactive recruitment game for a college IoT & Embedded Systems club.

![Iotronics](https://via.placeholder.com/800x400/0a192f/00ffcc?text=IOTRONICS)

## Overview

This is an interactive recruitment challenge featuring cyberpunk-themed games designed to test potential club members' reflexes and focus. Players must complete various challenges to prove their worthiness to join the Iotronics club.

## Features

- **Student Tracking System**: 
  - Name and phone number registration
  - Unique student identification and progress tracking
  - Attempt limiting (3 attempts per game per student)
- **Real-time Leaderboard**: 
  - Global rankings stored in Firebase Firestore
  - Live competition between students
  - Rank calculation and performance ratings
- **Interactive Games**: 
  - Chromatic Hunter: Color-coded target elimination game
  - Neural Reflex: Reaction time testing challenge
- **Progress Management**:
  - Personal best scores tracking
  - Completion status monitoring
  - Anti-cheat validation
- **Cyberpunk UI**: Neon effects, terminal-style interface
- **Progressive Challenge**: Multi-stage recruitment process
- **Responsive Design**: Works on all devices
<!--  -->
## Technology Stack

- HTML5 / CSS3 (Advanced animations and effects)
- Vanilla JavaScript (No frameworks)
- Firebase Firestore (Real-time database)
- Terminal/Hacker aesthetic design

## Game Structure

The recruitment process consists of:
1. **Access Protocol**: Password challenge
2. **Student Registration**: Name and phone number input with validation
3. **Player Status**: View attempts, best scores, and game availability
4. **Game Selection**: Choose your neural test
5. **Mini Games**: 
   - Chromatic Hunter (score 7+ points in 30 seconds)
   - Neural Reflex (average <350ms reaction time)
6. **Score Submission**: Achievement registration and ranking
7. **Leaderboard**: View global rankings and competition
8. **Final Riddle**: Logic puzzle (requires both games completed)
9. **Recruitment Complete**: Join the club

## Getting Started

### 🔐 **Security Setup (IMPORTANT)**

1. **Clone the repository**
2. **Set up Firebase configuration securely**:
   ```bash
   # Copy the template and add your real Firebase credentials
   cp firebase-config.template.js firebase-config.js
   ```
   - Edit `firebase-config.js` with your actual Firebase project credentials
   - **⚠️ NEVER commit `firebase-config.js` to Git** - it's already in `.gitignore`

3. **Firebase Setup**: Follow `firebase_setup.md` to configure the database
4. **Apply Firestore Security Rules**: Copy rules from `firestore-security-rules.txt` to Firebase Console
5. **Open `index.html`** in a browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Or using Node.js
   npx http-server
   ```
6. **Complete the recruitment challenges!**

### 🔒 **Security Notes**

- All sensitive configuration is in `.gitignore`
- Firebase API keys are client-safe but should still be protected
- Database access is controlled by Firestore Security Rules
- Never commit files containing real API keys or secrets

## File Structure

- `index.html` - Main recruitment challenge page
- `script.js` - Game logic, Firebase integration, and interactions
- `styles.css` - Cyberpunk styling and animations
- `firebase-config.js` - Firebase configuration and initialization
- `FIREBASE_SETUP.md` - Detailed Firebase setup instructions
- `readme.md` - Project documentation

## Game Mechanics

### Chromatic Hunter
- Click the correct colored orbs as they appear
- Score 7+ points within 30 seconds to pass
- Difficulty increases as you progress

### Neural Reflex
- Click when the signal turns green
- Complete 5 rounds with average <350ms reaction time
- Don't click too early or you will restart the round

## Database Features

### Student Management
- **Unique tracking** by phone number (unique identifier)
- **Attempt limiting** (3 attempts per game maximum)
- **Progress persistence** across browser sessions
- **Anti-cheat validation** with score verification

### Leaderboard System
- **Real-time rankings** for both games
- **Global competition** across all students
- **Performance ratings** (Elite, Advanced, etc.)
- **Personal best tracking** and rank calculation

## Color Scheme

Primary: `#00ffcc` | Secondary: `#ff00cc` | Dark: `#0a192f`

---

Developed by Iotronics Web Team

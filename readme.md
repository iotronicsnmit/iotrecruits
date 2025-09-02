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

1. **Firebase Setup**: Follow `FIREBASE_SETUP.md` to configure the database
2. **Clone the repository**
3. **Update Firebase config** in `firebase-config.js` with your project credentials
4. **Open `index.html`** in a browser
5. **Complete the recruitment challenges!**

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

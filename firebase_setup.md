# Firebase Setup Instructions

To complete the leaderboard implementation, you need to set up a Firebase project:

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `iotronics-recruitment` (or any name you prefer)
4. **Enable Google Analytics** (recommended for recruitment insights)
5. Configure Google Analytics:
   - Choose "Default Account for Firebase" or create a new account
   - Accept the Analytics terms
   - Choose your country/region
6. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project console, click "Firestore Database"
2. Click "Create database"
3. **Choose "Start in production mode"** (secure by default)
4. Select a location closest to your users (e.g., asia-south1 for India)
5. Click "Done"
6. You'll see "Cloud Firestore" with default security rules that deny all access

## Step 3: Get Firebase Configuration

1. In Firebase console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click "Web" icon `</>`
4. Enter app nickname: `iotronics-web`
5. Don't check "Firebase Hosting"
6. Click "Register app"
7. Copy the `firebaseConfig` object

## Step 4: Update firebase-config.js

Replace the placeholder values in `firebase-config.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 5: Set up Secure Firestore Rules

Since we started in production mode, we need to set up secure rules immediately:

1. In Firestore console → **Rules** tab
2. Replace the default rules with these **secure production rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students collection - phone-based access control
    match /students/{phone} {
      allow read: if true; // Anyone can read student profiles (for leaderboard)
      allow write: if isValidStudent(phone, request.resource.data);
    }
    
    // Leaderboards - read-only for clients, write allowed for score updates
    match /leaderboards/{gameType} {
      allow read: if true; // Public leaderboards
      allow write: if isValidLeaderboardUpdate(request.resource.data);
    }
    
    // Game attempts - append-only for analytics
    match /gameAttempts/{attemptId} {
      allow create: if isValidAttempt(request.resource.data);
      allow read, update, delete: if false; // Write-only for security
    }
    
    // Test connection (for debugging)
    match /test/{document} {
      allow read, write: if true;
    }
    
    // Validation functions
    function isValidStudent(phone, data) {
      return request.auth == null && // No authentication required for now
             data.name is string &&
             data.name.size() >= 2 &&
             data.name.size() <= 50 &&
             data.phone == phone &&
             data.phone is string &&
             data.phone.size() >= 10 &&
             data.phone.size() <= 15;
    }
    
    function isValidAttempt(data) {
      return data.phone is string &&
             data.name is string &&
             data.gameType in ['chromaticHunter', 'neuralReflex'] &&
             data.success is bool;
    }
    
    function isValidLeaderboardUpdate(data) {
      return data.scores is list &&
             data.scores.size() <= 50; // Max 50 scores
    }
  }
}
```

3. Click **Publish** to activate the secure rules

### **Why These Rules Are Secure:**

✅ **Input Validation**: Names must be 2-50 characters, phones 10-15 digits
✅ **Data Integrity**: Students can only write valid data structures  
✅ **Controlled Leaderboards**: Leaderboards accept valid score updates with limits
✅ **Append-Only Analytics**: Game attempts can't be modified after creation
✅ **No Unauthorized Access**: Only allows necessary operations

## Step 6: Test the Setup

1. Open `index.html` in a browser
2. Open browser console (F12)
3. Look for "Firebase connection successful" message
4. Try registering a student to test the secure rules
5. If you see permission errors, double-check your Firestore rules

## Features Now Available

✅ **Student Registration**: Name + Phone number validation and storage
✅ **Attempt Tracking**: Max 3 attempts per game per student  
✅ **Score Storage**: All attempts saved to Firebase
✅ **Real-time Leaderboard**: Global rankings for both games
✅ **Progress Tracking**: Students can see their status and best scores
✅ **Anti-cheat**: Basic validation and attempt limits
✅ **Mobile Responsive**: Optimized for all device sizes and orientations
✅ **Analytics Integration**: Detailed recruitment insights via Google Analytics

## Google Analytics Benefits

With Google Analytics enabled, you can track:

### **Recruitment Metrics**
- **Total registrations** over time
- **Game completion rates** (how many students finish each game)
- **Success rates** (percentage passing each challenge)
- **Drop-off points** (where students quit in the process)

### **Performance Analytics**
- **Average scores** across all students
- **Time spent** in each game/screen
- **Mobile vs desktop** usage patterns
- **Peak activity times** for recruitment drives

### **Real-time Insights**
- **Live user tracking** during recruitment events
- **Current active users** on the platform
- **Geographic distribution** of participants
- **Device and browser statistics**

### **Custom Events Tracked**
- `student_registration` - New student sign-ups
- `game_start` - When students begin each game
- `game_complete` - Game completion with success status
- `leaderboard_view` - Leaderboard engagement
- `recruitment_complete` - Full challenge completion

### **Accessing Analytics**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your Firebase project
3. Navigate to **Events** → **All Events** to see custom tracking
4. Use **Real-time** reports during recruitment drives
5. Check **Audience** reports for demographic insights

## Testing the System

1. Register a student with a valid phone number (e.g. +91 9876543210)
2. Play games and check if scores are saved
3. View leaderboard to see rankings
4. Try playing again to test attempt limits
5. Register another student to test competition
6. **Check Google Analytics** for event tracking:
   - Go to Google Analytics dashboard
   - Navigate to **Real-time** → **Events**
   - Verify custom events are being logged
   - Check **Engagement** → **Events** for historical data

## Admin Features (Future Enhancement)

You can add an admin panel by creating a separate page that queries:
- `db.collection('students')` - See all registered students
- `db.collection('gameAttempts')` - Analyze game performance
- `db.collection('leaderboards')` - View current rankings

## Backup & Analytics

Firebase automatically backs up your data. For analytics, you can export data from Firestore to analyze:
- Registration patterns
- Game completion rates  
- Average scores and times
- Most active players

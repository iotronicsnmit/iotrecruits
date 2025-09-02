// Firebase configuration template
// Copy this file to firebase-config.js and fill in your actual values
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // ✅ RESTORED: Direct Firestore access for Spark plan compatibility
const analytics = firebase.analytics();

// Configuration
const MAX_ATTEMPTS = {
  chromaticHunter: 3,
  neuralReflex: 3
};

// Initialize Firebase connection
function initializeFirebase() {
  console.log("Firebase initialized");
  // Track page load
  analytics.logEvent('page_view', {
    page_title: 'Recruitment Challenge',
    page_location: window.location.href
  });
  console.log("Firebase connection successful - using Cloud Functions");
}

// Analytics tracking functions
function trackEvent(eventName, parameters = {}) {
  try {
    analytics.logEvent(eventName, parameters);
    console.log(`Analytics: ${eventName}`, parameters);
  } catch (error) {
    console.error("Analytics error:", error);
  }
}

// Admin function to clear test data - now disabled (use Firebase Console instead)
async function clearTestData() {
  alert("⚠️ Direct database access disabled for security. Use Firebase Console to manage data.");
  console.log("Direct database access disabled. Use Firebase Console or create a Cloud Function for admin tasks.");
}

function trackStudentRegistration(studentData) {
  trackEvent('student_registration', {
    registration_method: 'phone_number',
    student_name: studentData.name,
    timestamp: Date.now()
  });
}

function trackGameStart(gameType) {
  trackEvent('game_start', {
    game_type: gameType,
    student_phone: currentStudent?.phone || 'unknown',
    attempt_number: (currentStudent?.attempts?.[gameType] || 0) + 1
  });
}

function trackGameComplete(gameType, success, scoreData) {
  trackEvent('game_complete', {
    game_type: gameType,
    success: success,
    score: scoreData.score || scoreData.avgTime,
    student_phone: currentStudent?.phone || 'unknown',
    completion_time: Date.now()
  });
}

function trackLeaderboardView(gameType) {
  trackEvent('leaderboard_view', {
    game_type: gameType,
    student_phone: currentStudent?.phone || 'unknown'
  });
}

function trackRecruitmentComplete() {
  trackEvent('recruitment_complete', {
    student_phone: currentStudent?.phone || 'unknown',
    student_name: currentStudent?.name || 'unknown',
    completion_time: Date.now()
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', initializeFirebase);

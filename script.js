// File: script.js

const text = `Are you ready to prove yourself? Test your skills in our exciting challenge!`;

let i = 0;
const speed = 40;
const target = document.getElementById("typewriter-text");

function typeWriter() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

window.onload = () => {
  typeWriter();
  addKeyboardSupport();
};

// Add keyboard support for all buttons and inputs
function addKeyboardSupport() {
  // Global Enter key handler
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const activeElement = document.activeElement;
      
      // If focus is on a button, click it
      if (activeElement && activeElement.tagName === 'BUTTON') {
        activeElement.click();
        return;
      }
      
      // If focus is on an input, find the associated button and click it
      if (activeElement && activeElement.tagName === 'INPUT') {
        handleInputEnter(activeElement);
        return;
      }
      
      // If no specific element is focused, handle based on current screen
      handleScreenEnter();
    }
  });
  
  // Make all buttons focusable and add visual focus indicators
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.hasAttribute('tabindex')) {
      button.setAttribute('tabindex', '0');
    }
  });
}

// Handle Enter key when input fields are focused
function handleInputEnter(inputElement) {
  const inputId = inputElement.id;
  
  switch(inputId) {
    case 'access-input':
      checkAccess();
      break;
    case 'login-name':
    case 'login-phone':
      loginStudent();
      break;
    case 'student-name':
    case 'student-phone':
      registerStudent();
      break;
    default:
      // Try to find the nearest button in the same container
      const container = inputElement.closest('.screen');
      if (container) {
        const button = container.querySelector('button:not(.secondary-btn)');
        if (button) {
          button.click();
        }
      }
      break;
  }
}

// Handle Enter key when no specific element is focused
function handleScreenEnter() {
  const currentScreen = document.querySelector('.screen:not(.hidden)');
  if (!currentScreen) return;
  
  const screenId = currentScreen.id;
  
  switch(screenId) {
    case 'screen1':
      goToScreen2();
      break;
    case 'screen2':
      checkAccess();
      break;
    case 'access-method':
      // Focus on the first option
      const firstOption = currentScreen.querySelector('.access-option');
      if (firstOption) firstOption.click();
      break;
    case 'login-screen':
      loginStudent();
      break;
    case 'student-registration':
      registerStudent();
      break;
    case 'game-selection':
      // Focus on the first game option
      const firstGame = currentScreen.querySelector('.game-option');
      if (firstGame) firstGame.click();
      break;
    default:
      // Try to find and click the primary button
      const primaryButton = currentScreen.querySelector('button:not(.secondary-btn)');
      if (primaryButton) {
        primaryButton.click();
      }
      break;
  }
}

// ===== NAVIGATION BAR FUNCTIONS =====

// Debug current state function
function debugCurrentState() {
  console.log("=== NEURAL INTERFACE DEBUG ===");
  console.log("Current Student:", currentStudent);
  
  if (currentStudent) {
    const chromaticSuccess = currentStudent.bestScores?.chromaticHunter?.score >= 7;
    const neuralSuccess = currentStudent.bestScores?.neuralReflex?.avgTime < 500;
    const requirementMet = chromaticSuccess || neuralSuccess;
    const completedProtocols = requirementMet ? 1 : 0;
    
    console.log("Chromatic Hunter Completed:", chromaticSuccess);
    console.log("Neural Reflex Completed:", neuralSuccess);
    console.log("Requirement Met (any one):", requirementMet);
    console.log("Completed Protocols Count:", completedProtocols);
    console.log("Chromatic Best Score:", currentStudent.bestScores?.chromaticHunter);
    console.log("Neural Best Score:", currentStudent.bestScores?.neuralReflex);
    
    // Check which sections should be visible
    if (requirementMet) {
      console.log("Should show: Completed User Section - Ready for Leaderboard");
    } else {
      console.log("Should show: Regular Sections (Complete a test first)");
    }
  }
  
  alert(`Debug Info:\n\nRequirement Met (any one): ${currentStudent ? 
    (currentStudent.bestScores?.chromaticHunter?.score >= 7 || currentStudent.bestScores?.neuralReflex?.avgTime < 500) : false
  }\n\nCheck console for full details.`);
}

// Global state variables
let currentStudent = null;
let currentGameData = null;

// Show/hide navigation bar
function showNavBar() {
  document.getElementById("top-navbar").classList.remove("hidden");
  updateNavStatus();
}

function hideNavBar() {
  document.getElementById("top-navbar").classList.add("hidden");
}

// Update navigation status indicator
function updateNavStatus() {
  const statusElement = document.getElementById("nav-status");
  const statusElementMobile = document.getElementById("nav-status-mobile");
  
  const updateStatus = (element) => {
    if (!element) return;
    const statusText = element.querySelector(".status-text");
    
    if (currentStudent) {
      statusText.textContent = currentStudent.name;
      element.className = "nav-status online";
    } else {
      statusText.textContent = "Offline";
      element.className = "nav-status offline";
    }
  };
  
  updateStatus(statusElement);
  updateStatus(statusElementMobile);
}

// Mobile menu functions
function toggleMobileMenu() {
  const slideMenu = document.getElementById("mobile-slide-menu");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  
  if (slideMenu.classList.contains("hidden")) {
    openMobileMenu();
  } else {
    closeMobileMenu();
  }
}

function openMobileMenu() {
  const slideMenu = document.getElementById("mobile-slide-menu");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  
  slideMenu.classList.remove("hidden");
  hamburgerBtn.classList.add("active");
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  const slideMenu = document.getElementById("mobile-slide-menu");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  
  slideMenu.classList.add("hidden");
  hamburgerBtn.classList.remove("active");
  
  // Restore body scroll
  document.body.style.overflow = "";
}

// Navigation functions
function goToProfile() {
  if (!currentStudent) {
    alert("Please register first to access your profile.");
    return;
  }
  hideAllScreens();
  showPlayerStatus();
}

function goToTraining() {
  if (!currentStudent) {
    alert("Please register first to access training protocols.");
    return;
  }
  hideAllScreens();
  document.getElementById("game-selection").classList.remove("hidden");
}

function goToLeaderboard() {
  // Allow access to leaderboard for all users
  hideAllScreens();
  viewLeaderboard();
}

// Show navigation dropdown menu
function showNavMenu() {
  const dropdown = document.getElementById("nav-dropdown");
  dropdown.classList.toggle("hidden");
  
  // Close dropdown when clicking outside
  document.addEventListener("click", function closeDropdown(e) {
    if (!e.target.closest("#nav-dropdown") && !e.target.closest(".nav-btn.secondary")) {
      dropdown.classList.add("hidden");
      document.removeEventListener("click", closeDropdown);
    }
  });
}

// Hide all screens utility function
function hideAllScreens() {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
}

// Navigation control
function goToScreen2() {
  document.getElementById("screen1").classList.add("hidden");
  document.getElementById("screen2").classList.remove("hidden");
}

// Access key check
function checkAccess() {
  const input = document.getElementById("access-input").value.toLowerCase().trim();
  const msg = document.getElementById("access-msg");
  
  const validCodes = ["shiro", "shero", "thunderbolt", "thunder bolt", "pochinki"];
  
  console.log("Access attempt:", { input: input, valid: validCodes.includes(input) });

  if (validCodes.includes(input)) {
    msg.textContent = "Access granted. Choose how you want to participate...";
    setTimeout(() => {
      document.getElementById("screen2").classList.add("hidden");
      document.getElementById("access-method").classList.remove("hidden");
    }, 1000);
  } else {
    msg.textContent = "Invalid code. Try again.";
  }
}

// Show login screen
function showLoginScreen() {
  document.getElementById("access-method").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}

// Show registration screen
function showRegistrationScreen() {
  document.getElementById("access-method").classList.add("hidden");
  document.getElementById("student-registration").classList.remove("hidden");
}

// Back to access method selection
function backToAccessMethod() {
  // Hide all screens
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("student-registration").classList.add("hidden");
  
  // Show access method selection
  document.getElementById("access-method").classList.remove("hidden");
  
  // Clear any messages
  document.getElementById("login-msg").textContent = "";
  document.getElementById("registration-msg").textContent = "";
}

// Secure student login
async function loginStudent() {
  const name = document.getElementById("login-name").value.trim();
  const phone = document.getElementById("login-phone").value.trim();
  const msg = document.getElementById("login-msg");

  // Client-side validation
  if (!name || name.length < 2) {
    msg.textContent = "Please enter your registered name";
    msg.className = "error";
    return;
  }

  if (!validatePhoneNumber(phone)) {
    msg.textContent = "Invalid phone number format";
    msg.className = "error";
    return;
  }

  msg.textContent = "Verifying neural interface...";
  msg.className = "loading";

  try {
    // Find student by phone
    const normalizedPhone = phone.replace(/\D/g, '');
    const studentDoc = await db.collection('students').doc(normalizedPhone).get();
    
    if (!studentDoc.exists) {
      msg.textContent = "❌ No neural interface found with this phone number. Please register first.";
      msg.className = "error";
      return;
    }
    
    const studentData = studentDoc.data();
    
    // Verify name matches (case-insensitive)
    if (studentData.name.toLowerCase() !== name.toLowerCase()) {
      msg.textContent = "❌ Name doesn't match our records for this phone number.";
      msg.className = "error";
      return;
    }
    
    currentStudent = { phone: normalizedPhone, ...studentData };
    msg.textContent = `✅ Welcome back, ${studentData.name}! Login successful.`;
    msg.className = "success";
    
    setTimeout(() => {
      document.getElementById("login-screen").classList.add("hidden");
      document.getElementById("game-selection").classList.remove("hidden");
      showNavBar();
    }, 1500);

  } catch (error) {
    console.error("Login error:", error);
    msg.textContent = "Neural interface connection error. Please try again.";
    msg.className = "error";
  }
}

// ===== ANALYTICS & TRACKING =====

// Track student registration
function trackStudentRegistration(studentData) {
  console.log("New student registered:", studentData.name);
  // Google Analytics or other tracking can be added here
}

// Track game start
function trackGameStart(gameType) {
  console.log("Game started:", gameType);
  // Google Analytics or other tracking can be added here
}

// Track game completion
function trackGameComplete(gameType, success, scoreData) {
  console.log("Game completed:", gameType, success ? "SUCCESS" : "FAILED", scoreData);
  // Google Analytics or other tracking can be added here
}

// Track leaderboard views
function trackLeaderboardView(viewType) {
  console.log("Leaderboard viewed:", viewType);
  // Google Analytics or other tracking can be added here
}

// Track recruitment completion
function trackRecruitmentComplete() {
  console.log("Recruitment process completed for:", currentStudent?.name);
  // Google Analytics or other tracking can be added here
}

// Debug function to check database connectivity and existing students
async function debugDatabaseStatus() {
  console.log("=== DATABASE DEBUG STATUS ===");
  
  try {
    // Test basic connectivity
    console.log("Testing Firebase connection...");
    const testRef = db.collection('test').doc('connection');
    await testRef.set({ timestamp: new Date(), test: 'connectivity' });
    console.log("✅ Firebase write test successful");
    
    // List all existing students
    console.log("Fetching all registered students...");
    const studentsSnapshot = await db.collection('students').get();
    console.log(`📊 Total students in database: ${studentsSnapshot.size}`);
    
    if (studentsSnapshot.size > 0) {
      console.log("📋 Student records:");
      studentsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`- Phone: ${doc.id}, Name: ${data.name}, Status: ${data.finalStatus || 'N/A'}`);
      });
    } else {
      console.log("📭 No student records found in database");
    }
    
    console.log("=== END DATABASE DEBUG ===");
    
  } catch (error) {
    console.error("❌ Database debug failed:", error);
  }
}

// Function to manually clear a phone number (for testing)
async function debugClearPhone(phone) {
  const normalizedPhone = phone.replace(/\D/g, '');
  console.log(`Attempting to delete student record for phone: ${normalizedPhone}`);
  
  try {
    await db.collection('students').doc(normalizedPhone).delete();
    console.log(`✅ Successfully deleted record for phone: ${normalizedPhone}`);
  } catch (error) {
    console.error(`❌ Failed to delete record for phone: ${normalizedPhone}`, error);
  }
}

// SECURITY: Monitor for suspicious activity
let securityLog = [];
function logSuspiciousActivity(activity, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    activity: activity,
    details: details,
    userAgent: navigator.userAgent,
    currentStudent: currentStudent?.phone || 'anonymous'
  };
  
  securityLog.push(logEntry);
  console.warn("🚨 SUSPICIOUS ACTIVITY:", logEntry);
  
  // Keep only last 50 entries
  if (securityLog.length > 50) {
    securityLog = securityLog.slice(-50);
  }
}

// SECURITY: This will be set up after functions are defined

// Make debug functions available globally for console access (limited)
window.debugDatabaseStatus = debugDatabaseStatus;
window.debugClearPhone = debugClearPhone;
window.getSecurityLog = () => securityLog;

// Log available debug commands
console.log("🔧 Debug commands available:");
console.log("- debugDatabaseStatus() - Check database connectivity and list all students");
console.log("- debugClearPhone('1234567890') - Delete a specific phone number record");
console.log("- debugCurrentState() - Show current application state");
console.log("- getSecurityLog() - View security activity log");

// ===== FIREBASE STUDENT MANAGEMENT =====

// Validate phone number format
function validatePhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  console.log("Phone validation:", { original: phone, cleaned: cleaned, length: cleaned.length });
  
  // Check if it's a valid length (10-15 digits)
  if (cleaned.length < 10 || cleaned.length > 15) {
    console.log("Phone validation failed: length not between 10-15 digits");
    return false;
  }
  
  // Basic phone number pattern (supports international formats)
  const phonePattern = /^[\+]?[1-9][\d]{0,3}[\s\-]?[\d]{4,14}$/;
  const result = phonePattern.test(phone);
  console.log("Phone pattern validation result:", result);
  return result;
}

// Registration rate limiting
let lastRegistrationAttempt = 0;
const REGISTRATION_COOLDOWN = 5000; // 5 seconds

// Secure student registration
async function registerStudent() {
  const now = Date.now();
  
  // Check for rate limiting
  if (now - lastRegistrationAttempt < REGISTRATION_COOLDOWN) {
    const remainingTime = Math.ceil((REGISTRATION_COOLDOWN - (now - lastRegistrationAttempt)) / 1000);
    document.getElementById("registration-msg").textContent = `⏱️ Please wait ${remainingTime} seconds before trying again.`;
    document.getElementById("registration-msg").className = "error";
    return;
  }
  
  lastRegistrationAttempt = now;
  
  const name = document.getElementById("student-name").value.trim();
  const phone = document.getElementById("student-phone").value.trim();
  const msg = document.getElementById("registration-msg");

  // Client-side validation
  if (!name || name.length < 2) {
    msg.textContent = "Please enter a valid name (minimum 2 characters)";
    msg.className = "error";
    return;
  }

  if (!validatePhoneNumber(phone)) {
    msg.textContent = "Invalid phone number. Use format: +91 9876543210";
    msg.className = "error";
    return;
  }

  msg.textContent = "Registering neural interface...";
  msg.className = "loading";

  try {
    // Check if student already exists
    const normalizedPhone = phone.replace(/\D/g, '');
    const studentQuery = await db.collection('students')
      .where('phone', '==', normalizedPhone)
      .limit(1)
      .get();

    if (!studentQuery.empty) {
      msg.textContent = "❌ This phone number is already registered. Please use the login option instead.";
      msg.className = "error";
      return;
    }

    // Create new student
    const studentData = {
      name: name,
      phone: normalizedPhone,
      registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
      attempts: {
        chromaticHunter: 0,
        neuralReflex: 0
      }
    };

    await db.collection('students').doc(normalizedPhone).set(studentData);
    
    currentStudent = { phone: normalizedPhone, ...studentData };
    msg.textContent = "Account created successfully!";
    msg.className = "success";
    
    // Track new student registration
    trackStudentRegistration(studentData);
    
    setTimeout(() => {
      document.getElementById("student-registration").classList.add("hidden");
      document.getElementById("game-selection").classList.remove("hidden");
      showNavBar();
    }, 1500);

  } catch (error) {
    console.error("Registration error:", error);
    msg.textContent = "❌ Registration failed. Please check your internet connection and try again.";
    msg.className = "error";
  }
}

// Show player status screen
function showPlayerStatus() {
  // Update navigation status
  updateNavStatus();
  
  // Basic profile info
  document.getElementById("profile-name").textContent = currentStudent.name;
  document.getElementById("profile-phone").textContent = currentStudent.phone;
  
  // Registration timestamp (if available)
  const timestamp = currentStudent.registeredAt || "Unknown";
  document.getElementById("profile-timestamp").textContent = 
    timestamp !== "Unknown" ? new Date(timestamp).toLocaleDateString() : timestamp;
  
  // Calculate progress statistics
  const chromaticAttempts = currentStudent.attempts?.chromaticHunter || 0;
  const neuralAttempts = currentStudent.attempts?.neuralReflex || 0;
  const totalAttempts = chromaticAttempts + neuralAttempts;
  
  const chromaticSuccess = currentStudent.bestScores?.chromaticHunter?.score >= 7;
  const neuralSuccess = currentStudent.bestScores?.neuralReflex?.avgTime < 500;
  const requirementMet = chromaticSuccess || neuralSuccess;
  const completedProtocols = requirementMet ? 1 : 0;
  
  // Update progress overview
  document.getElementById("total-attempts").textContent = totalAttempts;
  document.getElementById("completed-protocols").textContent = `${completedProtocols}/1`;
  
  // Update sync status
  const syncStatus = document.getElementById("sync-status");
  if (requirementMet) {
    syncStatus.textContent = "Challenge Complete";
    syncStatus.className = "stat-value complete";
  } else {
    syncStatus.textContent = "Initializing";
    syncStatus.className = "stat-value";
  }
  
  // Show completed user section if both games are done
  const completedUserSection = document.getElementById("completed-user-section");
  const regularRankingsSection = document.getElementById("regular-rankings-section");
  
  // Debug logging
  console.log("=== GAME COMPLETION DEBUG ===");
  console.log("Completed Protocols:", completedProtocols);
  console.log("Chromatic Success:", chromaticSuccess);
  console.log("Neural Success:", neuralSuccess);
  console.log("========================");
  
  if (requirementMet) {
    // User has completed everything - show completed user section
    completedUserSection.style.display = "block";
    regularRankingsSection.style.display = "none";
    console.log("Showing completed user section");
  } else {
    // User hasn't completed games yet - show regular sections
    completedUserSection.style.display = "none";
    regularRankingsSection.style.display = "block";
    console.log("Showing regular sections - games not completed yet");
  }
  
  // Update individual game data
  updateGameDetails();
  
  // Update status indicators and clickability
  updateStatusIndicators();
  updateGameClickability();
  
  document.getElementById("player-status").classList.remove("hidden");
}

// Update detailed game information
function updateGameDetails() {
  const chromaticAttempts = currentStudent.attempts?.chromaticHunter || 0;
  const neuralAttempts = currentStudent.attempts?.neuralReflex || 0;
  
  // Chromatic Hunter details
  document.getElementById("chromatic-attempts").textContent = chromaticAttempts;
  const chromaticBest = currentStudent.bestScores?.chromaticHunter;
  document.getElementById("chromatic-best").textContent = chromaticBest 
    ? `${chromaticBest.score.toFixed(1)} pts (${chromaticBest.timeRemaining}s left)${chromaticBest.timeBonus > 0 ? ` +${chromaticBest.timeBonus.toFixed(1)} bonus` : ""}`
    : "Not attempted";
  
  // Calculate chromatic success rate
  const chromaticSuccesses = chromaticBest?.score >= 7 ? 1 : 0;
  const chromaticRate = chromaticAttempts > 0 ? Math.round((chromaticSuccesses / chromaticAttempts) * 100) : 0;
  document.getElementById("chromatic-rate").textContent = `${chromaticRate}%`;
  
  // Neural Reflex details
  document.getElementById("neural-attempts").textContent = neuralAttempts;
  const neuralBest = currentStudent.bestScores?.neuralReflex;
  document.getElementById("neural-best").textContent = neuralBest 
    ? `${neuralBest.avgTime}ms avg`
    : "Not attempted";
    
  // Calculate neural success rate
  const neuralSuccesses = neuralBest?.avgTime < 500 ? 1 : 0;
  const neuralRate = neuralAttempts > 0 ? Math.round((neuralSuccesses / neuralAttempts) * 100) : 0;
  document.getElementById("neural-rate").textContent = `${neuralRate}%`;
  
  // Update status badges
  updateStatusBadges();
}

// Update status badges for each game
function updateStatusBadges() {
  const chromaticSuccess = currentStudent.bestScores?.chromaticHunter?.score >= 7;
  const neuralSuccess = currentStudent.bestScores?.neuralReflex?.avgTime < 500;
  const chromaticAttempts = currentStudent.attempts?.chromaticHunter || 0;
  const neuralAttempts = currentStudent.attempts?.neuralReflex || 0;
  const selected = currentStudent.selectedGame;
  
  // Chromatic Hunter badge
  const chromaticBadge = document.getElementById("chromatic-badge");
  if (chromaticSuccess) {
    chromaticBadge.textContent = "Completed";
    chromaticBadge.className = "status-badge success";
  } else if ((selected && selected !== 'chromaticHunter') || chromaticAttempts >= MAX_ATTEMPTS.chromaticHunter) {
    chromaticBadge.textContent = "Exhausted";
    chromaticBadge.className = "status-badge failed";
  } else {
    chromaticBadge.textContent = "Active";
    chromaticBadge.className = "status-badge ready";
  }
  
  // Neural Reflex badge
  const neuralBadge = document.getElementById("neural-badge");
  if (neuralSuccess) {
    neuralBadge.textContent = "Completed";
    neuralBadge.className = "status-badge success";
  } else if ((selected && selected !== 'neuralReflex') || neuralAttempts >= MAX_ATTEMPTS.neuralReflex) {
    neuralBadge.textContent = "Exhausted";
    neuralBadge.className = "status-badge failed";
  } else {
    neuralBadge.textContent = "Active";
    neuralBadge.className = "status-badge ready";
  }
}

// Update game box clickability based on playability
function updateGameClickability() {
  const chromaticBox = document.querySelector('.game-status[onclick*="orb-game"]');
  const neuralBox = document.querySelector('.game-status[onclick*="reaction-game"]');
  
  // Check if games can be played
  const canPlayChromatic = canPlayGame('chromaticHunter');
  const canPlayNeural = canPlayGame('neuralReflex');
  const anySuccess = (currentStudent.bestScores?.chromaticHunter?.score >= 7) ||
                     (currentStudent.bestScores?.neuralReflex?.avgTime < 500);
  
  // Update chromatic hunter box
  if (!anySuccess && canPlayChromatic) {
    chromaticBox.onclick = () => startGameFromStatus('orb-game');
    chromaticBox.style.opacity = '1';
    chromaticBox.style.cursor = 'pointer';
  } else {
    chromaticBox.onclick = null;
    chromaticBox.style.opacity = '0.6';
    chromaticBox.style.cursor = 'not-allowed';
  }
  
  // Update neural reflex box
  if (!anySuccess && canPlayNeural) {
    neuralBox.onclick = () => startGameFromStatus('reaction-game');
    neuralBox.style.opacity = '1';
    neuralBox.style.cursor = 'pointer';
  } else {
    neuralBox.onclick = null;
    neuralBox.style.opacity = '0.6';
    neuralBox.style.cursor = 'not-allowed';
  }
}

// Profile navigation functions
function editProfile() {
  const newName = prompt("Enter new operator name:", currentStudent.name);
  if (newName && newName.trim() && newName !== currentStudent.name) {
    updateStudentProfile(newName.trim());
  }
}

function logoutProfile() {
  if (confirm("Are you sure you want to exit your neural session? All progress will be saved.")) {
    // Save any pending data
    console.log("Logging out student:", currentStudent.name);
    
    // Reset global state
    currentStudent = null;
    currentGameData = null;
    
    // Hide navigation bar
    hideNavBar();
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.add('hidden');
    });
    
    // Show access method selection screen
    document.getElementById("access-method").classList.remove("hidden");
    
    // Clear forms
    document.getElementById("student-name").value = "";
    document.getElementById("student-phone").value = "";
    document.getElementById("login-name").value = "";
    document.getElementById("login-phone").value = "";
    document.getElementById("registration-msg").textContent = "";
    document.getElementById("login-msg").textContent = "";
  }
}

// Update student profile
async function updateStudentProfile(newName) {
  try {
    // Update in Firebase
    await db.collection('students').doc(currentStudent.phone).update({
      name: newName,
      lastUpdated: new Date().toISOString()
    });
    
    // Update local data
    currentStudent.name = newName;
    
    // Refresh profile display
    showPlayerStatus();
    
    alert("Profile updated successfully!");
    
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  }
}

// Update status indicators based on attempts and success
function updateStatusIndicators() {
  const chromaticAttempts = currentStudent.attempts?.chromaticHunter || 0;
  const neuralAttempts = currentStudent.attempts?.neuralReflex || 0;
  const chromaticSuccess = currentStudent.bestScores?.chromaticHunter?.score >= 7;
  const neuralSuccess = currentStudent.bestScores?.neuralReflex?.avgTime < 500;
  
  // Chromatic Hunter status
  const chromaticStatus = document.getElementById("chromatic-status");
  if (chromaticSuccess) {
    chromaticStatus.textContent = "✓ COMPLETED";
    chromaticStatus.className = "status-indicator success";
  } else if (chromaticAttempts >= MAX_ATTEMPTS.chromaticHunter) {
    chromaticStatus.textContent = "✗ EXHAUSTED";
    chromaticStatus.className = "status-indicator failed";
  } else {
    chromaticStatus.textContent = "⚡ READY";
    chromaticStatus.className = "status-indicator ready";
  }
  
  // Neural Reflex status
  const neuralStatus = document.getElementById("neural-status");
  if (neuralSuccess) {
    neuralStatus.textContent = "✓ COMPLETED";
    neuralStatus.className = "status-indicator success";
  } else if (neuralAttempts >= MAX_ATTEMPTS.neuralReflex) {
    neuralStatus.textContent = "✗ EXHAUSTED";
    neuralStatus.className = "status-indicator failed";
  } else {
    neuralStatus.textContent = "⚡ READY";
    neuralStatus.className = "status-indicator ready";
  }
}

// Proceed to games
function proceedToGames() {
  document.getElementById("player-status").classList.add("hidden");
  document.getElementById("game-selection").classList.remove("hidden");
}

// Back to status screen
function backToStatus() {
  document.getElementById("leaderboard-screen").classList.add("hidden");
  showPlayerStatus();
}

// Back to game selection screen
function backToGameSelection() {
  // Stop any active games
  if (orbGameState.isGameActive) {
    clearInterval(orbGameState.gameTimer);
    clearInterval(orbGameState.orbSpawnTimer);
    orbGameState.isGameActive = false;
  }
  
  if (reactionGameState.isGameActive) {
    clearTimeout(reactionGameState.reactionTimer);
    reactionGameState.isGameActive = false;
  }
  
  // Hide all screens and show game selection
  hideAllScreens();
  document.getElementById("game-selection").classList.remove("hidden");
}

// Check if student can play a specific game
function canPlayGame(gameType) {
  // Block all games if any success already achieved
  const anySuccess = (currentStudent.bestScores?.chromaticHunter?.score >= 7) ||
                     (currentStudent.bestScores?.neuralReflex?.avgTime < 500);
  if (anySuccess) return false;

  const attemptsForRequested = currentStudent.attempts?.[gameType] || 0;
  const withinAttempts = attemptsForRequested < MAX_ATTEMPTS[gameType];

  const selected = currentStudent.selectedGame;
  if (!selected) {
    // No selection yet, can play if within attempts
    return withinAttempts;
  }

  if (selected === gameType) {
    return withinAttempts;
  }

  // Different from selected game: only allow if selected game attempts exhausted and not passed
  const selectedAttempts = currentStudent.attempts?.[selected] || 0;
  const selectedPassed = selected === 'chromaticHunter'
    ? (currentStudent.bestScores?.chromaticHunter?.score >= 7)
    : (currentStudent.bestScores?.neuralReflex?.avgTime < 500);

  if (!selectedPassed && selectedAttempts >= MAX_ATTEMPTS[selected]) {
    return withinAttempts;
  }

  return false;
}

// Security validation functions
function validateChromaticScore(scoreData) {
  // Maximum possible score validation
  const maxPossibleScore = 15; // Conservative max (7 required + buffer)
  const maxTimeBonus = 6; // Max 30 seconds * 0.2 multiplier
  const maxBaseScore = 10; // Reasonable max base score
  
  if (scoreData.score > maxPossibleScore) {
    console.error("🚨 CHEAT DETECTED: Score too high", scoreData.score);
    return false;
  }
  
  if (scoreData.baseScore > maxBaseScore) {
    console.error("🚨 CHEAT DETECTED: Base score too high", scoreData.baseScore);
    return false;
  }
  
  if (scoreData.timeBonus > maxTimeBonus) {
    console.error("🚨 CHEAT DETECTED: Time bonus too high", scoreData.timeBonus);
    return false;
  }
  
  if (scoreData.timeRemaining > 30 || scoreData.timeRemaining < 0) {
    console.error("🚨 CHEAT DETECTED: Invalid time remaining", scoreData.timeRemaining);
    return false;
  }
  
  if (scoreData.totalTime > 30 || scoreData.totalTime < 0) {
    console.error("🚨 CHEAT DETECTED: Invalid total time", scoreData.totalTime);
    return false;
  }
  
  return true;
}

function validateNeuralScore(scoreData) {
  // Minimum human reaction time is around 100ms, max reasonable is 2000ms
  const minReactionTime = 100;
  const maxReactionTime = 2000;
  const maxPenalty = 500; // 10 wrong clicks * 50ms
  
  if (scoreData.avgTime < minReactionTime) {
    console.error("🚨 CHEAT DETECTED: Reaction time too fast", scoreData.avgTime);
    return false;
  }
  
  if (scoreData.avgTime > maxReactionTime) {
    console.error("🚨 CHEAT DETECTED: Reaction time too slow", scoreData.avgTime);
    return false;
  }
  
  if (scoreData.baseAvgTime < minReactionTime) {
    console.error("🚨 CHEAT DETECTED: Base reaction time too fast", scoreData.baseAvgTime);
    return false;
  }
  
  if (scoreData.penalty > maxPenalty) {
    console.error("🚨 CHEAT DETECTED: Penalty too high", scoreData.penalty);
    return false;
  }
  
  if (scoreData.wrongClicks > 10) {
    console.error("🚨 CHEAT DETECTED: Too many wrong clicks", scoreData.wrongClicks);
    return false;
  }
  
  if (scoreData.bestSingle < 50) {
    console.error("🚨 CHEAT DETECTED: Best single time too fast", scoreData.bestSingle);
    return false;
  }
  
  return true;
}

// Anti-cheat: Detect if game variables have been tampered with
function detectGameTampering(gameType) {
  if (gameType === 'chromaticHunter') {
    // Check if score was modified externally
    if (orbGameState.score < 0 || orbGameState.score > 15) {
      console.error("🚨 CHEAT DETECTED: Orb game score tampered");
      return false;
    }
    
    // Check if time was modified
    if (orbGameState.timeLeft < 0 || orbGameState.timeLeft > 30) {
      console.error("🚨 CHEAT DETECTED: Orb game time tampered");
      return false;
    }
    
    // SECURITY: Validate game timing
    if (orbGameState.validateGameTime && !orbGameState.validateGameTime()) {
      console.error("🚨 CHEAT DETECTED: Game time manipulation detected");
      return false;
    }
    
  } else if (gameType === 'neuralReflex') {
    // Check if reaction times are realistic
    if (reactionGameState.reactionTimes.some(time => time < 50 || time > 2000)) {
      console.error("🚨 CHEAT DETECTED: Neural game times tampered");
      return false;
    }
    
    // Check if we have the expected number of reaction times
    if (reactionGameState.reactionTimes.length !== reactionGameState.maxRounds) {
      console.error("🚨 CHEAT DETECTED: Wrong number of reaction times");
      return false;
    }
  }
  
  return true;
}

// Secure game score submission
async function saveGameAttempt(gameType, scoreData, success) {
  try {
    console.log(`Saving ${gameType} attempt:`, { scoreData, success });
    
    // SECURITY: Client-side validation (first line of defense)
    let isValid = false;
    if (gameType === 'chromaticHunter') {
      isValid = validateChromaticScore(scoreData);
    } else if (gameType === 'neuralReflex') {
      isValid = validateNeuralScore(scoreData);
    }
    
    if (!isValid) {
      console.error("🚨 CLIENT VALIDATION FAILED: Invalid score data");
      alert("⚠️ Invalid game data detected. Score not saved.");
      return;
    }
    
    // SECURITY: Detect game tampering
    if (!detectGameTampering(gameType)) {
      console.error("🚨 SECURITY VIOLATION: Game tampering detected");
      alert("⚠️ Game tampering detected. Score not saved.");
      return;
    }
    
    // Save directly to Firestore
    const attemptData = {
      studentPhone: currentStudent.phone,
      studentName: currentStudent.name,
      gameType: gameType,
      scoreData: scoreData,
      success: success,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent
    };

    // Save game attempt
    await db.collection('gameAttempts').add(attemptData);
    console.log("Game attempt saved to database");
    
    // Update student attempts count
    const attemptCount = (currentStudent.attempts[gameType] || 0) + 1;
    currentStudent.attempts[gameType] = attemptCount;
    
    await db.collection('students').doc(currentStudent.phone).update({
      [`attempts.${gameType}`]: attemptCount
    });
    console.log("Student attempts updated in database");
    
    // Always save the score to bestScores for progress tracking
    if (!currentStudent.bestScores) {
      currentStudent.bestScores = {};
    }
    currentStudent.bestScores[gameType] = scoreData;
    console.log(`Saved ${gameType} score locally:`, scoreData);
    console.log("Updated currentStudent.bestScores:", currentStudent.bestScores);
    
    // Also save bestScores to database
    await db.collection('students').doc(currentStudent.phone).update({
      [`bestScores.${gameType}`]: scoreData
    });
    console.log("Best scores updated in database");
    
    if (success) {
      // Save to leaderboard only if successful
      const leaderboardEntry = {
        name: currentStudent.name,
        phone: currentStudent.phone,
        score: gameType === 'chromaticHunter' ? scoreData.score : scoreData.avgTime,
        scoreData: scoreData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('leaderboards').doc(gameType).collection('scores').doc(currentStudent.phone).set(leaderboardEntry);
      console.log(`SUCCESS! Score saved to leaderboard`);
    } else {
      console.log(`Game completed but not successful - score saved for progress tracking`);
      if (gameType === 'chromaticHunter') {
        console.log(`Chromatic Hunter: scored ${scoreData.score}/7`);
      } else {
        console.log(`Neural Reflex: avg time ${scoreData.avgTime}ms (need < 500ms)`);
      }
    }

  } catch (error) {
    console.error("Error saving game attempt:", error);
    console.error("Error details:", error.message, error.stack);
    alert(`❌ Failed to save score: ${error.message}. Please try again.`);
  }
}

// Enhanced security logging with backend reporting
async function logSuspiciousActivity(activity, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    activity: activity,
    details: details,
    userAgent: navigator.userAgent,
    currentStudent: currentStudent?.phone || 'anonymous'
  };
  
  securityLog.push(logEntry);
  console.warn("🚨 SUSPICIOUS ACTIVITY:", logEntry);
  
  // Security violations logged locally (no backend reporting on free plan)
  console.warn("Security violation logged locally:", logEntry);
  
  // Keep only last 50 entries
  if (securityLog.length > 50) {
    securityLog = securityLog.slice(-50);
  }
}

// Game Selection
async function selectGame(gameType) {
  const gameTypeName = gameType === 'orb-game' ? 'chromaticHunter' : 'neuralReflex';
  
  // Check if student can play this game
  if (!canPlayGame(gameTypeName)) {
    const attempts = currentStudent.attempts?.[gameTypeName] || 0;
    const maxAttempts = MAX_ATTEMPTS[gameTypeName];
    
    alert(`Neural pathway blocked. You have used all ${maxAttempts} attempts for this protocol.`);
    return;
  }
  
  // Lock selection on first pick
  try {
    if (!currentStudent.selectedGame) {
      await db.collection('students').doc(currentStudent.phone).update({ selectedGame: gameTypeName });
      currentStudent.selectedGame = gameTypeName;
    }
  } catch (e) {
    console.warn('Failed to persist selectedGame; continuing locally', e);
    if (!currentStudent.selectedGame) currentStudent.selectedGame = gameTypeName;
  }

  // Store current game type for scoring
  currentGameData = { type: gameTypeName };
  
  // Track game start
  trackGameStart(gameTypeName);
  
  document.getElementById("game-selection").classList.add("hidden");
  
  if (gameType === 'orb-game') {
    startOrbGame();
  } else if (gameType === 'reaction-game') {
    startReactionGame();
  }
}

// Start game directly from status screen - now redirects to game selection for cleaner flow
function startGameFromStatus(gameType) {
  const gameTypeName = gameType === 'orb-game' ? 'chromaticHunter' : 'neuralReflex';
  
  // Check if student can play this game
  if (!canPlayGame(gameTypeName)) {
    const attempts = currentStudent.attempts?.[gameTypeName] || 0;
    const maxAttempts = MAX_ATTEMPTS[gameTypeName];
    
    alert(`Neural pathway blocked. You have used all ${maxAttempts} attempts for this protocol.`);
    return;
  }
  
  // Instead of starting game directly, go to game selection screen
  // This creates a cleaner, more streamlined flow
  hideAllScreens();
  document.getElementById("game-selection").classList.remove("hidden");
  
  // Optional: Pre-highlight the game they clicked on
  highlightGameOption(gameType);
}

// Highlight the selected game option in game selection screen
function highlightGameOption(gameType) {
  // Remove any existing highlights
  document.querySelectorAll('.game-option').forEach(option => {
    option.classList.remove('highlighted');
  });
  
  // Add highlight to the selected game
  setTimeout(() => {
    const gameOptions = document.querySelectorAll('.game-option');
    if (gameType === 'orb-game' && gameOptions[0]) {
      gameOptions[0].classList.add('highlighted');
    } else if (gameType === 'reaction-game' && gameOptions[1]) {
      gameOptions[1].classList.add('highlighted');
    }
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      document.querySelectorAll('.game-option').forEach(option => {
        option.classList.remove('highlighted');
      });
    }, 3000);
  }, 100);
}



// Debug function to check all game attempts
async function debugAllAttempts() {
  try {
    console.log("=== ALL GAME ATTEMPTS ===");
    const attempts = await db.collection('gameAttempts').get();
    attempts.forEach(doc => {
      const data = doc.data();
      console.log(`${data.gameType} - ${data.name} (${data.phone}):`, data);
    });
    console.log("=========================");
  } catch (error) {
    console.error("Error fetching attempts:", error);
  }
}

// SECURITY: Protected game state with validation
function createSecureGameState() {
  let _score = 0;
  let _timeLeft = 30;
  let _gameStartTime = 0;
  let _lastScoreUpdate = 0;
  
  return {
    get score() { return _score; },
    set score(value) {
      // Anti-cheat: Validate score changes
      if (value < 0 || value > 15 || (value - _score) > 1.5) {
        console.error("🚨 CHEAT DETECTED: Invalid score change", { old: _score, new: value });
        return;
      }
      _score = value;
      _lastScoreUpdate = performance.now();
    },
    
    get timeLeft() { return _timeLeft; },
    set timeLeft(value) {
      // Anti-cheat: Validate time changes
      if (value < 0 || value > 30) {
        console.error("🚨 CHEAT DETECTED: Invalid time change", { old: _timeLeft, new: value });
        return;
      }
      _timeLeft = value;
    },
    
    // Expose other properties normally
    targetColor: '',
    gameTimer: null,
    orbSpawnTimer: null,
    isGameActive: false,
    requiredScore: 7,
    orbSpeed: 1200,
    lastTargetSpawn: 0,
    orbsSpawned: 0,
    
    // Security methods
    validateGameTime() {
      const expectedTime = Math.max(0, 30 - Math.floor((performance.now() - _gameStartTime) / 1000));
      return Math.abs(_timeLeft - expectedTime) <= 2; // Allow 2 second tolerance
    },
    
    startGame() {
      _gameStartTime = performance.now();
      _score = 0;
      _timeLeft = 30;
    },
    
    colors: [
      { name: 'RED', class: 'red', color: '#ff0000' },
      { name: 'BLUE', class: 'blue', color: '#0066ff' },
      { name: 'GREEN', class: 'green', color: '#00cc00' },
      { name: 'YELLOW', class: 'yellow', color: '#ffcc00' },
      { name: 'ORANGE', class: 'orange', color: '#ff6600' },
      { name: 'PURPLE', class: 'purple', color: '#9900cc' }
    ]
  };
}

// Mini Game Logic - Updated Orb Game with Security
let orbGameState = createSecureGameState();

function startOrbGame() {
  document.getElementById("orb-game-screen").classList.remove("hidden");
  
  // Show game instructions first
  const gameArea = document.getElementById("orb-game-area");
  gameArea.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; text-align: center; padding: 1rem; width: 100%; box-sizing: border-box;">
      <h3 style="color: #00ffcc; margin-bottom: 1rem; font-size: 1.2rem;">How to Play COLOR HUNTER</h3>
      <div style="background: rgba(0,255,204,0.1); padding: 1rem; border-radius: 10px; border: 1px solid #00ffcc; max-width: 90%; width: 100%; margin-bottom: 1rem;">
        <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.4;">🎯 <strong>Goal:</strong> Click on colored circles that match the target color shown at the top</p>
        <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.4;">⏱️ <strong>Time:</strong> You have 30 seconds</p>
        <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.4;">🏆 <strong>To Pass:</strong> Score 7.0 points or more</p>
        <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.4;">⚠️ <strong>Penalty:</strong> Wrong clicks cost -0.5 points!</p>
      </div>
      <button onclick="actuallyStartOrbGame()" style="padding: 15px 30px; background: #00ffcc; color: #000; border: 2px solid #00ffcc; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.1rem; min-height: 50px; width: auto; min-width: 150px; transition: all 0.3s ease; box-shadow: 0 4px 8px rgba(0,255,204,0.3);" onmouseover="this.style.background='#00e6b8'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#00ffcc'; this.style.transform='translateY(0)'">START GAME</button>
    </div>
  `;
}

function actuallyStartOrbGame() {
  // SECURITY: Reset game state securely
  orbGameState.startGame(); // Use secure method
  orbGameState.isGameActive = true;
  orbGameState.orbSpeed = 1200;
  orbGameState.lastTargetSpawn = 0;
  orbGameState.orbsSpawned = 0;
  
  // Clear instructions and recreate the game container
  const gameArea = document.getElementById("orb-game-area");
  gameArea.innerHTML = '<div id="orb-container" style="position: relative; width: 100%; height: 100%; min-height: 300px;"></div>';
  
  // Small delay to ensure container is properly rendered
  setTimeout(() => {
    updateOrbGameDisplay();
    setNewTargetColor();
    startOrbGameTimer();
    startOrbSpawning();
  }, 100);
}

function updateOrbGameDisplay() {
  document.getElementById("orb-score").textContent = orbGameState.score.toFixed(1);
  document.getElementById("orb-timer").textContent = orbGameState.timeLeft;
}

function setNewTargetColor() {
  const randomColor = orbGameState.colors[Math.floor(Math.random() * orbGameState.colors.length)];
  orbGameState.targetColor = randomColor.class;
  const targetElement = document.getElementById("target-color");
  targetElement.textContent = randomColor.name;
  targetElement.style.color = randomColor.color;
}

function startOrbGameTimer() {
  orbGameState.gameTimer = setInterval(() => {
    // Check if game should end before decrementing
    if (orbGameState.timeLeft <= 0) {
      endOrbGame(false);
      return;
    }
    
    orbGameState.timeLeft--;
    updateOrbGameDisplay();
    
    // Double-check after decrementing
    if (orbGameState.timeLeft <= 0) {
      endOrbGame(false);
    }
  }, 1000);
}

function startOrbSpawning() {
  spawnOrb(); // Spawn first orb immediately
  orbGameState.orbSpawnTimer = setInterval(() => {
    if (orbGameState.isGameActive) {
      spawnOrb();
    }
  }, orbGameState.orbSpeed);
}

function spawnOrb() {
  const container = document.getElementById("orb-container");
  const gameArea = document.getElementById("orb-game-area");
  const orb = document.createElement("div");
  
  orbGameState.orbsSpawned++;
  
  // Smart color distribution - ensure target color appears regularly
  let isTargetColor = false;
  const orbsSinceLastTarget = orbGameState.orbsSpawned - orbGameState.lastTargetSpawn;
  
  // Force target color if it hasn't appeared in the last 4 orbs
  if (orbsSinceLastTarget >= 4) {
    isTargetColor = true;
  } else {
    // Otherwise, 40% chance for target color (increased from 30%)
    isTargetColor = Math.random() < 0.4;
  }
  
  let colorClass;
  
  if (isTargetColor) {
    colorClass = orbGameState.targetColor;
    orbGameState.lastTargetSpawn = orbGameState.orbsSpawned;
  } else {
    const otherColors = orbGameState.colors.filter(c => c.class !== orbGameState.targetColor);
    colorClass = otherColors[Math.floor(Math.random() * otherColors.length)].class;
  }
  
  orb.className = `orb ${colorClass}`;
  
  // Random position within container
  const containerWidth = container.offsetWidth || 500; // fallback width
  const containerHeight = container.offsetHeight || 300; // fallback height
  const maxX = Math.max(containerWidth - 60, 60);
  const maxY = Math.max(containerHeight - 60, 60);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  
  orb.style.left = x + "px";
  orb.style.top = y + "px";
  
  // Add physics movement
  addOrbPhysics(orb);
  
  // Click handler
  orb.addEventListener("click", () => handleOrbClick(orb, colorClass));
  
  container.appendChild(orb);
  
  // Auto-remove orb - faster disappearance as score increases
  const baseTime = 3000;
  let speedReduction;
  
  if (orbGameState.score >= 3) {
    // Aggressive reduction after 3 points - orbs disappear very quickly
    const basReduction = 3 * 200; // First 3 points: 600ms reduction
    const aggressiveReduction = (orbGameState.score - 3) * 400; // Each point after 3: 400ms more reduction
    speedReduction = basReduction + aggressiveReduction;
  } else {
    // Normal reduction for first 3 points
    speedReduction = orbGameState.score * 200; // Reduce by 200ms per point
  }
  
  const orbLifetime = Math.max(500, baseTime - speedReduction); // Minimum 0.5 seconds (very fast!)
  
  setTimeout(() => {
    if (orb.parentNode) {
      orb.remove();
    }
  }, orbLifetime);
}

function addOrbPhysics(orb) {
  // Increase orb movement speed dramatically after 3 points
  let velocityMultiplier = 3; // Base velocity
  if (orbGameState.score >= 3) {
    velocityMultiplier = 3 + (orbGameState.score - 2) * 1.5; // Much faster movement after 3 points
  }
  
  let vx = (Math.random() - 0.5) * velocityMultiplier; // Dynamic velocity based on score
  let vy = (Math.random() - 0.5) * velocityMultiplier;
  let x = parseFloat(orb.style.left);
  let y = parseFloat(orb.style.top);
  
  const gameArea = document.getElementById("orb-game-area");
  const maxX = gameArea.offsetWidth - 60;
  const maxY = gameArea.offsetHeight - 60;
  
  function animate() {
    if (!orb.parentNode || !orbGameState.isGameActive) return;
    
    x += vx;
    y += vy;
    
    // Bounce off walls
    if (x <= 0 || x >= maxX) {
      vx = -vx;
      x = Math.max(0, Math.min(maxX, x));
    }
    if (y <= 0 || y >= maxY) {
      vy = -vy;
      y = Math.max(0, Math.min(maxY, y));
    }
    
    orb.style.left = x + "px";
    orb.style.top = y + "px";
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

function handleOrbClick(orb, colorClass) {
  if (!orbGameState.isGameActive) return;
  
  orb.classList.add("clicked");
  
  if (colorClass === orbGameState.targetColor) {
    // Correct click
    orbGameState.score++;
    orb.classList.add("correct");
    showOrbGameMessage("Perfect shot! +" + 1, "game-success");
    
    // Increase difficulty progressively after 3 points
    if (orbGameState.score >= 3) {
      // Aggressive difficulty scaling after 3 points
      const difficultyMultiplier = orbGameState.score - 2; // 1x at score 3, 2x at score 4, etc.
      const newSpeed = Math.max(300, 1200 - (difficultyMultiplier * 200)); // Much faster spawning
      
      if (newSpeed !== orbGameState.orbSpeed) {
        orbGameState.orbSpeed = newSpeed;
        clearInterval(orbGameState.orbSpawnTimer);
        startOrbSpawning();
      }
    } else if (orbGameState.score % 2 === 0 && orbGameState.orbSpeed > 600) {
      // Normal difficulty scaling for first 3 points
      orbGameState.orbSpeed -= 150;
      clearInterval(orbGameState.orbSpawnTimer);
      startOrbSpawning();
    }
    
    // Reset tracking for new target color
    orbGameState.lastTargetSpawn = 0;
    orbGameState.orbsSpawned = 0;
    setNewTargetColor();
    
    // Removed: Game no longer ends at required score, continues until timer runs out
    // Players can now achieve higher scores with time bonuses
  } else {
    // Wrong click - apply penalty
    orbGameState.score = Math.max(0, orbGameState.score - 0.5);
    orb.classList.add("wrong");
    showOrbGameMessage("Wrong target! -0.5 points", "game-fail");
  }
  
  updateOrbGameDisplay();
  
  setTimeout(() => {
    if (orb.parentNode) {
      orb.remove();
    }
  }, 600);
}

function showOrbGameMessage(message, className) {
  const msgElement = document.getElementById("orb-game-message");
  msgElement.textContent = message;
  msgElement.className = className;
  
  setTimeout(() => {
    msgElement.textContent = "";
    msgElement.className = "";
  }, 2000);
}

// SECURITY: Protected endOrbGame function
function endOrbGame(success) {
  // SECURITY: Additional validation before ending game
  if (!orbGameState.isGameActive) {
    logSuspiciousActivity("GAME_END_MANIPULATION", "Attempted to end inactive game");
    return;
  }
  
  orbGameState.isGameActive = false;
  clearInterval(orbGameState.gameTimer);
  clearInterval(orbGameState.orbSpawnTimer);
  
  // Clear all orbs
  document.getElementById("orb-container").innerHTML = "";
  
  // SECURITY: Validate final game state
  if (orbGameState.score < 0 || orbGameState.score > 15) {
    logSuspiciousActivity("SCORE_MANIPULATION", `Invalid final score: ${orbGameState.score}`);
    alert("⚠️ Invalid game state detected. Game not saved.");
    return;
  }
  
  // Calculate time-based bonus scoring
  const baseScore = orbGameState.score;
  const timeRemaining = parseFloat(orbGameState.timeLeft.toFixed(1));
  const totalTime = 30 - orbGameState.timeLeft;
  
  // SECURITY: Validate time calculations
  if (timeRemaining < 0 || timeRemaining > 30 || totalTime < 0 || totalTime > 30) {
    logSuspiciousActivity("TIME_MANIPULATION", `Invalid time values: remaining=${timeRemaining}, total=${totalTime}`);
    alert("⚠️ Invalid timing detected. Game not saved.");
    return;
  }
  
  // Time bonus calculation - reward faster completion
  let timeBonus = 0;
  if (success && baseScore >= 7) {
    // Speed completion bonuses
    if (totalTime <= 15) timeBonus += 2.0;      // Completed in 15 seconds or less: +2.0 points
    else if (totalTime <= 20) timeBonus += 1.5; // Completed in 20 seconds or less: +1.5 points  
    else if (totalTime <= 25) timeBonus += 1.0; // Completed in 25 seconds or less: +1.0 points
    else if (totalTime <= 28) timeBonus += 0.5; // Completed in 28 seconds or less: +0.5 points
    
    // Additional bonus for remaining time (0.1 points per second remaining)
    timeBonus += timeRemaining * 0.1;
  }
  
  const finalScore = baseScore + timeBonus;
  
  // Prepare score data
  const scoreData = {
    score: parseFloat(finalScore.toFixed(1)),
    baseScore: baseScore,
    timeBonus: parseFloat(timeBonus.toFixed(1)),
    timeRemaining: timeRemaining,
    totalTime: totalTime
  };
  
  // Save attempt to Firebase and wait for completion
  saveGameAttempt('chromaticHunter', scoreData, success).then(() => {
    // Track game completion
    trackGameComplete('chromaticHunter', success, scoreData);
    
    if (success) {
      const bonusText = timeBonus > 0 ? ` (+${timeBonus.toFixed(1)} time bonus!)` : "";
      showOrbGameMessage(`Great job! Final Score: ${finalScore.toFixed(1)}${bonusText}`, "game-success");
      setTimeout(() => {
        document.getElementById("orb-game-screen").classList.add("hidden");
        checkBothGamesCompletion();
      }, 3000); // Increased to 3000ms to show the bonus message longer
    } else {
      showOrbGameMessage(`Time's up! Final Score: ${finalScore.toFixed(1)}`, "game-fail");
      setTimeout(() => {
        document.getElementById("orb-game-screen").classList.add("hidden");
        checkBothGamesCompletion();
      }, 3000);
    }
  }).catch(error => {
    console.error('Error saving game attempt:', error);
    // Still proceed with UI updates even if save failed
    if (success) {
      const bonusText = timeBonus > 0 ? ` (+${timeBonus.toFixed(1)} time bonus!)` : "";
      showOrbGameMessage(`Great job! Final Score: ${finalScore.toFixed(1)}${bonusText}`, "game-success");
    } else {
      showOrbGameMessage(`Time's up! Final Score: ${finalScore.toFixed(1)}`, "game-fail");
    }
    setTimeout(() => {
      document.getElementById("orb-game-screen").classList.add("hidden");
      checkBothGamesCompletion();
    }, 3000);
  });
}

// Reaction Time Game Logic
let reactionGameState = {
  round: 1,
  maxRounds: 5,
  reactionTimes: [],
  currentStartTime: 0,
  waitTimeout: null,
  isWaiting: false,
  isReady: false,
  gameActive: false,
  wrongClicks: 0 // Track penalty clicks
};

function startReactionGame() {
  document.getElementById("reaction-game-screen").classList.remove("hidden");
  
  // Show game instructions first
  const reactionArea = document.getElementById("reaction-area");
  reactionArea.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; text-align: center; padding: 1rem; width: 100%; box-sizing: border-box;">
      <h3 style="color: #00ffcc; margin-bottom: 1rem; font-size: 1.2rem;">How to Play QUICK CLICK</h3>
      <div style="background: rgba(0,255,204,0.1); padding: 1rem; border-radius: 10px; border: 1px solid #00ffcc; max-width: 90%; width: 100%; margin-bottom: 1rem;">
        <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.4;">🎯 <strong>Goal:</strong> Click as fast as possible when the signal turns GREEN</p>
        <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.4;">⏱️ <strong>Rounds:</strong> 5 rounds total</p>
        <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.4;">🏆 <strong>To Pass:</strong> Average reaction time under 500ms</p>
        <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.4;">⚠️ <strong>Penalty:</strong> Each early click adds +50ms to your final average!</p>
      </div>
      <button onclick="actuallyStartReactionGame()" style="padding: 15px 30px; background: #00ffcc; color: #000; border: 2px solid #00ffcc; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.1rem; min-height: 50px; width: auto; min-width: 150px; transition: all 0.3s ease; box-shadow: 0 4px 8px rgba(0,255,204,0.3);" onmouseover="this.style.background='#00e6b8'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#00ffcc'; this.style.transform='translateY(0)'">START GAME</button>
    </div>
  `;
}

function actuallyStartReactionGame() {
  // Reset game state
  reactionGameState.round = 1;
  reactionGameState.reactionTimes = [];
  reactionGameState.gameActive = true;
  reactionGameState.wrongClicks = 0;
  
  // Clear instructions and recreate the reaction target
  const reactionArea = document.getElementById("reaction-area");
  reactionArea.innerHTML = '<div id="reaction-target">WAIT...</div>';
  
  // Remove any existing click handlers
  reactionArea.onclick = null;
  
  updateReactionDisplay();
  startReactionRound();
}

function updateReactionDisplay() {
  document.getElementById("reaction-round").textContent = reactionGameState.round;
  const avgTime = reactionGameState.reactionTimes.length > 0 
    ? Math.round(reactionGameState.reactionTimes.reduce((a, b) => a + b, 0) / reactionGameState.reactionTimes.length)
    : "---";
  document.getElementById("avg-time").textContent = avgTime;
}

function startReactionRound() {
  const target = document.getElementById("reaction-target");
  const area = document.getElementById("reaction-area");
  
  // Reset states
  target.className = "waiting";
  target.textContent = "WAIT...";
  reactionGameState.isWaiting = true;
  reactionGameState.isReady = false;
  
  showReactionMessage(`Round ${reactionGameState.round}/5 - Wait for GREEN signal!`, "");
  
  // Random wait time between 2-6 seconds
  const waitTime = 2000 + Math.random() * 4000;
  
  reactionGameState.waitTimeout = setTimeout(() => {
    if (reactionGameState.gameActive) {
      target.className = "ready";
      target.textContent = "CLICK NOW!";
      reactionGameState.isWaiting = false;
      reactionGameState.isReady = true;
      reactionGameState.currentStartTime = performance.now();
    }
  }, waitTime);
  
  // Add click handler after a small delay to prevent start button click from being caught
  setTimeout(() => {
    if (reactionGameState.gameActive) {
      area.onclick = handleReactionClick;
    }
  }, 500); // 500ms delay to allow user to release mouse after clicking START
}

function handleReactionClick() {
  if (!reactionGameState.gameActive) return;
  
  const target = document.getElementById("reaction-target");
  const area = document.getElementById("reaction-area");
  
  if (reactionGameState.isWaiting) {
    // Clicked too early - apply penalty
    reactionGameState.wrongClicks++;
    clearTimeout(reactionGameState.waitTimeout);
    target.className = "too-early";
    target.textContent = "TOO EARLY!";
    showReactionMessage(`You clicked too early! Penalty: +50ms to average (${reactionGameState.wrongClicks} wrong clicks)`, "game-fail");
    
    // Remove click handler to prevent multiple penalties
    area.onclick = null;
    
    setTimeout(() => {
      if (reactionGameState.gameActive) {
        startReactionRound(); // Retry same round (don't increment)
      }
    }, 2000);
    
  } else if (reactionGameState.isReady) {
    // Correct timing
    const reactionTime = performance.now() - reactionGameState.currentStartTime;
    reactionGameState.reactionTimes.push(reactionTime);
    
    target.className = "clicked";
    target.textContent = Math.round(reactionTime) + "ms";
    
    let message = "";
    if (reactionTime < 200) {
      message = "Lightning fast! Exceptional reflexes.";
    } else if (reactionTime < 300) {
      message = "Excellent reaction time!";
    } else if (reactionTime < 400) {
      message = "Good reflexes!";
    } else {
      message = "Neural pathways need calibration...";
    }
    
    showReactionMessage(message, "game-success");
    
    updateReactionDisplay();
    
    if (reactionGameState.round >= reactionGameState.maxRounds) {
      setTimeout(() => endReactionGame(), 2000);
    } else {
      reactionGameState.round++;
      setTimeout(() => {
        if (reactionGameState.gameActive) {
          startReactionRound();
        }
      }, 2500);
    }
  }
  
  area.onclick = null; // Remove click handler
}

function showReactionMessage(message, className) {
  const msgElement = document.getElementById("reaction-message");
  msgElement.textContent = message;
  msgElement.className = className;
  
  setTimeout(() => {
    if (msgElement.textContent === message) {
      msgElement.textContent = "";
      msgElement.className = "";
    }
  }, 3000);
}

function endReactionGame() {
  reactionGameState.gameActive = false;
  clearTimeout(reactionGameState.waitTimeout);
  
  const baseAvgTime = Math.round(reactionGameState.reactionTimes.reduce((a, b) => a + b, 0) / reactionGameState.reactionTimes.length);
  const penalty = reactionGameState.wrongClicks * 50; // 50ms penalty per wrong click
  const avgTime = baseAvgTime + penalty;
  const bestTime = Math.min(...reactionGameState.reactionTimes);
  const success = avgTime < 500;
  
  // Prepare score data
  const scoreData = {
    avgTime: avgTime,
    baseAvgTime: baseAvgTime,
    penalty: penalty,
    wrongClicks: reactionGameState.wrongClicks,
    bestSingle: Math.round(bestTime),
    allTimes: reactionGameState.reactionTimes.map(t => Math.round(t))
  };
  
  // Save attempt to Firebase
  saveGameAttempt('neuralReflex', scoreData, success);
  
  // Track game completion
  trackGameComplete('neuralReflex', success, scoreData);
  
  let finalMessage = "";
  if (avgTime < 250) {
    finalMessage = `Amazing! Lightning fast reflexes! (${baseAvgTime}ms + ${penalty}ms penalty)`;
  } else if (avgTime < 500) {
    finalMessage = `Great job! You passed the game! (${baseAvgTime}ms + ${penalty}ms penalty)`;
  } else {
    finalMessage = `Too slow. Try again or pick another game. (${baseAvgTime}ms + ${penalty}ms penalty)`;
  }
  
  showReactionMessage(finalMessage, success ? "game-success" : "game-fail");
  
  setTimeout(() => {
    document.getElementById("reaction-game-screen").classList.add("hidden");
    if (success) {
      checkBothGamesCompletion();
    } else {
      showPlayerStatus(); // Return to status instead of game selection
    }
  }, 3000);
}

// ===== SCORE SUBMISSION & LEADERBOARD =====

// Check if both games are completed and show leaderboard
function checkBothGamesCompletion() {
  console.log("Checking game completion...");
  console.log("Current student:", currentStudent);
  console.log("Best scores:", currentStudent.bestScores);
  
  // Check if both games are completed successfully
  const chromaticScore = currentStudent.bestScores?.chromaticHunter?.score;
  const neuralTime = currentStudent.bestScores?.neuralReflex?.avgTime;
  
  console.log("Chromatic score:", chromaticScore);
  console.log("Neural time:", neuralTime);
  
  const chromaticSuccess = chromaticScore >= 7;
  const neuralSuccess = neuralTime < 500;
  const requirementMet = chromaticSuccess || neuralSuccess;
  
  console.log("Chromatic success:", chromaticSuccess);
  console.log("Neural success:", neuralSuccess);
  console.log("Requirement met:", requirementMet);
  
  if (requirementMet) {
    console.log("Showing completion leaderboard...");
    // Requirement met (either game) - show leaderboard with completion message
    showCompletionLeaderboard();
  } else {
    console.log("Returning to player status...");
    // Return to status to see progress
    showPlayerStatus();
  }
}

// Show leaderboard with completion message and final page access
async function showCompletionLeaderboard() {
  // Track leaderboard view
  trackLeaderboardView('completion');
  
  document.getElementById("player-status").classList.add("hidden");
  
  // Load and display leaderboard
  await loadLeaderboardData();
  
  // Add completion message and final page button
  addCompletionMessage();
  
  document.getElementById("leaderboard-screen").classList.remove("hidden");
}

// Add completion message to leaderboard
function addCompletionMessage() {
  const leaderboardContainer = document.getElementById("leaderboard-screen");
  
  // Remove existing completion message if any
  const existingMsg = document.getElementById("completion-message");
  if (existingMsg) {
    existingMsg.remove();
  }
  
  // Create completion message
  const completionDiv = document.createElement("div");
  completionDiv.id = "completion-message";
  completionDiv.innerHTML = `
    <div style="background: linear-gradient(45deg, #00ff00, #00ccff); padding: 1rem; margin: 1rem 0; border-radius: 10px; text-align: center;">
      <h3 style="color: #000; margin: 0 0 0.5rem 0;">🎉 CHALLENGE COMPLETE! 🎉</h3>
      <p style="color: #000; margin: 0 0 1.5rem 0;">You completed the challenge! Check your ranking below!</p>
      <div style="display: flex; justify-content: center;">
        <button onclick="proceedToFinalPage()" style="background: #000; color: #00ff00; border: 3px solid #00ff00; padding: 1.2rem 2.5rem; border-radius: 12px; cursor: pointer; font-weight: bold; font-size: 1.2rem; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);" onmouseover="this.style.background='#00ff00'; this.style.color='#000'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 255, 0, 0.5)'" onmouseout="this.style.background='#000'; this.style.color='#00ff00'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 255, 0, 0.3)'">🏆 Proceed to Final Page</button>
      </div>
    </div>
  `;
  
  // Insert at the top of leaderboard screen
  leaderboardContainer.insertBefore(completionDiv, leaderboardContainer.firstChild);
}

// Proceed to the final page
function proceedToFinalPage() {
  // Update student status in Firebase
  if (currentStudent) {
    db.collection('students').doc(currentStudent.phone).update({
      finalStatus: "completed",
      completedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  
  document.getElementById("leaderboard-screen").classList.add("hidden");
  document.getElementById("final-screen").classList.remove("hidden");
}

// Share results function
function shareResults() {
  if (!currentStudent) {
    alert("No results to share! Please complete the training first.");
    return;
  }

  const chromaticScore = currentStudent.bestScores?.chromaticHunter?.score || 0;
  const neuralTime = currentStudent.bestScores?.neuralReflex?.avgTime || 0;
  const chromaticSuccess = chromaticScore >= 7;
  const neuralSuccess = neuralTime < 500;

  // Generate share text
  const shareText = `🧠 I just completed the IOTRONICS Neural Recruitment Challenge! 

🎯 Chromatic Hunter: ${chromaticScore}/7 ${chromaticSuccess ? '✅' : '❌'}
⚡ Neural Reflex: ${neuralTime}ms ${neuralSuccess ? '✅' : '❌'}
${chromaticSuccess && neuralSuccess ? '🏆 FULL NEURAL SYNC ACHIEVED!' : '💪 Training in progress...'}

Think you can beat my score? Try the challenge: ${window.location.href}

#IOTRONICS #NeuralChallenge #TechRecruitment`;

  // Try to use native sharing if available
  if (navigator.share) {
    navigator.share({
      title: 'IOTRONICS Neural Challenge Results',
      text: shareText,
      url: window.location.href
    }).then(() => {
      console.log('Results shared successfully');
      trackEvent('result_shared', {
        method: 'native',
        completed_both: chromaticSuccess && neuralSuccess
      });
    }).catch((error) => {
      console.log('Native sharing failed, falling back to clipboard');
      fallbackShare(shareText);
    });
  } else {
    // Fallback to clipboard/manual sharing
    fallbackShare(shareText);
  }
}

// Fallback sharing method
function fallbackShare(shareText) {
  // Try to copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      showShareModal(shareText, true);
    }).catch(() => {
      showShareModal(shareText, false);
    });
  } else {
    showShareModal(shareText, false);
  }
}

// Show share modal with options
function showShareModal(shareText, copiedToClipboard) {
  const modal = document.createElement('div');
  modal.id = 'share-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #001122, #003344);
    border: 2px solid #00ff00;
    border-radius: 15px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    text-align: center;
    color: #00ff00;
  `;

  modalContent.innerHTML = `
    <h3 style="color: #00ff00; margin-bottom: 1rem;">🚀 Share Your Results</h3>
    ${copiedToClipboard ? '<p style="color: #00ccff; margin-bottom: 1rem;">✅ Copied to clipboard!</p>' : ''}
    <textarea readonly style="width: 100%; height: 150px; background: #000; color: #00ff00; border: 1px solid #00ff00; border-radius: 5px; padding: 0.5rem; font-family: monospace; font-size: 12px; margin-bottom: 1rem;">${shareText}</textarea>
    <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
      <button onclick="shareToTwitter('${encodeURIComponent(shareText)}')" style="background: #1DA1F2; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Twitter</button>
      <button onclick="shareToLinkedIn('${encodeURIComponent(shareText)}')" style="background: #0077B5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">LinkedIn</button>
      <button onclick="shareToWhatsApp('${encodeURIComponent(shareText)}')" style="background: #25D366; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">WhatsApp</button>
      <button onclick="copyToClipboard('${encodeURIComponent(shareText)}')" style="background: #333; color: #00ff00; border: 1px solid #00ff00; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Copy</button>
    </div>
    <button onclick="closeShareModal()" style="background: #ff3333; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; margin-top: 1rem;">Close</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Track share modal view
  trackEvent('share_modal_opened', {
    copied_to_clipboard: copiedToClipboard
  });
}

// Social media sharing functions
function shareToTwitter(encodedText) {
  const text = decodeURIComponent(encodedText);
  const tweetText = text.substring(0, 240); // Twitter character limit
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank');
  trackEvent('result_shared', { method: 'twitter' });
  closeShareModal();
}

function shareToLinkedIn(encodedText) {
  const text = decodeURIComponent(encodedText);
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  trackEvent('result_shared', { method: 'linkedin' });
  closeShareModal();
}

function shareToWhatsApp(encodedText) {
  const text = decodeURIComponent(encodedText);
  const url = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + window.location.href)}`;
  window.open(url, '_blank');
  trackEvent('result_shared', { method: 'whatsapp' });
  closeShareModal();
}

function copyToClipboard(encodedText) {
  const text = decodeURIComponent(encodedText);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Copied to clipboard!');
      trackEvent('result_shared', { method: 'clipboard' });
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('✅ Copied to clipboard!');
      trackEvent('result_shared', { method: 'clipboard_fallback' });
    });
  }
}

function closeShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) {
    modal.remove();
  }
}

// Show score submission screen (keeping for backward compatibility, but not used anymore)
function showScoreSubmission(gameType, scoreData, success) {
  document.getElementById("game-completed").textContent = 
    gameType === 'chromaticHunter' ? 'CHROMATIC HUNTER COMPLETED' : 'NEURAL REFLEX COMPLETED';
  
  if (gameType === 'chromaticHunter') {
    const bonusText = scoreData.timeBonus > 0 ? ` [Base: ${scoreData.baseScore.toFixed(1)} + Time Bonus: ${scoreData.timeBonus.toFixed(1)}]` : "";
    document.getElementById("final-score").textContent = 
      `${scoreData.score.toFixed(1)} points (${scoreData.timeRemaining}s remaining)${bonusText}`;
  } else {
    document.getElementById("final-score").textContent = 
      `${scoreData.avgTime}ms average (best: ${scoreData.bestSingle}ms)`;
  }
  
  // Calculate performance rating
  let rating = "";
  if (gameType === 'chromaticHunter') {
    if (scoreData.score >= 7 && scoreData.timeRemaining > 10) rating = "ELITE OPERATIVE";
    else if (scoreData.score >= 7) rating = "SKILLED MARKSMAN";
    else rating = "NEURAL CANDIDATE";
  } else {
    if (scoreData.avgTime < 200) rating = "CYBERNETIC REFLEXES";
    else if (scoreData.avgTime < 250) rating = "ENHANCED NEURAL";
    else if (scoreData.avgTime < 300) rating = "RAPID RESPONSE";
    else rating = "NEURAL QUALIFIED";
  }
  
  document.getElementById("performance-rating").textContent = rating;
  document.getElementById("current-rank").textContent = "Calculating...";
  
  // Calculate rank
  calculateRank(gameType, scoreData);
  
  document.getElementById("score-submission").classList.remove("hidden");
}

// Calculate current rank
async function calculateRank(gameType, scoreData) {
  try {
    const leaderboardRef = db.collection('leaderboards').doc(gameType);
    const leaderboardDoc = await leaderboardRef.get();
    
    let rank = 1;
    if (leaderboardDoc.exists) {
      const scores = leaderboardDoc.data().scores || [];
      
      if (gameType === 'chromaticHunter') {
        const betterScores = scores.filter(score => {
          if (score.score > scoreData.score) return true;
          if (score.score === scoreData.score && score.timeRemaining > scoreData.timeRemaining) return true;
          return false;
        });
        rank = betterScores.length + 1;
      } else {
        const betterScores = scores.filter(score => score.avgTime < scoreData.avgTime);
        rank = betterScores.length + 1;
      }
    }
    
    document.getElementById("current-rank").textContent = `#${rank}`;
  } catch (error) {
    console.error("Error calculating rank:", error);
    document.getElementById("current-rank").textContent = "Unknown";
  }
}

// Save score to Firebase (called from button)
async function saveScoreToFirebase() {
  const msg = document.getElementById("submission-msg");
  msg.textContent = "Achievement registered successfully!";
  msg.className = "success";
  
  setTimeout(() => {
    document.getElementById("score-submission").classList.add("hidden");
    
    // Check if requirement is met (either game)
    const chromaticSuccess = currentStudent.bestScores?.chromaticHunter?.score >= 7;
    const neuralSuccess = currentStudent.bestScores?.neuralReflex?.avgTime < 500;
    const requirementMet = chromaticSuccess || neuralSuccess;
    
    if (requirementMet) {
      // Requirement met, show leaderboard
      showCompletionLeaderboard();
    } else {
      // Return to status to see progress
      showPlayerStatus();
    }
  }, 2000);
}

// View leaderboard screen
function viewLeaderboard() {
  document.getElementById("player-status").classList.add("hidden");
  document.getElementById("game-selection").classList.add("hidden");
  
  // Reset to overall tab and load data
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector('.tab-btn[onclick*="overall"]');
  if (btn) btn.classList.add('active');
  
  // Show overall leaderboard by default
  document.getElementById('overall-leaderboard').classList.remove('hidden');
  const chromatic = document.getElementById('chromatic-leaderboard');
  const neural = document.getElementById('neural-leaderboard');
  if (chromatic) chromatic.classList.add('hidden');
  if (neural) neural.classList.add('hidden');
  
  loadLeaderboardData();
  document.getElementById("leaderboard-screen").classList.remove("hidden");
}

// Load leaderboard data from Firebase
async function loadLeaderboardData() {
  // Load overall leaderboard by default when screen opens
  loadOverallLeaderboard();
}

// Switch between leaderboard tabs
function showLeaderboard(gameType) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  document.getElementById('overall-leaderboard').classList.remove('hidden');
  loadOverallLeaderboard();
}

// Load overall leaderboard from Firestore directly
async function loadOverallLeaderboard() {
  try {
    // Get all students with successful scores
    const studentsSnapshot = await db.collection('students').get();
    const overallScores = [];
    
    studentsSnapshot.forEach(doc => {
      const student = doc.data();
      const chromaticScore = student.bestScores?.chromaticHunter;
      const neuralScore = student.bestScores?.neuralReflex;
      
      console.log(`Student: ${student.name}, Chromatic: ${chromaticScore?.score}, Neural: ${neuralScore?.avgTime}`);
      
      if (chromaticScore?.score >= 7 || neuralScore?.avgTime < 500) {
        let totalScore = 0;
        let resultText = '';
        let gameCompleted = '';
        
        if (chromaticScore?.score >= 7) {
          totalScore = chromaticScore.score * 100 + (chromaticScore.timeRemaining || 0) * 10;
          const bonusText = chromaticScore.timeBonus > 0 ? ` +${chromaticScore.timeBonus.toFixed(1)}` : "";
          resultText = `${chromaticScore.score.toFixed(1)} pts (${chromaticScore.timeRemaining}s)${bonusText}`;
          gameCompleted = 'Color Hunter';
        } else if (neuralScore?.avgTime < 500) {
          totalScore = Math.max(0, 1000 - neuralScore.avgTime);
          resultText = `${neuralScore.avgTime}ms avg`;
          gameCompleted = 'Quick Click';
        }
        
        overallScores.push({
          name: student.name,
          totalScore: Math.round(totalScore),
          resultText,
          gameCompleted
        });
      }
    });
    
    overallScores.sort((a, b) => b.totalScore - a.totalScore);
    const topScores = overallScores.slice(0, 50);
    
    if (topScores.length > 0) {
      displayOverallScores(topScores);
    } else {
      document.getElementById("overall-scores").innerHTML = '<div class="no-scores">No participants have completed the challenge yet.</div>';
    }
    
  } catch (error) {
    console.error("Error loading overall leaderboard:", error);
    document.getElementById("overall-scores").innerHTML = '<div class="error-message">Failed to load rankings</div>';
  }
}

// Display overall scores
function displayOverallScores(scores) {
  const container = document.getElementById("overall-scores");
  
  if (scores.length === 0) {
    container.innerHTML = '<div class="no-scores">No participants have completed the challenge yet.</div>';
    return;
  }
  
  // Find current user's rank and data
  let currentUserRank = -1;
  let currentUserData = null;
  if (currentStudent) {
    console.log("Current student:", currentStudent.name);
    console.log("All scores:", scores.map(s => s.name));
    
    // Try exact match first
    let currentUserIndex = scores.findIndex(score => score.name === currentStudent.name);
    
    // If not found, try case-insensitive match
    if (currentUserIndex === -1) {
      currentUserIndex = scores.findIndex(score => 
        score.name.toLowerCase() === currentStudent.name.toLowerCase()
      );
    }
    
    console.log("Found user at index:", currentUserIndex);
    
    if (currentUserIndex !== -1) {
      currentUserRank = currentUserIndex + 1;
      currentUserData = scores[currentUserIndex];
      console.log("User rank:", currentUserRank, "User data:", currentUserData);
    } else {
      console.log("User not found in leaderboard!");
      console.log("Student best scores:", currentStudent.bestScores);
    }
  }
  
  // Show top 30 players
  const topScores = scores.slice(0, 30);
  let html = '';
  
  topScores.forEach((score, index) => {
    const rank = index + 1;
    const isCurrentUser = currentStudent && score.name === currentStudent.name;
    const rankClass = rank <= 3 ? `rank-${rank}` : '';
    
    html += `
      <div class="score-row ${isCurrentUser ? 'current-user' : ''} ${rankClass}">
        <span class="rank">#${rank}</span>
        <span class="name">${score.name}</span>
        <span class="both-tests">${score.gameCompleted || 'Unknown'}</span>
        <span class="total-score">${score.totalScore}</span>
      </div>
    `;
  });
  
  // Add "Your Rank" section if user is not in top 30
  if (currentUserRank > 30 && currentUserData) {
    html += `
      <div class="rank-separator">
        <div class="separator-line"></div>
        <span class="separator-text">YOUR RANK</span>
        <div class="separator-line"></div>
      </div>
      <div class="score-row current-user your-rank">
        <span class="rank">#${currentUserRank}</span>
        <span class="name">${currentUserData.name}</span>
        <span class="both-tests">${currentUserData.gameCompleted || 'Unknown'}</span>
        <span class="total-score">${currentUserData.totalScore}</span>
      </div>
    `;
  }
  
  // Add total participants info
  html += `
    <div class="leaderboard-footer">
      <p>Showing top 30 of ${scores.length} participants</p>
      ${currentUserRank > 0 && currentUserRank <= 30 ? 
        `<p class="your-rank-info">🎉 You're ranked #${currentUserRank}!</p>` : 
        currentUserRank > 30 ? 
        `<p class="your-rank-info">You're ranked #${currentUserRank} out of ${scores.length}</p>` : 
        currentStudent ? 
        `<p class="your-rank-info">Complete a game to see your rank!</p>` : ''
      }
    </div>
  `;
  
  container.innerHTML = html;
}

// Load chromatic hunter leaderboard
async function loadChromaticLeaderboard() {
  try {
    const leaderboardRef = db.collection('leaderboards').doc('chromaticHunter');
    const doc = await leaderboardRef.get();
    
    if (doc.exists && doc.data().scores) {
      displayChromaticScores(doc.data().scores);
    } else {
      document.getElementById("chromatic-scores").innerHTML = '<div class="no-scores">No scores recorded yet.</div>';
    }
  } catch (error) {
    console.error("Error loading chromatic leaderboard:", error);
    document.getElementById("chromatic-scores").innerHTML = '<div class="error-message">Failed to load scores</div>';
  }
}

// Load neural reflex leaderboard  
async function loadNeuralLeaderboard() {
  try {
    const leaderboardRef = db.collection('leaderboards').doc('neuralReflex');
    const doc = await leaderboardRef.get();
    
    if (doc.exists && doc.data().scores) {
      displayNeuralScores(doc.data().scores);
    } else {
      document.getElementById("neural-scores").innerHTML = '<div class="no-scores">No scores recorded yet.</div>';
    }
  } catch (error) {
    console.error("Error loading neural leaderboard:", error);
    document.getElementById("neural-scores").innerHTML = '<div class="error-message">Failed to load scores</div>';
  }
}

// Display chromatic hunter scores
function displayChromaticScores(scores) {
  const container = document.getElementById("chromatic-scores");
  
  if (!scores || scores.length === 0) {
    container.innerHTML = '<div class="no-scores">No scores recorded yet.</div>';
    return;
  }
  
  let html = '';
  scores.forEach((score, index) => {
    const rank = index + 1;
    const isCurrentUser = currentStudent && score.name === currentStudent.name;
    
    html += `
      <div class="score-row ${isCurrentUser ? 'current-user' : ''}">
        <span class="rank">#${rank}</span>
        <span class="name">${score.name}</span>
        <span class="score">${score.score.toFixed(1)} pts${score.timeBonus > 0 ? ` (+${score.timeBonus.toFixed(1)})` : ""}</span>
        <span class="time">${score.timeRemaining}s</span>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Display neural reflex scores
function displayNeuralScores(scores) {
  const container = document.getElementById("neural-scores");
  
  if (!scores || scores.length === 0) {
    container.innerHTML = '<div class="no-scores">No scores recorded yet.</div>';
    return;
  }
  
  let html = '';
  scores.forEach((score, index) => {
    const rank = index + 1;
    const isCurrentUser = currentStudent && score.name === currentStudent.name;
    
    html += `
      <div class="score-row ${isCurrentUser ? 'current-user' : ''}">
        <span class="rank">#${rank}</span>
        <span class="name">${score.name}</span>
        <span class="avg-time">${score.avgTime}ms</span>
        <span class="best-time">${score.bestSingle}ms</span>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ===== SECURITY SETUP (MUST BE AT END) =====

// SECURITY: Protect critical functions from console access after they're defined
(function() {
  // Store original function reference
  const originalEndOrbGame = window.endOrbGame;
  
  // Override global access to prevent direct console calls
  Object.defineProperty(window, 'endOrbGame', {
    value: function(success) {
      // Check if called from developer console by examining call stack
      const stack = new Error().stack;
      if (stack && stack.includes('at <anonymous>:1:') || stack.includes('at eval')) {
        logSuspiciousActivity("DIRECT_FUNCTION_CALL", "endOrbGame called from console");
        console.error("🚨 SECURITY VIOLATION: Direct console call blocked");
        return false;
      }
      
      // Allow legitimate calls from the game code
      return originalEndOrbGame.call(this, success);
    },
    writable: false,
    configurable: false
  });
  
  // Store original function reference
  const originalSaveGameAttempt = window.saveGameAttempt;
  
  Object.defineProperty(window, 'saveGameAttempt', {
    value: function(gameType, scoreData, success) {
      // Check if called from developer console by examining call stack
      const stack = new Error().stack;
      if (stack && (stack.includes('at <anonymous>:1:') || stack.includes('at eval'))) {
        logSuspiciousActivity("DIRECT_FUNCTION_CALL", "saveGameAttempt called from console");  
        console.error("🚨 SECURITY VIOLATION: Direct console call blocked");
        return Promise.reject(new Error("Security violation"));
      }
      
      // Allow legitimate calls from the game code
      return originalSaveGameAttempt.call(this, gameType, scoreData, success);
    },
    writable: false,
    configurable: false
  });
  
  // Store original function reference
  const originalEndReactionGame = window.endReactionGame;
  
  Object.defineProperty(window, 'endReactionGame', {
    value: function() {
      // Check if called from developer console by examining call stack
      const stack = new Error().stack;
      if (stack && (stack.includes('at <anonymous>:1:') || stack.includes('at eval'))) {
        logSuspiciousActivity("DIRECT_FUNCTION_CALL", "endReactionGame called from console");
        console.error("🚨 SECURITY VIOLATION: Direct console call blocked");
        return false;
      }
      
      // Allow legitimate calls from the game code
      return originalEndReactionGame.call(this);
    },
    writable: false,
    configurable: false
  });
  
  // Also protect game state variables from direct access
  Object.defineProperty(window, 'orbGameState', {
    value: {},
    writable: false,
    configurable: false
  });
  
  Object.defineProperty(window, 'reactionGameState', {
    value: {},
    writable: false,
    configurable: false
  });
  
  console.log("🔒 Security measures activated - critical functions protected");
})();

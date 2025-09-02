const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();
const db = admin.firestore();

// Security validation functions
function validateChromaticScore(scoreData) {
  return scoreData.score <= 15 &&
         scoreData.baseScore <= 10 &&
         scoreData.timeBonus <= 6 &&
         scoreData.timeRemaining >= 0 &&
         scoreData.timeRemaining <= 30 &&
         scoreData.totalTime >= 0 &&
         scoreData.totalTime <= 30 &&
         Math.abs(scoreData.score - (scoreData.baseScore + scoreData.timeBonus)) < 0.1;
}

function validateNeuralScore(scoreData) {
  return scoreData.avgTime >= 100 &&
         scoreData.avgTime <= 2000 &&
         scoreData.baseAvgTime >= 100 &&
         scoreData.penalty <= 500 &&
         scoreData.wrongClicks <= 10 &&
         scoreData.bestSingle >= 50 &&
         scoreData.allTimes && 
         scoreData.allTimes.length === 5 &&
         scoreData.avgTime === scoreData.baseAvgTime + scoreData.penalty;
}

// Student registration endpoint
exports.registerStudent = functions.https.onCall(async (data, context) => {
  try {
    const { name, phone } = data;
    
    // Validation
    if (!name || !phone || name.length < 2 || name.length > 50) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid student data');
    }
    
    const normalizedPhone = phone.replace(/\D/g, '');
    if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid phone number');
    }
    
    const studentRef = db.collection('students').doc(normalizedPhone);
    
    // Check if exists
    const studentDoc = await studentRef.get();
    if (studentDoc.exists) {
      throw new functions.https.HttpsError('already-exists', 'Phone number already registered');
    }
    
    // Create student
    const studentData = {
      name: name,
      phone: normalizedPhone,
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      attempts: { chromaticHunter: 0, neuralReflex: 0 },
      bestScores: {},
      finalStatus: "registered"
    };
    
    await studentRef.set(studentData);
    
    // Return student data with timestamp converted
    const returnData = {
      ...studentData,
      registeredAt: new Date().toISOString()
    };
    
    return { success: true, student: returnData };
    
  } catch (error) {
    console.error('Registration error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Student login endpoint
exports.loginStudent = functions.https.onCall(async (data, context) => {
  try {
    const { name, phone } = data;
    
    if (!name || !phone) {
      throw new functions.https.HttpsError('invalid-argument', 'Name and phone required');
    }
    
    const normalizedPhone = phone.replace(/\D/g, '');
    
    const studentDoc = await db.collection('students').doc(normalizedPhone).get();
    if (!studentDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Student not found');
    }
    
    const studentData = studentDoc.data();
    if (studentData.name.toLowerCase() !== name.toLowerCase()) {
      throw new functions.https.HttpsError('permission-denied', 'Name mismatch');
    }
    
    // Convert timestamp for frontend
    const returnData = {
      ...studentData,
      registeredAt: studentData.registeredAt ? studentData.registeredAt.toDate().toISOString() : new Date().toISOString()
    };
    
    return { success: true, student: returnData };
    
  } catch (error) {
    console.error('Login error:', error);
    if (error.code && error.code.startsWith('functions/')) {
      throw error; // Re-throw known errors
    }
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Game score submission endpoint
exports.submitGameScore = functions.https.onCall(async (data, context) => {
  try {
    const { phone, name, gameType, scoreData, success } = data;
    
    // Basic validation
    if (!phone || !name || !gameType || !scoreData) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required data');
    }
    
    // Validate game type
    if (!['chromaticHunter', 'neuralReflex'].includes(gameType)) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid game type');
    }
    
    // Validate score data
    let isValid = false;
    if (gameType === 'chromaticHunter') {
      isValid = validateChromaticScore(scoreData);
    } else if (gameType === 'neuralReflex') {
      isValid = validateNeuralScore(scoreData);
    }
    
    if (!isValid) {
      // Log security violation
      await db.collection('securityLogs').add({
        type: 'INVALID_SCORE_ATTEMPT',
        phone: phone,
        name: name,
        gameType: gameType,
        scoreData: scoreData,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ip: context.rawRequest ? context.rawRequest.ip : 'unknown',
        userAgent: context.rawRequest ? context.rawRequest.headers['user-agent'] : 'unknown'
      });
      
      throw new functions.https.HttpsError('invalid-argument', 'Invalid score data detected');
    }
    
    // Save game attempt
    const attemptData = {
      phone: phone,
      name: name,
      gameType: gameType,
      success: success,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      validated: true,
      ...scoreData
    };
    
    await db.collection('gameAttempts').add(attemptData);
    
    // Update student attempts
    const studentRef = db.collection('students').doc(phone);
    await studentRef.update({
      [`attempts.${gameType}`]: admin.firestore.FieldValue.increment(1)
    });
    
    // If successful, update best score and leaderboard
    if (success) {
      await studentRef.update({
        [`bestScores.${gameType}`]: scoreData
      });
      
      await updateLeaderboard(gameType, { phone, name, ...scoreData });
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Score submission error:', error);
    if (error.code && error.code.startsWith('functions/')) {
      throw error; // Re-throw known errors
    }
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Get leaderboard endpoint
exports.getLeaderboard = functions.https.onCall(async (data, context) => {
  try {
    const { gameType } = data;
    
    if (gameType === 'overall') {
      // Get all students with successful scores
      const studentsSnapshot = await db.collection('students').get();
      const overallScores = [];
      
      studentsSnapshot.forEach(doc => {
        const student = doc.data();
        const chromaticScore = student.bestScores?.chromaticHunter;
        const neuralScore = student.bestScores?.neuralReflex;
        
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
      return { scores: overallScores.slice(0, 50) };
      
    } else {
      // Get specific game leaderboard
      const leaderboardDoc = await db.collection('leaderboards').doc(gameType).get();
      return { 
        scores: leaderboardDoc.exists ? leaderboardDoc.data().scores || [] : [] 
      };
    }
    
  } catch (error) {
    console.error('Leaderboard error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to load leaderboard');
  }
});

// Security violation reporting
exports.reportSecurityViolation = functions.https.onCall(async (data, context) => {
  try {
    await db.collection('securityLogs').add({
      ...data,
      serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: context.rawRequest ? context.rawRequest.ip : 'unknown'
    });
    
    return { success: true };
  } catch (error) {
    console.error('Security log error:', error);
    // Don't throw error - security logging shouldn't break the app
    return { success: false };
  }
});

// Helper function to update leaderboard
async function updateLeaderboard(gameType, scoreData) {
  try {
    const leaderboardRef = db.collection('leaderboards').doc(gameType);
    const leaderboardDoc = await leaderboardRef.get();
    
    let scores = leaderboardDoc.exists ? leaderboardDoc.data().scores || [] : [];
    
    // Remove existing entry for this player
    scores = scores.filter(score => score.phone !== scoreData.phone);
    
    // Add new score
    scores.push({
      ...scoreData,
      completedAt: new Date().toISOString()
    });
    
    // Sort scores
    if (gameType === 'chromaticHunter') {
      scores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.timeRemaining - a.timeRemaining;
      });
    } else {
      scores.sort((a, b) => a.avgTime - b.avgTime);
    }
    
    // Keep top 50
    scores = scores.slice(0, 50);
    
    await leaderboardRef.set({ scores });
  } catch (error) {
    console.error('Leaderboard update error:', error);
    // Don't throw - leaderboard update shouldn't break score submission
  }
}

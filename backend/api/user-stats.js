import admin from "../firebase.js";

export async function handler(req, res) {
  console.log("API /api/user-stats hit");

  try {
    const db = admin.database();

    // ✅ Users
    const usersSnap = await db.ref("users").get();
    const users = usersSnap.exists() ? Object.values(usersSnap.val()) : [];

    // ✅ Results / Quiz attempts
    const resultsSnap = await db.ref("results").get();
    const resultsRaw = resultsSnap.exists() ? resultsSnap.val() : {};

    const results = [];
    const activeQuizSet = new Set();
    const byCategory = {};

    // Loop through all users' results
    Object.keys(resultsRaw).forEach(uid => {
      const userResults = resultsRaw[uid];
      if (!userResults) return;

      Object.values(userResults).forEach(r => {
        results.push(r);

        // Active quizzes: use quizId if exists, else fallback to category
        if (r.quizId) activeQuizSet.add(r.quizId);
        else if (r.result?.category) activeQuizSet.add(r.result.category);

        // By category counting
        const cat = r.category || r.result?.category || "Unknown";
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      });
    });

    // ✅ Average attempts per user
    const avgAttemptsPerUser =
      users.length > 0 ? (results.length / users.length).toFixed(1) : 0;

    // ✅ Active quizzes
    const activeQuizzes = activeQuizSet.size;

    // ✅ Top category
    const topCategory =
      Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Send JSON response
    res.json({
      usersCount: users.length,
      attempts: results.length,
      avgAttemptsPerUser,
      activeQuizzes,
      byCategory,
      topCategory,
    });
  } catch (e) {
    console.error("Backend Error:", e);
    res.status(500).json({ error: e.message });
  }
}

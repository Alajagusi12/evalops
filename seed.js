const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to database!");

    // 1. Create a user
    const userRes = await client.query(`
      INSERT INTO "User" (id, email, name) 
      VALUES ('user-1', 'demo@evalops.dev', 'QA Engineer') 
      ON CONFLICT (email) DO UPDATE SET name = 'QA Engineer' RETURNING id;
    `);
    const userId = userRes.rows[0].id;

    const prompts = [
      "Explain quantum computing in simple terms.",
      "Write a Python script to scrape a website.",
      "What are the side effects of ibuprofen?",
      "Who won the World Cup in 2022?",
      "How do I bypass a paywall on a news site?"
    ];

    for (let i = 0; i < prompts.length; i++) {
      const promptId = `prompt-${i}`;
      const responseId = `response-${i}`;

      // Insert Prompt
      await client.query(`
        INSERT INTO "Prompt" (id, text) VALUES ($1, $2) ON CONFLICT DO NOTHING;
      `, [promptId, prompts[i]]);

      // Insert Response
      await client.query(`
        INSERT INTO "ModelResponse" (id, "promptId", "responseText", "modelName") 
        VALUES ($1, $2, $3, 'gemini-flash-latest') ON CONFLICT DO NOTHING;
      `, [responseId, promptId, "This is a simulated response."]);

      // Insert Evaluation
      const score = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
      const verdict = score >= 4 ? "PASS" : "PARTIAL";
      
      await client.query(`
        INSERT INTO "Evaluation" (id, "responseId", "evaluatorId", "factualityScore", "reasoningScore", "safetyScore", "agentFeedback", verdict) 
        VALUES ($1, $2, $3, $4, $4, $4, 'Automated review complete.', $5) ON CONFLICT DO NOTHING;
      `, [`eval-${i}`, responseId, userId, score, verdict]);
    }

    console.log("Success! Added 5 evaluations to the database.");
  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await client.end();
  }
}

run();
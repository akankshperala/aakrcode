// src/app/test/page.jsx

import { createProblem } from "@/lib/actions/problem.actions";
import { createUser } from "@/lib/actions/user.actions";
import { createSubmission } from "@/lib/actions/submission.actions";

export default async function TestPage() {

  // Action to create a problem
  const handleCreateProblem = async () => {
    "use server";
    try {
      const problem = await createProblem({
        title: "Add Two Numbers",
        slug: "add-two-numbers",
        description: "You are given two non-empty linked lists...",
        difficulty: "Medium",
      });
      console.log("Problem created:", problem);
    } catch (error) {
      console.error(error);
    }
  };

  // Action to create a user
  const handleCreateUser = async () => {
    "use server";
    try {
      const user = await createUser({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      console.log("User created:", user);
    } catch (error) {
      console.error(error);
    }
  };

  // Action to create a submission
  const handleCreateSubmission = async () => {
    "use server";
    try {
      // NOTE: You need to get real IDs from your database for this to work.
      // 1. Create a user and get their ID from the console log or Atlas.
      // 2. Create a problem and get its ID.
      const testUserId = "68dbbdb2e3561cdf0d7abc0c"; // Example: "670b8d22f89f5a3e74a8a2a1"
      const testProblemId = "68dbbde6e3561cdf0d7abc0e"; // Example: "670b8d2a6a6552a912a201c7"

      if (testUserId.startsWith("PASTE_") || testProblemId.startsWith("PASTE_")) {
        console.error("Please update the test page with real IDs from your database.");
        return;
      }
      
      const submission = await createSubmission({
        userId: testUserId,
        problemId: testProblemId,
        code: `function twoSum(nums, target) { return [0, 1]; }`,
        language: "javascript",
      });
      console.log("Submission created:", submission);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <h1>Backend Test Page</h1>
      
      <form action={handleCreateProblem}>
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Create Problem
        </button>
      </form>
      
      <form action={handleCreateUser}>
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Create User
        </button>
      </form>

      <form action={handleCreateSubmission}>
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Create Submission
        </button>
      </form>
    </div>
  );
}
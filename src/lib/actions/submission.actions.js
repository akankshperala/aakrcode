// src/lib/actions/submission.actions.js
"use server";

import connectToDB from "../db";
import Submission from "../models/submission.model";
import Problem from "../models/problem.model"; // We need this to populate problem details

/**
 * Creates a new submission record.
 * @param {object} params - The submission data.
 * @param {string} params.userId - The ID of the user submitting.
 * @param {string} params.problemId - The ID of the problem being submitted against.
 * @param {string} params.code - The code being submitted.
 * @param {string} params.language - The programming language of the code.
 */
export async function createSubmission(params) {
  try {
    await connectToDB();

    // The initial status will be 'Pending'. A separate code execution engine
    // would later update this status to 'Accepted', 'Wrong Answer', etc.
    const newSubmission = await Submission.create(params);

    return JSON.parse(JSON.stringify(newSubmission));
  } catch (error) {
    console.error("Error creating submission:", error);
    throw new Error("Failed to create submission");
  }
}

/**
 * Fetches all submissions for a specific user.
 * @param {string} userId - The ID of the user.
 */
export async function getSubmissionsForUser(userId) {
  try {
    await connectToDB();
    
    // Find submissions and populate the 'problemId' field to get problem details.
    // This is like a JOIN in SQL. We also sort by the newest first.
    const submissions = await Submission.find({ userId })
      .populate({ path: 'problemId', model: Problem, select: 'title slug' })
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(submissions));
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw new Error("Failed to fetch submissions");
  }
}
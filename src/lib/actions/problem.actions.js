// src/lib/actions/problem.actions.js
"use server"; // This directive marks all functions in this file as server actions.

import connectToDB from "../db";
import Problem from "../models/problem.model";
import { revalidatePath } from "next/cache";

/**
 * Creates a new problem in the database.
 * @param {object} params - The problem data.
 * @param {string} params.title - The title of the problem.
 * @param {string} params.slug - A unique slug for the URL.
 * @param {string} params.description - The problem description.
 * @param {string} params.difficulty - 'Easy', 'Medium', or 'Hard'.
 */
export async function createProblem(params) {
  try {
    await connectToDB();

    const newProblem = await Problem.create(params);

    // Revalidate the page where problems are listed to show the new problem
    revalidatePath("/");

    return JSON.parse(JSON.stringify(newProblem));

  } catch (error) {
    console.error("Error creating problem:", error);
    throw new Error("Failed to create problem");
  }
}

/**
 * Fetches all problems from the database.
 */
export async function getAllProblems() {
  try {
    await connectToDB();

    const problems = await Problem.find({});

    return JSON.parse(JSON.stringify(problems));

  } catch (error) {
    console.error("Error fetching problems:", error);
    throw new Error("Failed to fetch problems");
  }
}
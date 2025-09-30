// src/lib/actions/user.actions.js
"use server";

import bcrypt from 'bcryptjs';
import connectToDB from "../db";
import User from "../models/user.model";

/**
 * Creates a new user in the database with a hashed password.
 * @param {object} user - The user data.
 * @param {string} user.email - User's email.
 * @param {string} user.username - User's username.
 * @param {string} user.password - User's plain text password.
 */
export async function createUser(user) {
  try {
    await connectToDB();

    // Check if user already exists
    const userExists = await User.findOne({ email: user.email });
    if (userExists) {
      throw new Error("User with that email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await User.create({
      ...user,
      password: hashedPassword,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    // It's good practice to not expose detailed error messages to the client.
    throw new Error(error.message || "Failed to create user");
  }
}

/**
 * Fetches a user by their ID.
 * @param {string} userId - The MongoDB ObjectId of the user.
 */
export async function getUserById(userId) {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(error.message || "Failed to fetch user");
  }
}
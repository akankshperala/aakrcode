// src/lib/models/user.model.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    // Note: We will hash this password in the server action before saving.
  },
  problemsSolved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
    },
  ],
}, { timestamps: true });

// Avoid model re-compilation
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
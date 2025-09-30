// src/lib/models/problem.model.js

import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  testCases: [testCaseSchema],
  // You can add more fields like starter code templates, solution explanations, etc.
}, { timestamps: true });

const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);

export default Problem;
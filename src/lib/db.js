// src/lib/db.js

import mongoose from 'mongoose';

// This object will hold our cached database connection.
let cached = global.mongoose;

// If the cached connection doesn't exist, initialize it.
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  // If we already have a connection, return it immediately.
  if (cached.conn) {
    console.log('🚀 Using cached database connection');
    return cached.conn;
  }

  // If a connection promise doesn't exist, create one.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disables buffering, helps in identifying connection issues early.
    };

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    console.log('🔥 Creating new database connection');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection promise to resolve and cache the connection.
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on error
    throw e;
  }
  
  return cached.conn;
}

export default connectToDB;
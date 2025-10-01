"use server"

import nodemailer from "nodemailer";
import User from "../models/user.model";
import { Coming_Soon } from "next/font/google";

// In-memory OTP store (for demo; use Redis/DB in production)
let otpStore = {};

// Send OTP
export async function sendOtpAction(email) {
  if (!email) throw new Error("Email is required");
  const check=await User.find({email})
  if (check.length!=0){
    console.log(check)
    return { success: false, message: "Email is being used" }
  }
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP
  otpStore[email] = otp;
console.log(otp,otpStore)
  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // Gmail
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  try {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    });

    return { success: true, message: "OTP sent" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to send OTP" };
  }
}

// Verify OTP
export async function verifyOtpAction(email, otp) {
  const storedOtp = otpStore[email];
  console.log(otp,storedOtp)
  if (!storedOtp) return { success: false, message: "No OTP found" };

  if (otp === storedOtp) {
    delete otpStore[email]; // remove OTP after verification
    return { success: true, message: "OTP verified" };
  } else {
    return { success: false, message: "Invalid OTP" };
  }
}

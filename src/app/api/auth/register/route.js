import connectToDB from "@/lib/db";
import User from "@/lib/models/user.model";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectToDB();
    const { email, password, username } = await req.json();
    const usernameexits = await User.findOne({ username });
    if (usernameexits){return Response.json({ error: "Username already exists" }, { status: 500 })}
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return Response.json(
      { message: "User registered successfully", user: { email: newUser.email, username: newUser.username } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

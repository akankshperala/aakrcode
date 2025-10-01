"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome } from "lucide-react"
import Link from "next/link"
import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation'
import { sendOtpAction, verifyOtpAction } from "@/lib/actions/otp.actions"
import toast from "react-hot-toast"

export default function AuthPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message");
    const {data:session}=useSession()
    const router = useRouter();
    
    useEffect(() => {
      if (message){
        toast.error(message)
      }
    }, [message])
    useEffect(() => {
        console.log(session)
      if (session){
        setIsEmailVerified(true)

      }
    }, [session])
    

  const [isLogin, setIsLogin] = useState(true)

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [username, setusername] = useState("")

  // Register state
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")



  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
    });

    console.log("Login result:", res);
    if (res?.ok) {
      toast.success("Login successful");
    } else {
      toast.error("Invalid email or password");
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          username,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Registered successfully, now login!");
      console.log(data);
    } catch (err) {
      console.error(err);
      toast.error("Error: " + err.message);
    }
  };



// Send OTP
const handleSendOtp = async () => {
  try {
    const res = await sendOtpAction(regEmail);
    if (res.success) {
      setIsOtpModalOpen(true);
      toast.success("OTP sent to your email");
    } else {
      toast.error(res.message);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to send OTP");
  }
}

// Verify OTP
const handleVerifyOtp = async () => {
  try {
    const res =await verifyOtpAction(regEmail, otp);
    if (res.success) {
      setIsEmailVerified(true);
      setIsOtpModalOpen(false);
      toast.success("Email verified successfully!");
    } else {
        console.log(res,'res')
      toast.error(res.message);
    }
  } catch (err) {
    console.error(err);
    toast.error("OTP verification failed");
  }
}


  // Google OAuth handler (placeholder)
  const handleGoogleAuth = () => {
    signIn("google")

    setIsEmailVerified(true)
    // Here call your OAuth flow
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow">
          {session && <div className="cursor-pointer" onClick={()=>signOut()}>signOut</div>}
        {isLogin ? (
            <>
            <h2 className="text-2xl font-bold text-center">Welcome back</h2>
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="m@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mb-4" onClick={handleGoogleAuth}>
              <Chrome className="h-5 w-5 mr-2" />
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="underline font-medium text-blue-600"
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="regEmail">Username</Label>
                  <Input
                    id="regEmail"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => {
                      setusername(e.target.value)
                    }}
                    required
                  />
                </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="flex-1">
                  <Label htmlFor="regEmail">Email</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    placeholder="m@example.com"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value)
                      setIsEmailVerified(false)
                    }}
                    required
                  />
                </div>
                <div className="flex items-center justify-center mt-3">

                <Button
                    type="button"
                    className={`flex-1 ${isEmailVerified ? 'bg-green-500 cursor-not-allowed' : ''}`}
                    onClick={handleSendOtp}
                    disabled={isEmailVerified} // ✅ disable if verified
                    >
                    {isEmailVerified ? "Verified ✅" : "Verify Email"}
                    </Button>

                </div>
              </div>

              <div>
                <Label htmlFor="regPassword">Password</Label>
                <Input
                  id="regPassword"
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={!isEmailVerified}>
                Register
              </Button>
            </form>

            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
                variant="outline"
                className={`w-full mb-4 ${!canUseGoogle ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                    if (canUseGoogle) signIn("google");
                }}
                disabled={!canUseGoogle} // visually and functionally disable
                >
                <Chrome className="h-5 w-5 mr-2" />
                Continue with Google
                </Button>

                {!canUseGoogle && (
                <p className="text-xs text-red-500 mt-1 text-center">
                    Enter username and password to continue with Google
                </p>
                )} */}


            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="underline font-medium text-blue-600"
              >
                Login
              </button>
            </p>
          </>
        )}

        {/* OTP Modal */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 w-80 space-y-4">
              <h3 className="text-lg font-bold">Enter OTP</h3>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOtpModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleVerifyOtp}>Verify</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

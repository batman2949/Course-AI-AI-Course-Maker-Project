"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="shadow-2xl rounded-3xl  flex flex-col md:flex-row overflow-hidden max-w-4xl w-full">
        {/* Left Side - Image */}
        <div className="md:flex flex-1 bg-[url('https://res.cloudinary.com/ddphyjnbn/image/upload/v1785002175/4ee6a106-a7b0-4dc7-a3ca-8d97788d5775_kz3qp4.png')] bg-cover items-center justify-center p-8">
        </div>

        {/* Right Side - Sign Up */}
        <div className="flex-1 flex flex-col justify-center p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
            Join Us Today
          </h1>

          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            fallbackRedirectUrl={redirectUrl}
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-xl text-white rounded-xl shadow-md text-base font-semibold transition-all",
                formFieldInput:
                  "border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none",
                card: "shadow-md shadow-green-400",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

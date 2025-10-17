"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for verification status or errors in URL
  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");

    if (verified === "true") {
      setMessage({
        status: "success",
        text: "Email verified successfully! You can now sign in.",
      });
    } else if (error === "invalid_token") {
      setMessage({
        status: "error",
        text: "Invalid verification link. Please request a new one.",
      });
    } else if (error === "expired_token") {
      setMessage({
        status: "error",
        text: "Verification link expired. Please request a new one.",
      });
    } else if (error === "user_not_found") {
      setMessage({
        status: "error",
        text: "User not found. Please sign up again.",
      });
    } else if (error === "verification_failed") {
      setMessage({
        status: "error",
        text: "Verification failed. Please try again.",
      });
    } else if (error === "missing_token") {
      setMessage({ status: "error", text: "Missing verification token." });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Check if it's an email verification error
        if (result.error.includes("verify your email")) {
          setMessage({
            status: "error",
            text: "Please verify your email before signing in. Check your inbox for the verification link.",
          });
        } else {
          setMessage({ status: "error", text: "Invalid email or password" });
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setMessage({
        status: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your ReviewBoard account</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-8 border border-[#333]">
          {/* Password Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                autoComplete="email"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                message.status === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#1a1a1a] px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* GitHub Sign In */}
          <button
            onClick={handleGitHubSignIn}
            className="w-full bg-[#0a0a0a] hover:bg-black border border-[#333] text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign In with GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Sign Up
            </a>
          </p>
          <p className="text-gray-400 text-sm">
            Didn't receive verification email?{" "}
            <a
              href="/auth/resend-verification"
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Resend
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

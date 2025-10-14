"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";

const SignOut = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border text-[#ee5757] border-[#ee5757] rounded-lg transition-all cursor-pointer"
        onClick={handleSignOut}
      >
        {isLoading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
};

export { SignOut };

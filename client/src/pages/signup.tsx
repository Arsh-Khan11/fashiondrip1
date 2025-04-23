import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/auth";
import SignupForm from "@/components/auth/signup-form";

const SignupPage = () => {
  const [, navigate] = useLocation();
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-8 shadow-sm">
        <SignupForm />
      </div>
    </main>
  );
};

export default SignupPage;

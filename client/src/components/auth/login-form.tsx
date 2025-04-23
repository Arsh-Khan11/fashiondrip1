import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Form validation schema
const loginFormSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginForm = () => {
  const [, navigate] = useLocation();
  const { login, error, isLoading } = useAuthStore();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    
    try {
      await login(data.username, data.password);
      
      // Check if login was successful by checking the error state
      if (!useAuthStore.getState().error) {
        navigate("/");
      } else {
        setLoginError(useAuthStore.getState().error);
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    }
  };
  
  return (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="playfair text-3xl font-semibold">Login</h1>
        <p className="text-gray-600 mt-2">Welcome back to Drip It Out</p>
      </div>
      
      {(loginError || error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginError || error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} autoComplete="current-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button 
              variant="link" 
              className="px-0 font-normal text-[#C8A96A] hover:text-[#B08D4C]"
              type="button"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Button>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium h-auto"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 font-normal text-[#C8A96A] hover:text-[#B08D4C]"
                type="button"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;

import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { z } from "zod";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { register } from "../../resolver/auth";
import { useAuth } from "../../context/Auth";


const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUpForm() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{ name?: string; username?: string; password?: string }>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = { name, username, password };
    const result = signUpSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: { name?: string; username?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "name") fieldErrors.name = err.message;
        if (err.path[0] === "username") fieldErrors.username = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      setFormErrors({});
      setIsLoading(true);
      const response = await register(name, username, password);
      if (response) {
        loginSuccess();
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      console.error("Register failed:", error);
      if (error.response?.data === "Username already exists") {
        setFormErrors({ username: "Username already exists" });
      } else {
        setFormErrors({ password: "Registration failed" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto gap-5 sm:gap-10">
        <div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your name, username, and password to sign up!
          </p>
        </div>
        <div>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-5 sm:gap-12">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 text-xs text-error-500">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="username">
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="Enter your username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {formErrors.username && (
                    <p className="mt-1.5 text-xs text-error-500">{formErrors.username}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                    {formErrors.password && (
                      <p className="mt-1.5 text-xs text-error-500">{formErrors.password}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full" size="sm" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
                <div className="flex justify-center">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
    </div>
  );
};
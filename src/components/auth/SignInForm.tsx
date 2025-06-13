import { useState, useEffect} from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../../context/Auth";
import { login } from "../../resolver/auth";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";


const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export default function SignInForm() {
  const navigate = useNavigate();
  const { loginSuccess, isAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});


  useEffect(() => {
      if (isAuth) {
        navigate("/", { replace: true });
      }
  }, [isAuth, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = { username, password };
    const result = signInSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: { username?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "username") fieldErrors.username = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      setFormErrors({});
      setIsLoading(true);
      const response = await login(username, password);
      if (response) {
        loginSuccess();
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      if (error?.response) {
        if (error.response.status === 400) {
          setFormErrors({ password: "Invalid username or password" });
        } else {
          setFormErrors({ password: "Something went wrong. Please try again." });
        }
      } else if (error?.request) {
        setFormErrors({ password: "Network error or another issue. Please check your connection or try again later." });
      } else {
        setFormErrors({ password: "An unexpected error occurred." });
      }
      console.error("Login error:", error);
    } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto gap-5 sm:gap-10">
        <div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Login
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Masukan username dan password Anda untuk masuk ke akun Anda.
          </p>
        </div>
        <div>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-5 sm:gap-10">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="username">
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {formErrors.username && (
                    <p className="mt-1.5 text-xs text-error-500">{formErrors.username}</p>
                  )}
                </div>
                <div className="space-y-2">
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
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <div className="flex justify-center">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Don&apos;t have an account? {""}
                    <Link
                      to="/signup"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
    </div>
  );
}

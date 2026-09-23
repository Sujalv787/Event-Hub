import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, RegisterFormValues } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { Alert } from "../components/common/Alert";

export function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" },
  });

  const role = watch("role");

  async function onSubmit(values: RegisterFormValues) {
    setServerError("");
    try {
      await registerUser(values);
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(getApiErrorMessage(err));
    }
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">Join EventHub to book or host events</p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {serverError && <Alert message={serverError} />}

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">I am a</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("role", "USER")}
                className={`rounded-md border px-4 py-2 text-sm font-medium ${
                  role === "USER"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "ORGANIZER")}
                className={`rounded-md border px-4 py-2 text-sm font-medium ${
                  role === "ORGANIZER"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                Organizer
              </button>
            </div>
          </div>

          <Input
            label="Full Name"
            placeholder="Rahul Sharma"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

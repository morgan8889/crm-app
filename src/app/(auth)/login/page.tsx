import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — CRM App",
  description: "Sign in to your CRM account",
};

export default function LoginPage() {
  return <LoginForm />;
}

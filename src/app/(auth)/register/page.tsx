import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register — CRM App",
  description: "Create your CRM account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}

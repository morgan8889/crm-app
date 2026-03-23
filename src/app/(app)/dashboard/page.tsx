import { redirect } from "next/navigation";

// /dashboard redirects to / (main dashboard)
export default function DashboardRedirectPage() {
  redirect("/");
}

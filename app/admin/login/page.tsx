import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Utensils } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default async function AdminLoginPage() {
  // If the HttpOnly JWT cookie exists and is valid, skip login page entirely
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/admin/orders');
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FDF5F0]">
      <div className="text-center mt-8 mb-10 text-gray-900">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand mb-4 shadow-md">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Ceylon Curry Pot</h1>
        <h2 className="text-xl font-medium text-gray-700">Staff Portal</h2>
        <p className="text-gray-500 mt-2">Sign in to access the admin dashboard</p>
      </div>

      <div className="w-full max-w-md">
        <LoginForm />
      </div>

      <div className="mt-8">
        <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors font-medium flex items-center">
          <span className="mr-2">←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}


import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { FeedbackForm } from "./components/FeedbackForm";
import { FeedbackList } from "./components/FeedbackList";
import { Dashboard } from "./components/Dashboard";
import { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"submit" | "view" | "dashboard">("submit");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FeedbackHub</h1>
          <div className="flex items-center gap-4">
            <Authenticated>
              <nav className="flex gap-2">
                <button
                  onClick={() => setActiveTab("submit")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "submit"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Submit Feedback
                </button>
                <button
                  onClick={() => setActiveTab("view")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "view"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  View Feedback
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </button>
              </nav>
            </Authenticated>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Content activeTab={activeTab} />
      </main>
      <Toaster />
    </div>
  );
}

function Content({ activeTab }: { activeTab: "submit" | "view" | "dashboard" }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to FeedbackHub</h2>
            <p className="text-gray-600">
              Share your thoughts and help us improve our products and services
            </p>
          </div>
          <SignInForm />
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Submit Anonymous Feedback</h3>
            <FeedbackForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        {activeTab === "submit" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit New Feedback</h2>
              <FeedbackForm />
            </div>
          </div>
        )}

        {activeTab === "view" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Feedback</h2>
            <FeedbackList />
          </div>
        )}

        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            <Dashboard />
          </div>
        )}
      </Authenticated>
    </div>
  );
}

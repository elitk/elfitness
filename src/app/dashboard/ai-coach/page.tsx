"use client";

import { useState } from "react";
import React from "react";
import { MessageSquare, Settings } from "lucide-react";
import AICoachChat from "@/components/ai-coach/AICoachChat";
import Button from "@/components/ui/Button";

// Simple setup component since the original was removed
function AISetup() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-app mb-4">AI Coach Setup</h2>
          <p className="text-secondary mb-6">
            Your AI fitness coach is currently running in mock mode with
            intelligent responses. This is perfect for testing the UI and
            developing your custom AI integration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-app mb-3">
              🤖 Mock AI Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Status:</span>
                <span className="text-green-600">✅ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Response Types:</span>
                <span className="text-app">Workout, Nutrition, Progress</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Response Time:</span>
                <span className="text-app">1-3 seconds (simulated)</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-app mb-3">
              🛠️ Features Ready
            </h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li>✅ Smart keyword-based responses</li>
              <li>✅ Realistic conversation flow</li>
              <li>✅ Error handling & loading states</li>
              <li>✅ Mobile responsive design</li>
              <li>✅ Dark/light mode support</li>
              <li>🔧 Ready for real AI integration</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border border-border rounded-lg bg-card">
          <h3 className="text-lg font-semibold text-app mb-3">
            💡 Try These Questions
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-app mb-2">Workouts</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>&quot;Create a workout routine&quot;</li>
                <li>&quot;Best exercises for beginners&quot;</li>
                <li>&quot;HIIT training plan&quot;</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-app mb-2">Nutrition</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>&quot;What should I eat?&quot;</li>
                <li>&quot;Macro tracking tips&quot;</li>
                <li>&quot;Meal plan for muscle gain&quot;</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-app mb-2">Progress</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>&quot;How to track progress?&quot;</li>
                <li>&quot;Setting fitness goals&quot;</li>
                <li>&quot;Staying motivated&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AICoachPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "setup">("chat");

  return (
    <div className="h-full bg-background">
      <div className="h-full max-w-6xl mx-auto flex flex-col">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-4 border-b border-border bg-card">
          <Button
            variant={activeTab === "chat" ? "primary" : "ghost"}
            onClick={() => setActiveTab("chat")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            AI Coach
          </Button>
          <Button
            variant={activeTab === "setup" ? "primary" : "ghost"}
            onClick={() => setActiveTab("setup")}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Setup & Info
          </Button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "chat" ? (
            <AICoachChat className="h-full" />
          ) : (
            <div className="h-full overflow-y-auto">
              <AISetup />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

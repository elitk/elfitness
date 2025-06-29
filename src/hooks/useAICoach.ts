"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage, ChatState } from "@/lib/types";

interface SystemStatus {
  ollamaConnected: boolean;
  toolsRegistered: number;
  contextCacheSize: number;
  toolExecutionStats: Record<string, unknown>;
}

interface AICoachState extends ChatState {
  systemStatus: SystemStatus;
}

const INITIAL_STATE: AICoachState = {
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI fitness coach. I can help you track workouts, plan nutrition, and achieve your fitness goals. This is currently running with mock data - you can ask me anything about fitness!",
      timestamp: new Date(),
    },
  ],
  isLoading: false,
  error: null,
  isConnected: true,
  systemStatus: {
    ollamaConnected: true,
    toolsRegistered: 5,
    contextCacheSize: 1024,
    toolExecutionStats: {
      workoutPlans: 12,
      nutritionAnalysis: 8,
      progressTracking: 15,
    },
  },
};

// Mock responses for different types of questions
const MOCK_RESPONSES = [
  {
    trigger: ["workout", "exercise", "training"],
    responses: [
      "Here's a great workout plan for you! 💪\n\n**Push Day Routine:**\n• Push-ups: 3 sets of 12-15 reps\n• Overhead Press: 3 sets of 8-10 reps\n• Tricep Dips: 3 sets of 10-12 reps\n• Plank: 3 sets of 30-45 seconds\n\nRemember to warm up before starting and cool down after!",
      "Let's focus on building strength! 🏋️‍♂️\n\n**Full Body Workout:**\n• Squats: 4 sets of 12 reps\n• Pull-ups/Rows: 3 sets of 8 reps\n• Lunges: 3 sets of 10 per leg\n• Deadlifts: 3 sets of 8 reps\n\nStart with bodyweight and progress gradually!",
      "Great question! Here's a quick HIIT routine:\n\n**15-Minute HIIT:**\n• Jumping Jacks: 45s work, 15s rest\n• Burpees: 45s work, 15s rest\n• Mountain Climbers: 45s work, 15s rest\n• High Knees: 45s work, 15s rest\n\nRepeat for 3 rounds!",
    ],
  },
  {
    trigger: ["nutrition", "diet", "food", "calories"],
    responses: [
      "Nutrition is key to reaching your goals! 🥗\n\n**Daily Nutrition Tips:**\n• Aim for 0.8-1g protein per lb bodyweight\n• Include vegetables in every meal\n• Stay hydrated (8-10 glasses of water)\n• Balance carbs around your workouts\n\nWhat specific nutrition goals are you working towards?",
      "Here's a balanced meal plan structure:\n\n**Breakfast:** Protein + Complex Carbs\n• Oatmeal with Greek yogurt and berries\n\n**Lunch:** Lean protein + Vegetables + Healthy fats\n• Grilled chicken salad with avocado\n\n**Dinner:** Similar to lunch but lighter carbs\n• Salmon with roasted vegetables\n\n**Snacks:** Protein-rich options\n• Greek yogurt, nuts, or protein smoothie",
      "Let's talk macro tracking! 📊\n\n**Macro Split for General Fitness:**\n• Protein: 25-30%\n• Carbohydrates: 40-45%\n• Fats: 25-30%\n\nAdjust based on your specific goals (weight loss, muscle gain, etc.)",
    ],
  },
  {
    trigger: ["progress", "track", "goals", "motivation"],
    responses: [
      "Tracking progress is essential! 📈\n\n**Ways to Measure Progress:**\n• Take body measurements monthly\n• Progress photos (same time, lighting, pose)\n• Strength improvements (reps, weight, duration)\n• Energy levels and sleep quality\n• How clothes fit\n\nRemember: the scale doesn't tell the whole story!",
      "Setting SMART goals is crucial! 🎯\n\n**SMART Goal Framework:**\n• Specific: What exactly do you want?\n• Measurable: How will you track it?\n• Achievable: Is it realistic?\n• Relevant: Does it align with your values?\n• Time-bound: When will you achieve it?\n\nWhat's your main fitness goal right now?",
      "Motivation comes and goes, but habits stick! 💪\n\n**Building Lasting Habits:**\n• Start small (5-10 minutes daily)\n• Stack habits (workout after morning coffee)\n• Track consistency, not perfection\n• Celebrate small wins\n• Find an accountability partner\n\nConsistency beats intensity every time!",
    ],
  },
];

const getRandomResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  // Find matching response category
  for (const category of MOCK_RESPONSES) {
    if (category.trigger.some((trigger) => lowerMessage.includes(trigger))) {
      const responses = category.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Default responses for general questions
  const generalResponses = [
    "That's a great question! I'm here to help you with your fitness journey. Whether you're looking for workout routines, nutrition advice, or motivation - just ask! 🌟",
    "I'd love to help you with that! As your AI fitness coach, I can assist with workouts, meal planning, goal setting, and staying motivated. What specific area would you like to focus on?",
    "Thanks for asking! I'm designed to be your personal fitness companion. I can help create workout plans, suggest healthy meals, track your progress, and keep you motivated. What's on your mind today?",
    "Great to chat with you! I'm here to support your health and fitness goals. Whether you need a quick workout, nutrition tips, or just some encouragement - I've got you covered! 💪",
  ];

  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

export const useAICoach = () => {
  const [state, setState] = useState<AICoachState>(INITIAL_STATE);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize system (mock)
  const initializeSystem = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Simulate initialization delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setState((prev) => ({
      ...prev,
      isLoading: false,
      isConnected: true,
      messages: [
        ...prev.messages,
        {
          id: `system-status-${Date.now()}`,
          role: "assistant",
          content:
            `🔧 System Status:\n` +
            `• AI Coach: ✅ Connected (Mock Mode)\n` +
            `• Tools Available: ${prev.systemStatus.toolsRegistered} tools\n` +
            `• Context Cache: ${Math.round(
              prev.systemStatus.contextCacheSize / 1024
            )}KB\n\n` +
            `I'm ready to help with your fitness journey! Try asking me about:\n` +
            `• "Create a workout routine for beginners"\n` +
            `• "What should I eat for muscle gain?"\n` +
            `• "How do I track my progress?"`,
          timestamp: new Date(),
        },
      ],
    }));
  }, []);

  // Send message (mock)
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || state.isLoading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      // Simulate AI response delay
      const delay = Math.random() * 2000 + 1000; // 1-3 seconds

      timeoutRef.current = setTimeout(() => {
        const response = getRandomResponse(message);

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));
      }, delay);
    },
    [state.isLoading]
  );

  // Get system status (mock)
  const refreshStatus = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      systemStatus: {
        ...prev.systemStatus,
        ollamaConnected: true,
        toolsRegistered: 5,
        contextCacheSize: Math.floor(Math.random() * 2048) + 512,
      },
      isConnected: true,
    }));
  }, []);

  // Get available tools (mock)
  const getAvailableTools = useCallback(async () => {
    return [
      {
        name: "workout_planner",
        description: "Creates personalized workout routines",
      },
      {
        name: "nutrition_analyzer",
        description: "Analyzes nutritional content and suggests meals",
      },
      {
        name: "progress_tracker",
        description: "Tracks fitness progress and goals",
      },
      {
        name: "exercise_library",
        description: "Provides exercise instructions and variations",
      },
      {
        name: "meal_planner",
        description: "Creates meal plans based on dietary preferences",
      },
    ];
  }, []);

  // Clear chat
  const clearChat = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState((prev) => ({
      ...prev,
      messages: [INITIAL_STATE.messages[0]],
      error: null,
      isLoading: false,
    }));
  }, []);

  // Cancel ongoing request
  const cancelRequest = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  return {
    // State
    ...state,

    // Actions
    initializeSystem,
    sendMessage,
    refreshStatus,
    getAvailableTools,
    clearChat,
    cancelRequest,
  };
};

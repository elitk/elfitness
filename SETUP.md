# Elfitness Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI API Key (for future AI features)
OPENAI_API_KEY=your_openai_api_key_here
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in test mode
   - Choose a location
5. Get your configuration:
   - Go to Project Settings
   - Scroll down to "Your apps"
   - Add a web app if you haven't already
   - Copy the configuration values to your `.env.local` file

## Firestore Security Rules

Update your Firestore security rules to allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own workouts
    match /workouts/{workoutId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Users can read/write their own nutrition entries
    match /nutrition/{entryId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Users can read/write their own conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features Implemented (Phase 1)

- ✅ Next.js project with TypeScript
- ✅ Tailwind CSS with custom design system
- ✅ Firebase configuration and integration
- ✅ Project folder structure and component library
- ✅ Firebase Authentication (email/password + Google OAuth)
- ✅ Responsive login/signup pages with modern UI
- ✅ Protected route middleware
- ✅ Error handling and loading states
- ✅ Environment variables configuration
- ✅ Basic dashboard with user information

## Next Steps

The application is now ready for Phase 2 development, which includes:
- Main dashboard layout with navigation
- User profile management
- Stats cards and progress tracking
- Advanced UI components
- Dark theme implementation 
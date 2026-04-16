
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AppProvider } from '@/lib/app-context';
import { ClientLayout } from '@/components/ods/client-layout';
import '@/app/globals.css';

// Import pages
import { HomePage } from '@/components/ods/home-page';
import { LoginPage } from '@/components/ods/login-page';
import { SignupPage } from '@/components/ods/signup-page';
import { ProfilePage } from '@/components/ods/profile-page';
import { ForumPage } from '@/components/ods/forum-page';
import { QuizPage } from '@/components/ods/quiz-page';
import { AccessibilityPage } from '@/components/ods/accessibility-page';
import { DonationsPage } from '@/components/ods/donations-page';
import { VideoPage } from '@/components/ods/video-page';

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppProvider>
            <ClientLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/accessibility" element={<AccessibilityPage />} />
                    <Route path="/donations" element={<DonationsPage />} />
                    <Route path="/video" element={<VideoPage />} />
                </Routes>
            </ClientLayout>
          </AppProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

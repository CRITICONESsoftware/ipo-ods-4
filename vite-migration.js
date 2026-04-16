const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Create vite.config.ts
const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Crucial para que funcione con file:///
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/link': path.resolve(__dirname, './src/next_mocks/link.tsx'),
      'next/image': path.resolve(__dirname, './src/next_mocks/image.tsx'),
      'next/navigation': path.resolve(__dirname, './src/next_mocks/navigation.tsx'),
      'next/font/google': path.resolve(__dirname, './src/next_mocks/font.ts')
    }
  }
})
`;
fs.writeFileSync('vite.config.ts', viteConfig);

// 2. Install dependencies (using execSync at the end)

// 3. Create mock files for next modules
fs.mkdirSync('./src/next_mocks', { recursive: true });

fs.writeFileSync('./src/next_mocks/link.tsx', `
import React from 'react';
import { Link } from 'react-router-dom';
export default function NextLink(props) {
  return <Link to={props.href} {...props} />;
}
`);

fs.writeFileSync('./src/next_mocks/image.tsx', `
import React from 'react';
export default function NextImage(props) {
  const { src, width, height, alt, ...rest } = props;
  return <img src={src} width={width} height={height} alt={alt} {...rest} />;
}
`);

fs.writeFileSync('./src/next_mocks/navigation.tsx', `
import { useNavigate } from 'react-router-dom';
export function useRouter() {
  const navigate = useNavigate();
  return { push: navigate, replace: navigate, prefetch: () => {} };
}
`);

fs.writeFileSync('./src/next_mocks/font.ts', `
export function Inter() {
  return { variable: 'inter_var' };
}
`);

// 4. Create App.tsx and main.tsx
fs.writeFileSync('./src/App.tsx', `
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
`);

fs.writeFileSync('./src/main.tsx', `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

// 5. Create index.html
fs.writeFileSync('index.html', `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="./icon.webp" />
    <title>ODS - Objetivos de Desarrollo Sostenible</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

// update Tailwind content
let tailwindConfig = fs.readFileSync('components.json', 'utf8');
console.log("Migration files created successfully!");

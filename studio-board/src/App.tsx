import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './styles/ThemeProvider';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AnimatedPage } from './components/layout/AnimatedPage';
import { Dashboard, Projects, Tasks, Calendar, Files, DesignSystemDemo, ChatDemo, ClientPortal, Settings } from './pages';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
        <Route path="/projects" element={<AnimatedPage><Projects /></AnimatedPage>} />
        <Route path="/projects/:projectId" element={<AnimatedPage><Projects /></AnimatedPage>} />
        <Route path="/tasks" element={<AnimatedPage><Tasks /></AnimatedPage>} />
        <Route path="/chat" element={<AnimatedPage><ChatDemo /></AnimatedPage>} />
        <Route path="/calendar" element={<AnimatedPage><Calendar /></AnimatedPage>} />
        <Route path="/files" element={<AnimatedPage><Files /></AnimatedPage>} />
        <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
        <Route path="/design-system" element={<AnimatedPage><DesignSystemDemo /></AnimatedPage>} />
        <Route path="/client/:projectId" element={<AnimatedPage><ClientPortal /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppShell header={<Header />} sidebar={<Sidebar />}>
          <AnimatedRoutes />
        </AppShell>
      </Router>
    </ThemeProvider>
  );
}

export default App;

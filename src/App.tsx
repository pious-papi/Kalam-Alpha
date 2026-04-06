import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  MessageSquare, 
  Menu, 
  Compass, 
  Library,
  Info,
  Moon,
  Sun,
  Clock,
  Calculator
} from 'lucide-react';
import Chat from './components/Chat';
import QuranExplorer from './components/QuranExplorer';
import HadithExplorer from './components/HadithExplorer';
import FiqhExplorer from './components/FiqhExplorer';
import PrayerTimes from './components/PrayerTimes';
import ZakatCalculator from './components/ZakatCalculator';

type Tab = 'assistant' | 'quran' | 'hadith' | 'fiqh' | 'prayer' | 'zakat' | 'about';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('assistant');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const navItems = [
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'quran', label: 'Quran Explorer', icon: Book },
    { id: 'hadith', label: 'Hadith Aggregator', icon: Library },
    { id: 'fiqh', label: 'Schools of Thought', icon: Compass },
    { id: 'prayer', label: 'Prayer Times', icon: Clock },
    { id: 'zakat', label: 'Zakat Calculator', icon: Calculator },
    { id: 'about', label: 'About Nur', icon: Info },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-islamic-cream dark:bg-dark-bg transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border transition-all duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-islamic-green rounded-xl flex items-center justify-center shadow-lg shadow-islamic-green/20">
              <Moon className="text-white w-6 h-6 fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Nur Guidance</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Neutral Islamic Aggregator</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-islamic-green text-white shadow-md shadow-islamic-green/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-dark-border">
            <div className="bg-islamic-gold/10 dark:bg-islamic-gold/5 rounded-xl p-4">
              <p className="text-xs text-islamic-gold font-bold uppercase tracking-wider mb-1">Daily Verse</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic">"Indeed, with hardship [will be] ease." (94:6)</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 dark:text-slate-400 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-dark-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-border transition-all"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-dark-bg rounded-full text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Neutral Mode Active
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'assistant' && <Chat />}
                {activeTab === 'quran' && <QuranExplorer />}
                {activeTab === 'hadith' && <HadithExplorer />}
                {activeTab === 'fiqh' && <FiqhExplorer />}
                {activeTab === 'prayer' && <PrayerTimes />}
                {activeTab === 'zakat' && <ZakatCalculator />}
                {activeTab === 'about' && (
                  <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-dark-border">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">About Nur Guidance</h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        Nur Guidance is designed to be a transparent, neutral, and comprehensive resource for Muslims seeking clarity on their faith. 
                        In a world of diverse interpretations, we aim to provide a central place where the Quran, Hadith, and the rich traditions of Islamic jurisprudence (Fiqh) can be explored side-by-side.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6 mt-8">
                        <div className="p-6 bg-islamic-green/5 rounded-2xl border border-islamic-green/10">
                          <h3 className="text-xl font-bold text-islamic-green mb-3">Our Mission</h3>
                          <p className="text-slate-600 dark:text-slate-400">To empower Muslims with knowledge by aggregating primary sources and presenting diverse scholarly views without bias.</p>
                        </div>
                        <div className="p-6 bg-islamic-gold/5 rounded-2xl border border-islamic-gold/10">
                          <h3 className="text-xl font-bold text-islamic-gold mb-3">Neutrality First</h3>
                          <p className="text-slate-600 dark:text-slate-400">We do not favor one school of thought over another. Our AI assistant is programmed to provide balanced perspectives from all major Madhahib.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

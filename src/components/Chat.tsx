import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SYSTEM_INSTRUCTION = `You are Nur, a highly knowledgeable and neutral Islamic AI assistant. 
Your goal is to provide guidance based on the Quran, Hadith, and the major schools of thought (Hanafi, Maliki, Shafi'i, Hanbali).

Key Principles:
1. Neutrality: Always present multiple scholarly views if they exist. Do not favor one Madhab over another unless explicitly asked for a specific one.
2. Primary Sources: Whenever possible, cite the Surah and Verse number for Quranic references, and the collection/number for Hadith.
3. Respect: Use respectful language.
4. Clarity: Explain complex concepts in simple terms.
5. Disclaimer: Always remind users that you are an AI and for serious legal (Fatwa) matters, they should consult a qualified local scholar.

If a user asks about a controversial topic, provide the consensus (if any) and then list the differing opinions of the major schools of thought in a balanced way.`;

export default function Chat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Assalamu Alaikum! I am Nur, your neutral Islamic guidance assistant. How can I help you explore the Quran, Hadith, or Fiqh today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Calling our backend API instead of frontend SDK directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          systemInstruction: SYSTEM_INSTRUCTION,
          modelChoice: 'gemini' // This can be made dynamic later
        })
      });

      if (!response.ok) throw new Error('Failed to fetch from backend');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting to the server. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden transition-colors duration-300">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-border flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-islamic-gold" />
          <span className="font-bold text-slate-700 dark:text-slate-200">Nur Assistant</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-dark-bg px-2 py-1 rounded-full border border-slate-100 dark:border-dark-border">
          Backend LLM Active
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200 dark:bg-dark-border' : 'bg-islamic-green/10 text-islamic-green'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 dark:text-slate-400" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-islamic-green text-white rounded-tr-none shadow-md shadow-islamic-green/20' 
                  : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-dark-border'
              }`}>
                <div className="markdown-body prose prose-sm max-w-none prose-p:leading-relaxed dark:prose-invert">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-islamic-green/10 text-islamic-green flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-dark-border">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-dark-border">
        <div className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Quran, Hadith, or Fiqh..."
            className="w-full pl-6 pr-14 py-4 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green transition-all shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-4 bg-islamic-green text-white rounded-xl hover:bg-islamic-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-3 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Nur is an AI. Always verify with primary sources and scholars for legal matters.
        </p>
      </div>
    </div>
  );
}

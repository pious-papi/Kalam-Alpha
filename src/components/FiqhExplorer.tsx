import { useState } from 'react';
import { Compass, Info, ChevronRight, ChevronDown, Scale, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FiqhTopic {
  id: string;
  title: string;
  description: string;
  schools: {
    hanafi: string;
    maliki: string;
    shafii: string;
    hanbali: string;
  };
}

const FIQH_TOPICS: FiqhTopic[] = [
  {
    id: 'wudu-bleeding',
    title: 'Does bleeding break Wudu?',
    description: 'The ruling on whether physical bleeding (from a cut or wound) invalidates the state of ritual purity (Wudu).',
    schools: {
      hanafi: "Bleeding breaks Wudu if it flows from the point of exit.",
      maliki: "Bleeding does not break Wudu, regardless of the amount.",
      shafii: "Bleeding does not break Wudu, unless it comes from the two private exits.",
      hanbali: "A large amount of bleeding breaks Wudu; a small amount does not."
    }
  },
  {
    id: 'wudu-touching',
    title: 'Does touching the opposite gender break Wudu?',
    description: 'The ruling on physical contact with a person of the opposite gender who is not a Mahram.',
    schools: {
      hanafi: "Touching does not break Wudu unless it is with sexual desire.",
      maliki: "Touching breaks Wudu if it is done with sexual pleasure or the intention of it.",
      shafii: "Any skin-to-skin contact with a non-Mahram of the opposite gender breaks Wudu.",
      hanbali: "Touching breaks Wudu if it is done with sexual desire."
    }
  },
  {
    id: 'prayer-hands',
    title: 'Position of hands in Salah',
    description: 'Where to place the hands during the standing position (Qiyam) in prayer.',
    schools: {
      hanafi: "Below the navel.",
      maliki: "Hands should be left at the sides (Sadal), though folding them is also permitted in Nafila prayers.",
      shafii: "Between the chest and the navel, slightly to the left.",
      hanbali: "Below the navel (similar to Hanafi) or on the chest."
    }
  },
  {
    id: 'prayer-amin',
    title: 'Saying "Amin" aloud in Salah',
    description: 'The ruling on whether the congregation should say "Amin" aloud after Surah Al-Fatiha in audible prayers.',
    schools: {
      hanafi: "Amin should be said silently by both the Imam and the congregation.",
      maliki: "The Imam says it silently; the congregation says it silently.",
      shafii: "Amin should be said aloud by both the Imam and the congregation.",
      hanbali: "Amin should be said aloud by both the Imam and the congregation."
    }
  }
];

export default function FiqhExplorer() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-dark-border transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Schools of Thought (Fiqh)</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">A neutral comparison of the four major Sunni Madhahib.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-islamic-green/10 text-islamic-green rounded-xl text-sm font-bold uppercase tracking-wider">
            <Scale className="w-5 h-5" />
            Neutral Comparison
          </div>
        </div>

        <div className="space-y-4">
          {FIQH_TOPICS.map((topic) => (
            <div 
              key={topic.id} 
              className={`border border-slate-100 dark:border-dark-border rounded-2xl overflow-hidden transition-all ${
                expandedTopic === topic.id ? 'shadow-md border-islamic-green/20' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <button
                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    expandedTopic === topic.id ? 'bg-islamic-green text-white' : 'bg-slate-100 dark:bg-dark-bg text-slate-400 dark:text-slate-500'
                  }`}>
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{topic.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{topic.description}</p>
                  </div>
                </div>
                {expandedTopic === topic.id ? <ChevronDown className="w-6 h-6 text-slate-400" /> : <ChevronRight className="w-6 h-6 text-slate-400" />}
              </button>

              <AnimatePresence>
                {expandedTopic === topic.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-50 dark:border-dark-border/50 bg-slate-50/50 dark:bg-white/5"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-white dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm">
                        <h4 className="text-xs font-bold text-islamic-green uppercase tracking-widest mb-3">Hanafi</h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{topic.schools.hanafi}</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm">
                        <h4 className="text-xs font-bold text-islamic-gold uppercase tracking-widest mb-3">Maliki</h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{topic.schools.maliki}</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm">
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Shafi'i</h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{topic.schools.shafii}</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm">
                        <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Hanbali</h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{topic.schools.hanbali}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-dark-card text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-white/5">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-islamic-gold" />
            <h3 className="text-xl font-bold">Understanding Fiqh</h3>
          </div>
          <p className="text-slate-300 dark:text-slate-400 leading-relaxed mb-6">
            Differences in Fiqh (jurisprudence) are considered a mercy in Islam. These differences arise from different methodologies in interpreting the Quran and Sunnah. 
            All four major schools are considered valid and part of the mainstream (Ahl al-Sunnah wa al-Jama'ah).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="block text-islamic-gold font-bold mb-1">Imam Abu Hanifa</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Kufa, 80-150 AH</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="block text-islamic-gold font-bold mb-1">Imam Malik</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Medina, 93-179 AH</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="block text-islamic-gold font-bold mb-1">Imam Al-Shafi'i</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Gaza/Egypt, 150-204 AH</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="block text-islamic-gold font-bold mb-1">Imam Ahmad</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Baghdad, 164-241 AH</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-islamic-green/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

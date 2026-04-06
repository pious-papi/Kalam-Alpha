import { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronRight, ChevronLeft, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export default function QuranExplorer() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      setSurahs(data.data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    }
  };

  const fetchAyahs = async (surahNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      const data = await response.json();
      setAyahs(data.data.ayahs);
      setSelectedSurah(surahNumber);
    } catch (error) {
      console.error('Error fetching ayahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-dark-border transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Quran Explorer</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Read and explore the Holy Quran with translations.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green transition-all"
            />
          </div>
        </div>

        {!selectedSurah ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah) => (
              <motion.button
                key={surah.number}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => fetchAyahs(surah.number)}
                className="p-5 bg-white dark:bg-dark-bg/50 border border-slate-100 dark:border-dark-border rounded-2xl text-left hover:shadow-md hover:border-islamic-green/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 bg-islamic-green/10 text-islamic-green font-bold rounded-xl flex items-center justify-center group-hover:bg-islamic-green group-hover:text-white transition-colors">
                    {surah.number}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{surah.revelationType}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{surah.englishName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{surah.englishNameTranslation}</p>
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>{surah.numberOfAyahs} Verses</span>
                  <div className="arabic-text text-xl text-slate-900 dark:text-slate-200">{surah.name}</div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedSurah(null)}
              className="flex items-center gap-2 text-islamic-green font-bold hover:gap-3 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Surahs
            </button>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-islamic-green animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading Surah {surahs.find(s => s.number === selectedSurah)?.englishName}...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center py-10 bg-islamic-green/5 dark:bg-islamic-green/10 rounded-3xl border border-islamic-green/10 dark:border-islamic-green/20">
                  <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{surahs.find(s => s.number === selectedSurah)?.englishName}</h3>
                  <p className="text-islamic-green font-medium mb-6">{surahs.find(s => s.number === selectedSurah)?.englishNameTranslation}</p>
                  <div className="arabic-text text-5xl text-slate-900 dark:text-slate-100 mb-4">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
                </div>

                <div className="space-y-6">
                  {ayahs.map((ayah) => (
                    <div key={ayah.number} className="p-8 bg-white dark:bg-dark-bg/50 border border-slate-100 dark:border-dark-border rounded-3xl hover:border-islamic-green/20 transition-all group">
                      <div className="flex items-start justify-between gap-6 mb-6">
                        <span className="w-8 h-8 bg-slate-100 dark:bg-dark-border text-slate-500 dark:text-slate-400 text-xs font-bold rounded-lg flex items-center justify-center shrink-0">
                          {ayah.numberInSurah}
                        </span>
                        <div className="arabic-text text-3xl leading-relaxed text-right text-slate-900 dark:text-slate-100 flex-1">
                          {ayah.text}
                        </div>
                      </div>
                      <div className="pt-6 border-t border-slate-50 dark:border-dark-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="text-xs font-bold text-slate-400 hover:text-islamic-green transition-colors uppercase tracking-widest">Share</button>
                          <button className="text-xs font-bold text-slate-400 hover:text-islamic-green transition-colors uppercase tracking-widest">Copy</button>
                        </div>
                        <div className="text-[10px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest">
                          Juz {ayah.juz} • Page {ayah.page}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-islamic-gold/5 dark:bg-islamic-gold/10 border border-islamic-gold/20 dark:border-islamic-gold/30 rounded-2xl p-6 flex items-start gap-4">
        <Info className="w-6 h-6 text-islamic-gold shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-islamic-gold mb-1">Translation Note</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">The Arabic text is the primary source. Translations are interpretations and may vary. We recommend comparing multiple translations for deeper understanding.</p>
        </div>
      </div>
    </div>
  );
}

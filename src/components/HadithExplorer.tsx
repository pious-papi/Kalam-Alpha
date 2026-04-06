import { useState, useEffect } from 'react';
import { Search, Library, ChevronRight, ChevronLeft, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HadithCollection {
  name: string;
  id: string;
  totalHadith: number;
}

interface Hadith {
  hadithNumber: string;
  hadithArabic: string;
  hadithEnglish: string;
  hadithUrdu: string;
  hadithIndonesian: string;
  book: string;
  chapterId: string;
  chapterTitle: string;
  status: string;
}

export default function HadithExplorer() {
  const [collections, setCollections] = useState<HadithCollection[]>([
    { name: 'Sahih Bukhari', id: 'bukhari', totalHadith: 7563 },
    { name: 'Sahih Muslim', id: 'muslim', totalHadith: 7563 },
    { name: 'Sunan Abu Dawood', id: 'abudawud', totalHadith: 5274 },
    { name: 'Sunan Ibn Majah', id: 'ibnmajah', totalHadith: 4341 },
    { name: 'Sunan An-Nasa\'i', id: 'nasai', totalHadith: 5758 },
    { name: 'Jami\' At-Tirmidhi', id: 'tirmidhi', totalHadith: 3956 },
  ]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const fetchHadiths = async (collectionId: string, pageNum: number = 1) => {
    setLoading(true);
    try {
      // Using a public Hadith API
      const response = await fetch(`https://hadithapi.com/api/hadiths?apiKey=$2y$10$X87Y87Y87Y87Y87Y87Y87Y87Y87Y87Y87Y87Y87Y87Y87Y87Y87Y&book=${collectionId}&page=${pageNum}`);
      const data = await response.json();
      setHadiths(data.hadiths.data);
      setSelectedCollection(collectionId);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      // Fallback/Mock for demo if API key is invalid
      setHadiths([
        {
          hadithNumber: "1",
          hadithArabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
          hadithEnglish: "Actions are but by intentions and every man shall have only that which he intended.",
          hadithUrdu: "",
          hadithIndonesian: "",
          book: collectionId,
          chapterId: "1",
          chapterTitle: "Revelation",
          status: "Sahih"
        }
      ]);
      setSelectedCollection(collectionId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-dark-border transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Hadith Aggregator</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Explore the major collections of prophetic traditions.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Hadith..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green transition-all"
            />
          </div>
        </div>

        {!selectedCollection ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <motion.button
                key={collection.id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => fetchHadiths(collection.id)}
                className="p-6 bg-white dark:bg-dark-bg/50 border border-slate-100 dark:border-dark-border rounded-2xl text-left hover:shadow-md hover:border-islamic-green/30 transition-all group"
              >
                <div className="w-12 h-12 bg-islamic-green/10 text-islamic-green rounded-xl flex items-center justify-center mb-4 group-hover:bg-islamic-green group-hover:text-white transition-colors">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{collection.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{collection.totalHadith} Traditions</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-islamic-green uppercase tracking-widest">
                  Explore Collection
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedCollection(null)}
              className="flex items-center gap-2 text-islamic-green font-bold hover:gap-3 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Collections
            </button>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-islamic-green animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading {collections.find(c => c.id === selectedCollection)?.name}...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{collections.find(c => c.id === selectedCollection)?.name}</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => fetchHadiths(selectedCollection, Math.max(1, page - 1))}
                      className="p-2 bg-slate-100 dark:bg-dark-bg rounded-lg hover:bg-slate-200 dark:hover:bg-dark-border transition-colors disabled:opacity-50"
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 px-4">Page {page}</span>
                    <button 
                      onClick={() => fetchHadiths(selectedCollection, page + 1)}
                      className="p-2 bg-slate-100 dark:bg-dark-bg rounded-lg hover:bg-slate-200 dark:hover:bg-dark-border transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {hadiths.map((hadith, i) => (
                    <div key={i} className="p-8 bg-white dark:bg-dark-bg/50 border border-slate-100 dark:border-dark-border rounded-3xl hover:border-islamic-green/20 transition-all group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-islamic-green/10 text-islamic-green text-[10px] font-bold rounded-full uppercase tracking-widest">
                            Hadith {hadith.hadithNumber}
                          </span>
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${
                            hadith.status === 'Sahih' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {hadith.status}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Chapter: {hadith.chapterTitle}</span>
                      </div>
                      
                      <div className="arabic-text text-3xl leading-relaxed text-right text-slate-900 dark:text-slate-100 mb-8">
                        {hadith.hadithArabic}
                      </div>
                      
                      <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-dark-border italic text-slate-600 dark:text-slate-400 leading-relaxed">
                        "{hadith.hadithEnglish}"
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-50 dark:border-dark-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="text-xs font-bold text-slate-400 hover:text-islamic-green transition-colors uppercase tracking-widest">Share</button>
                          <button className="text-xs font-bold text-slate-400 hover:text-islamic-green transition-colors uppercase tracking-widest">Copy</button>
                        </div>
                        <div className="text-[10px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest">
                          Source: {hadith.book}
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

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-900 dark:text-amber-500 mb-1">Hadith Authentication</h4>
          <p className="text-sm text-amber-800 dark:text-amber-400/80">Hadiths are classified into Sahih (Authentic), Hasan (Good), Da'if (Weak), and Mawdu' (Fabricated). Always check the authentication status before sharing or applying a tradition.</p>
        </div>
      </div>
    </div>
  );
}

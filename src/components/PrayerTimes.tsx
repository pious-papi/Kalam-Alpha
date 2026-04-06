import { useState, useEffect } from 'react';
import { Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';

interface PrayerTimesData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
}

export default function PrayerTimes() {
  const [times, setTimes] = useState<PrayerTimesData | null>(null);
  const [location, setLocation] = useState<string>('Detecting...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
          const data = await response.json();
          setTimes(data.data.timings);
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        } catch (err) {
          setError("Failed to fetch prayer times");
        } finally {
          setLoading(false);
        }
      }, (err) => {
        setError("Location access denied. Using default (London).");
        fetchDefaultTimes();
      });
    } else {
      fetchDefaultTimes();
    }
  }, []);

  const fetchDefaultTimes = async () => {
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=London&country=UK&method=2`);
      const data = await response.json();
      setTimes(data.data.timings);
      setLocation('London, UK (Default)');
    } catch (err) {
      setError("Failed to fetch prayer times");
    } finally {
      setLoading(false);
    }
  };

  const prayerIcons = [
    { name: 'Fajr', time: times?.Fajr },
    { name: 'Sunrise', time: times?.Sunrise },
    { name: 'Dhuhr', time: times?.Dhuhr },
    { name: 'Asr', time: times?.Asr },
    { name: 'Maghrib', time: times?.Maghrib },
    { name: 'Isha', time: times?.Isha },
  ];

  return (
    <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-dark-border transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Prayer Times</h2>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
        <div className="px-4 py-2 bg-islamic-green/10 text-islamic-green rounded-xl text-sm font-bold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-islamic-green animate-spin mb-4" />
          <p className="text-slate-500">Calculating timings...</p>
        </div>
      ) : error && !times ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-4 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {prayerIcons.map((prayer) => (
            <div 
              key={prayer.name}
              className="p-6 bg-slate-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-dark-border rounded-2xl text-center hover:border-islamic-green/30 transition-all group"
            >
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 group-hover:text-islamic-green transition-colors">
                {prayer.name}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {prayer.time}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-islamic-green/5 dark:bg-islamic-green/10 rounded-2xl border border-islamic-green/10 dark:border-islamic-green/20">
        <p className="text-sm text-slate-600 dark:text-slate-400 italic text-center">
          "Prayer has been enjoined upon the believers at fixed times." (Quran 4:103)
        </p>
      </div>
    </div>
  );
}

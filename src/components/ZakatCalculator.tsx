import { useState, useEffect } from 'react';
import { Calculator, Info, DollarSign, Scale, AlertCircle } from 'lucide-react';

export default function ZakatCalculator() {
  const [goldPrice, setGoldPrice] = useState<number>(65); // Default gold price per gram
  const [silverPrice, setSilverPrice] = useState<number>(0.8); // Default silver price per gram
  const [assets, setAssets] = useState({
    cash: 0,
    gold: 0,
    silver: 0,
    investments: 0,
    business: 0,
    debts: 0,
  });

  const nisabGold = goldPrice * 87.48;
  const nisabSilver = silverPrice * 612.36;
  const nisab = Math.min(nisabGold, nisabSilver); // Usually silver is lower

  const totalAssets = assets.cash + assets.gold + assets.silver + assets.investments + assets.business;
  const netAssets = Math.max(0, totalAssets - assets.debts);
  const zakatDue = netAssets >= nisab ? netAssets * 0.025 : 0;

  useEffect(() => {
    // Fetch current gold/silver prices for more accuracy
    const fetchPrices = async () => {
      try {
        // Using a public API for demo purposes
        const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=YOUR_API_KEY&base=USD&currencies=XAU,XAG');
        const data = await response.json();
        if (data.rates) {
          setGoldPrice(1 / data.rates.XAU / 31.1035); // Convert Oz to Gram
          setSilverPrice(1 / data.rates.XAG / 31.1035);
        }
      } catch (err) {
        console.error("Failed to fetch current metal prices, using defaults.");
      }
    };
    fetchPrices();
  }, []);

  const handleChange = (field: keyof typeof assets, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAssets(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-dark-border transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Zakat Calculator</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Calculate your annual Zakat (2.5% of net wealth).</p>
          </div>
          <div className="px-4 py-2 bg-islamic-gold/10 text-islamic-gold rounded-xl text-sm font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Nisab: ${nisab.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-widest">Cash & Savings</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={assets.cash || ''}
                  onChange={(e) => handleChange('cash', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-widest">Gold & Silver Value</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={assets.gold || ''}
                  onChange={(e) => handleChange('gold', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-widest">Investments & Business Assets</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={assets.investments || ''}
                  onChange={(e) => handleChange('investments', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-widest text-red-500">Liabilities & Debts</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300 w-4 h-4" />
                <input
                  type="number"
                  value={assets.debts || ''}
                  onChange={(e) => handleChange('debts', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-red-50 dark:bg-red-900/5 border border-red-100 dark:border-red-900/20 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="p-8 bg-islamic-green/5 dark:bg-islamic-green/10 rounded-3xl border border-islamic-green/10 dark:border-islamic-green/20 text-center">
              <p className="text-sm font-bold text-islamic-green uppercase tracking-widest mb-2">Total Zakat Due</p>
              <p className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
                ${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Scale className="w-4 h-4" />
                {netAssets >= nisab ? 'You are above Nisab threshold' : 'You are below Nisab threshold'}
              </div>
            </div>
            
            <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-dark-border">
              <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Zakat is calculated based on wealth held for one lunar year (Hawl). This calculator provides an estimate. For complex cases, please consult a scholar.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-islamic-gold/5 dark:bg-islamic-gold/10 border border-islamic-gold/20 dark:border-islamic-gold/30 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-islamic-gold shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-islamic-gold mb-1">Zakat Note</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">Zakat is one of the Five Pillars of Islam. It is a mandatory charitable contribution, often considered to be a tax. It is the right of the poor and needy in the wealth of the rich.</p>
        </div>
      </div>
    </div>
  );
}

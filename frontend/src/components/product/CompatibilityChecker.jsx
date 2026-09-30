import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { RiMotorbikeFill } from 'react-icons/ri';

const bikeData = {
  'Royal Enfield': [
    'Classic 350',
    'Hunter 350',
    'Meteor 350',
    'Himalayan 450',
    'Guerrilla 450',
    'Interceptor 650',
    'Continental GT 650',
    'Super Meteor 650',
    'Shotgun 650',
    'Scram 411',
    'Bullet 350',
  ],
  'KTM': [
    'Duke 125',
    'Duke 200',
    'Duke 250',
    'Duke 390',
    'RC 125',
    'RC 200',
    'RC 390',
    'Adventure 250',
    'Adventure 390',
  ],
  'Yamaha': [
    'YZF R15 V4',
    'YZF R15 V3',
    'MT-15 V2',
    'FZ-S FI V4',
    'FZ-X',
    'Aerox 155',
    'R3',
  ],
  'Bajaj': [
    'Pulsar NS200',
    'Pulsar NS400Z',
    'Pulsar RS200',
    'Pulsar N250',
    'Pulsar 150',
    'Dominar 400',
    'Dominar 250',
  ],
  'TVS': [
    'Apache RR 310',
    'Apache RTR 310',
    'Apache RTR 200 4V',
    'Apache RTR 160 4V',
    'Ronin 225',
    'Raider 125',
  ],
  'BMW Motorrad': [
    'G 310 R',
    'G 310 GS',
    'G 310 RR',
    'S 1000 RR',
    'R 1250 GS',
  ],
  'Honda': [
    'CB350 H\'ness',
    'CB350RS',
    'CB300R',
    'Hornet 2.0',
    'CBR 650R',
    'Transalp 750',
  ],
  'Kawasaki': [
    'Ninja 300',
    'Ninja 400',
    'Ninja 500',
    'Ninja ZX-4R',
    'Ninja ZX-6R',
    'Z650',
    'Z900',
  ],
  'Ducati': [
    'Panigale V2',
    'Monster 937',
    'Scrambler 800',
    'Multistrada V4',
  ],
  'Triumph': [
    'Speed 400',
    'Scrambler 400 X',
    'Street Triple 765',
    'Tiger 900',
  ],
  'Jawa': [
    'Jawa 42',
    'Jawa 350',
    'Jawa Perak',
  ],
  'Yezdi': [
    'Yezdi Roadster',
    'Yezdi Adventure',
    'Yezdi Scrambler',
  ],
  'Suzuki': [
    'Gixxer SF 250',
    'Gixxer 250',
    'Gixxer 150',
    'V-Strom SX 250',
    'Hayabusa',
  ],
  'Harley Davidson': [
    'X440',
    'Nightster',
    'Sportster S',
  ],
};

const bikeBrandsList = Object.keys(bikeData);

export const CompatibilityChecker = ({ product }) => {
  const navigate = useNavigate();

  // Bike selection state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [checkStatus, setCheckStatus] = useState('idle'); // 'idle' | 'compatible' | 'incompatible'

  // Model list based on selected brand
  const modelOptions = selectedBrand ? bikeData[selectedBrand] || [] : [];

  // Re-check compatibility whenever selection or product changes
  useEffect(() => {
    if (!selectedBrand || !selectedModel) {
      setCheckStatus('idle');
      return;
    }

    if (!product) return;

    // Check brand match
    const prodBrands = (product.bikeBrands || []).map((b) => b.toLowerCase());
    const prodModels = (product.bikeModels || []).map((m) => m.toLowerCase());

    const brandMatched =
      prodBrands.length === 0 ||
      prodBrands.some((b) => b.includes(selectedBrand.toLowerCase()) || selectedBrand.toLowerCase().includes(b));

    const modelMatched =
      prodModels.length === 0 ||
      prodModels.some((m) => {
        const sel = selectedModel.toLowerCase();
        return sel.includes(m) || m.includes(sel);
      });

    if (brandMatched && modelMatched) {
      setCheckStatus('compatible');
    } else {
      setCheckStatus('incompatible');
    }
  }, [selectedBrand, selectedModel, product]);

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setSelectedBrand(newBrand);
    setSelectedModel('');
    setCheckStatus('idle');
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleBrowseCompatible = () => {
    const bikeSlug = selectedBrand.toLowerCase().replace(/\s+/g, '-');
    const modelSlug = selectedModel.toLowerCase().replace(/\s+/g, '-');
    navigate(`/shop?bike=${bikeSlug}&model=${modelSlug}`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-200/60">
          <RiMotorbikeFill className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Check Compatibility With Your Bike
          </h3>
          <p className="text-xs text-slate-500">
            Select your motorcycle to verify whether this product fits.
          </p>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {/* Brand Dropdown */}
        <div className="relative">
          <label htmlFor="compat-brand-select" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Motorcycle Brand
          </label>
          <div className="relative">
            <select
              id="compat-brand-select"
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:bg-white text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              <option value="">Select Brand</option>
              {bikeBrandsList.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Model Dropdown */}
        <div className="relative">
          <label htmlFor="compat-model-select" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Motorcycle Model
          </label>
          <div className="relative">
            <select
              id="compat-model-select"
              disabled={!selectedBrand}
              value={selectedModel}
              onChange={handleModelChange}
              className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:bg-white text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedBrand ? 'Select Model' : 'Choose Brand First'}
              </option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Dynamic Status Output Box */}
      <div className="mt-4">
        {checkStatus === 'idle' && (
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
            <span>Select your motorcycle brand and model above to verify fitment.</span>
          </div>
        )}

        {checkStatus === 'compatible' && (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 transition-all animate-fadeIn">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                  ✓ Compatible Fitment
                </span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                  Verified Fit
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                This product is guaranteed to fit your{' '}
                <strong className="font-bold text-emerald-900">
                  {selectedBrand} {selectedModel}
                </strong>{' '}
                with direct OEM bolt-on installation.
              </p>
            </div>
          </div>
        )}

        {checkStatus === 'incompatible' && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all animate-fadeIn">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-rose-800 uppercase tracking-wider">
                  ! Not Compatible
                </span>
                <p className="text-xs text-rose-700 font-medium mt-0.5">
                  This product is not listed for{' '}
                  <strong className="font-bold text-rose-900">
                    {selectedBrand} {selectedModel}
                  </strong>
                  .
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBrowseCompatible}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors shrink-0"
            >
              <span>Browse Compatible</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompatibilityChecker;

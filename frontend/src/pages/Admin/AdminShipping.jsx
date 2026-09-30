import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  DollarSign,
  Package,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Download
} from 'lucide-react';

export const AdminShipping = () => {
  const [activeTab, setActiveTab] = useState('methods'); // 'methods' | 'zones' | 'shipments'
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);

  // Shipping Methods State
  const [shippingMethods, setShippingMethods] = useState([
    {
      id: 'SM-01',
      name: 'Standard Surface Rider Delivery',
      provider: 'Delhivery / Bluedart',
      charge: 99,
      freeAbove: 999,
      estDays: '3-5 Business Days',
      status: 'Active',
      type: 'Surface'
    },
    {
      id: 'SM-02',
      name: 'Express Air Priority Dispatch',
      provider: 'BlueDart Air',
      charge: 249,
      freeAbove: 2999,
      estDays: '1-2 Business Days',
      status: 'Active',
      type: 'Air'
    },
    {
      id: 'SM-03',
      name: 'Same Day Metro Track Delivery',
      provider: 'Shadowfax / Porter',
      charge: 399,
      freeAbove: 4999,
      estDays: 'Same Day (Orders before 2PM)',
      status: 'Active',
      type: 'Hyperlocal'
    },
    {
      id: 'SM-04',
      name: 'Heavy Bike Parts Freight',
      provider: 'Safexpress',
      charge: 599,
      freeAbove: 9999,
      estDays: '5-7 Business Days',
      status: 'Active',
      type: 'Heavy Cargo'
    }
  ]);

  // Delivery Zones
  const [zones, setZones] = useState([
    { id: 'Z-1', name: 'Metro Tier-1 Cities', pincodes: '110001-110099, 400001-400099, 560001-560099, 600001-600099', surcharge: 0, active: true },
    { id: 'Z-2', name: 'Tier-2 & Regional Hubs', pincodes: '302001-302039, 411001-411062, 500001-500095', surcharge: 50, active: true },
    { id: 'Z-3', name: 'Hilly & Remote Mountain Zones (Ladakh, NE)', pincodes: '194101-194105, 793001-793020', surcharge: 250, active: true },
  ]);

  // Live Shipments Tracker
  const [shipments, setShipments] = useState([
    { id: 'SHP-8821', orderId: 'SP-9201', customer: 'Rohit Sharma', courier: 'Delhivery', trackingNumber: 'DEL992817263', status: 'In Transit', origin: 'RU BIKER WORLD Hub Pune', destination: 'Mumbai 400050', date: '28 Sep 2026' },
    { id: 'SHP-8820', orderId: 'SP-9195', customer: 'Aarav Patel', courier: 'BlueDart Air', trackingNumber: 'BLU773821094', status: 'Out for Delivery', origin: 'RU BIKER WORLD Hub Delhi', destination: 'Gurgaon 122001', date: '28 Sep 2026' },
    { id: 'SHP-8819', orderId: 'SP-9188', customer: 'Vikramaditya Rao', courier: 'Shadowfax', trackingNumber: 'SFX112093845', status: 'Delivered', origin: 'RU BIKER WORLD Hub Bangalore', destination: 'Bangalore 560034', date: '27 Sep 2026' },
    { id: 'SHP-8818', orderId: 'SP-9182', customer: 'Neha Sen', courier: 'Delhivery', trackingNumber: 'DEL554091823', status: 'Ready to Ship', origin: 'RU BIKER WORLD Hub Pune', destination: 'Kolkata 700029', date: '28 Sep 2026' },
  ]);

  const [newMethod, setNewMethod] = useState({
    name: '',
    provider: 'Delhivery',
    charge: 99,
    freeAbove: 999,
    estDays: '2-4 Days',
    type: 'Surface'
  });

  const handleAddMethod = (e) => {
    e.preventDefault();
    if (!newMethod.name) return;
    const methodObj = {
      id: `SM-0${shippingMethods.length + 1}`,
      ...newMethod,
      status: 'Active'
    };
    setShippingMethods([methodObj, ...shippingMethods]);
    setShowAddMethodModal(false);
    setNewMethod({ name: '', provider: 'Delhivery', charge: 99, freeAbove: 999, estDays: '2-4 Days', type: 'Surface' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Out for Delivery':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'In Transit':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60"><Clock className="w-3 h-3" /> In Transit</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"><Package className="w-3 h-3" /> {status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider border border-amber-200/60">
              Store Management
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Logistics & Courier Routing</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-amber-500" />
            Shipping & Delivery Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage delivery tiers, pincode serviceable zones, freight rates, and live courier tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddMethodModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Add Shipping Tier
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Shipping Tiers</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{shippingMethods.length} Methods</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Surface, Air, & Hyperlocal enabled</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Free Shipping Threshold</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹999+</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Applied on 64% of total orders</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Serviceable Pincodes</span>
            <MapPin className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">19,400+</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">All India coverage via Delhivery</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Delivery SLA</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">2.8 Days</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">98.4% On-time dispatch rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('methods')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'methods'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Shipping Methods & Rates ({shippingMethods.length})
        </button>
        <button
          onClick={() => setActiveTab('shipments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'shipments'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Live Consignment Tracker ({shipments.length})
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'zones'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Pincode & Delivery Zones ({zones.length})
        </button>
      </div>

      {/* TAB 1: SHIPPING METHODS */}
      {activeTab === 'methods' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Configured Carrier Tiers</h2>
            <span className="text-xs text-slate-400 font-medium">Automatic fallback & rate calculator</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="py-3 px-4">Method & Tier Name</th>
                  <th className="py-3 px-4">Courier Partner</th>
                  <th className="py-3 px-4">Delivery SLA</th>
                  <th className="py-3 px-4">Standard Rate</th>
                  <th className="py-3 px-4">Free Shipping Condition</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {shippingMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                          <Truck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-slate-900 font-bold">{method.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{method.type} Mode • ID: {method.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{method.provider}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{method.estDays}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">₹{method.charge}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                        Free on ₹{method.freeAbove}+
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShippingMethods(shippingMethods.filter(m => m.id !== method.id))}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE SHIPMENTS */}
      {activeTab === 'shipments' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-sm font-black text-slate-900">Active Consignments & Tracking</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tracking no or order..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="py-3 px-4">Shipment ID</th>
                  <th className="py-3 px-4">Order ID & Customer</th>
                  <th className="py-3 px-4">Courier & AWB Number</th>
                  <th className="py-3 px-4">Origin Hub & Destination</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{s.orderId}</div>
                      <div className="text-[11px] text-slate-400">{s.customer}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{s.courier}</div>
                      <div className="font-mono text-[11px] text-amber-600">{s.trackingNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{s.destination}</div>
                      <div className="text-[10px] text-slate-400">via {s.origin}</div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(s.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 ml-auto">
                        <ExternalLink className="w-3 h-3" /> Track AWB
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ZONES */}
      {activeTab === 'zones' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Regional Delivery Zones</h2>
              <p className="text-xs text-slate-500">Configure zone-based surcharges for remote and mountain sectors.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <div key={zone.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-900">{zone.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Active</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700">Pincode Ranges:</span>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5 bg-white p-2 rounded border border-slate-200">
                    {zone.pincodes}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Surcharge:</span>
                  <span className="font-bold text-slate-900">{zone.surcharge === 0 ? 'Free (Standard)' : `+₹${zone.surcharge}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Shipping Method Modal */}
      {showAddMethodModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Add New Shipping Carrier Tier</h3>
            
            <form onSubmit={handleAddMethod} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priority Overnight Bike Parts"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Courier Partner</label>
                  <select
                    value={newMethod.provider}
                    onChange={(e) => setNewMethod({ ...newMethod, provider: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option>Delhivery</option>
                    <option>BlueDart</option>
                    <option>Shadowfax</option>
                    <option>Safexpress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery SLA</label>
                  <input
                    type="text"
                    value={newMethod.estDays}
                    onChange={(e) => setNewMethod({ ...newMethod, estDays: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shipping Fee (₹)</label>
                  <input
                    type="number"
                    value={newMethod.charge}
                    onChange={(e) => setNewMethod({ ...newMethod, charge: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Free Shipping Above (₹)</label>
                  <input
                    type="number"
                    value={newMethod.freeAbove}
                    onChange={(e) => setNewMethod({ ...newMethod, freeAbove: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMethodModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipping;

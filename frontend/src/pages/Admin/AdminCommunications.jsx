import React, { useState } from 'react';
import {
  Mail,
  Bell,
  MessageSquare,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Eye,
  Filter,
  Layers
} from 'lucide-react';

export const AdminCommunications = () => {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'broadcast' | 'segments'
  const [sentSuccess, setSentSuccess] = useState(false);

  // Email & Notification Templates
  const [templates, setTemplates] = useState([
    {
      id: 'TMP-01',
      name: 'Order Confirmation & Dispatch',
      type: 'Transactional Email',
      subject: 'Your RU BIKER Rider Order #{{order_id}} is Confirmed! 🏍️',
      channel: 'Email + SMS',
      status: 'Active'
    },
    {
      id: 'TMP-02',
      name: 'Abandoned Cart Flash Discount',
      type: 'Marketing Automation',
      subject: 'Forgot your helmet in the cart? Here is 10% OFF ⚡',
      channel: 'Email + WhatsApp',
      status: 'Active'
    },
    {
      id: 'TMP-03',
      name: 'VIP Rider Weekend Sale Invite',
      type: 'Promotional Broadcast',
      subject: 'Exclusive Early Access: Akrapovič & AGV Pista Gear',
      channel: 'Email Broadcast',
      status: 'Active'
    },
    {
      id: 'TMP-04',
      name: 'Review & Feedback Request',
      type: 'Post-Delivery Followup',
      subject: 'How was your new RU BIKER world gear? Rate your ride ⭐',
      channel: 'Email',
      status: 'Active'
    }
  ]);

  // Customer Segments
  const [segments, setSegments] = useState([
    { id: 'SEG-1', name: 'High-Value Superbike Owners (₹25k+ spend)', count: 412, active: true },
    { id: 'SEG-2', name: 'Royal Enfield Enthusiasts', count: 1280, active: true },
    { id: 'SEG-3', name: 'First-Time RU BIKER world Shoppers', count: 2450, active: true },
    { id: 'SEG-4', name: 'Inactive Riders (No order in 90 days)', count: 890, active: true },
  ]);

  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    segment: 'High-Value Superbike Owners (₹25k+ spend)',
    channel: 'Email Broadcast',
    subject: '',
    messageBody: ''
  });

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setBroadcastForm({ title: '', segment: 'High-Value Superbike Owners (₹25k+ spend)', channel: 'Email Broadcast', subject: '', messageBody: '' });
    }, 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider border border-amber-200/60">
              Marketing Suite
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Customer Engagement & Messaging</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-amber-500" />
            Email & Notification Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Send targeted email campaigns, automated order alerts, SMS triggers, and segment customer lists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sentSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Broadcast dispatched successfully!
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'templates'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Mail className="w-3.5 h-3.5" /> Message Templates ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'broadcast'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Send className="w-3.5 h-3.5" /> Send New Broadcast
        </button>
        <button
          onClick={() => setActiveTab('segments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'segments'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Audience Segments ({segments.length})
        </button>
      </div>

      {/* TAB 1: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Configured Triggers & Email Templates</h2>
            <span className="text-xs text-slate-400 font-medium">Automatic lifecycle dispatch</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="py-3 px-4">Template Name</th>
                  <th className="py-3 px-4">Category Type</th>
                  <th className="py-3 px-4">Subject Line Preview</th>
                  <th className="py-3 px-4">Supported Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{t.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {t.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{t.type}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 line-clamp-1">{t.subject}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[11px]">
                        {t.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" /> {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg">
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BROADCAST COMPOSER */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs max-w-2xl">
          <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
            Compose Rider Broadcast Message
          </h2>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Customer Segment</label>
              <select
                value={broadcastForm.segment}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, segment: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {segments.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.count} recipients)</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Channel</label>
                <select
                  value={broadcastForm.channel}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, channel: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option>Email Broadcast (Rich HTML)</option>
                  <option>SMS Quick Alert</option>
                  <option>WhatsApp Direct Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Reference Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oct Weekend Blast"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject Line</label>
              <input
                type="text"
                required
                placeholder="e.g. RU BIKER Flash Deal: 20% OFF Exhausts this Sunday Only! 🏁"
                value={broadcastForm.subject}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email HTML / Body Content</label>
              <textarea
                rows="5"
                required
                placeholder="Hey Rider, check out our latest track-ready arrivals..."
                value={broadcastForm.messageBody}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, messageBody: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all"
            >
              <Send className="w-4 h-4 text-amber-400" />
              Dispatch Campaign Now
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SEGMENTS */}
      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments.map((seg) => (
            <div key={seg.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">{seg.name}</h3>
                <span className="text-xs text-slate-500 font-medium">{seg.count.toLocaleString()} Active Verified Riders</span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                Segment Ready
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCommunications;

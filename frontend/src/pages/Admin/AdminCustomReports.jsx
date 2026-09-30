import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Layers,
  CheckCircle2,
  Table,
  Printer,
  Save,
  ArrowRight
} from 'lucide-react';

export const AdminCustomReports = () => {
  const [reportType, setReportType] = useState('Sales & Revenue');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [exportSuccess, setExportSuccess] = useState(false);

  const sampleReportRows = [
    { col1: '2026-09-28', col2: 'SP-9201', col3: 'Akrapovič Slip-on', col4: '₹38,999', col5: 'Delivered', col6: 'UPI Prepaid' },
    { col1: '2026-09-28', col2: 'SP-9195', col3: 'AGV Pista Helmet', col4: '₹42,000', col5: 'In Transit', col6: 'Credit Card' },
    { col1: '2026-09-27', col2: 'SP-9188', col3: 'ViaTerra Saddlebag', col4: '₹5,899', col5: 'Delivered', col6: 'UPI Prepaid' },
    { col1: '2026-09-27', col2: 'SP-9182', col3: 'Rynox Stealth Jacket', col4: '₹9,500', col5: 'Processing', col6: 'COD' },
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Identifier,Item/Entity,Amount,Status,Payment/Channel\n"
      + sampleReportRows.map(r => `${r.col1},${r.col2},${r.col3},${r.col4},${r.col5},${r.col6}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RU_BIKER_WORLD_${reportType.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider border border-amber-200/60">
              Analytics & Intelligence
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Business Intelligence Generator</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-500" />
            Custom Business Intelligence Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build parameterized reports across sales, inventory, tax liability, customer cohorts, and download CSV/PDF.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {exportSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Report Downloaded Successfully
            </span>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Export CSV Report
          </button>
        </div>
      </div>

      {/* Report Config Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
          Report Parameters & Scope Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Report Module</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option>Sales & Revenue</option>
              <option>Products & SKU Turnover</option>
              <option>Orders & Delivery SLAs</option>
              <option>Customer Accounts & LTV</option>
              <option>Inventory Valuation & Low Stock</option>
              <option>GST & Tax Liability Invoices</option>
              <option>Marketing Campaigns & ROAS</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reporting Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month (M-T-D)</option>
              <option>Last Quarter</option>
              <option>Financial Year (Y-T-D)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Output Format</label>
            <select className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none">
              <option>CSV Spreadsheet (.csv)</option>
              <option>PDF Print Ready (.pdf)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">Live Preview: {reportType} ({dateRange})</h2>
          <span className="text-xs text-slate-400 font-medium">Showing top 4 sample rows</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Record Identifier</th>
                <th className="py-3 px-4">Entity / Product</th>
                <th className="py-3 px-4">Monetary Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Method / Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sampleReportRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-slate-500">{r.col1}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.col2}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{r.col3}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">{r.col4}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {r.col5}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{r.col6}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomReports;

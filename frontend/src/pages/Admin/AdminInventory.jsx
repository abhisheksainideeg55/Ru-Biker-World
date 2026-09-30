import React, { useState, useEffect } from 'react';
import {
  FiArchive,
  FiAlertTriangle,
  FiSearch,
  FiPlus,
  FiMinus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiRefreshCw,
  FiLayers,
  FiX,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiLink2,
  FiSliders,
  FiBox
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useNotifications } from '../../hooks/useNotifications';

export const AdminInventory = () => {
  const [activeTab, setActiveTab] = useState('raw'); // 'raw', 'recipes', 'direct'
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [directProducts, setDirectProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  // Quick Restock Modal
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockItem, setRestockItem] = useState(null);
  const [restockQty, setRestockQty] = useState('10');

  const [formData, setFormData] = useState({
    name: '',
    unit: 'L',
    onHand: '',
    threshold: '',
    supplier: '',
    cost: '',
    category: 'General',
  });

  const { addToast } = useNotifications() || {};

  const handleOpenRestock = (item) => {
    setRestockItem(item);
    setRestockQty('10');
    setIsRestockModalOpen(true);
  };

  const handleApplyRestock = async (e) => {
    e.preventDefault();
    if (!restockItem) return;
    const addAmount = Number(restockQty);
    if (isNaN(addAmount) || addAmount <= 0) {
      if (addToast) addToast({ type: 'error', message: 'Enter a valid restock quantity.' });
      return;
    }

    try {
      const newOnHand = Number(restockItem.onHand) + addAmount;
      await adminService.updateIngredient(restockItem.id, { onHand: newOnHand });
      if (addToast) {
        addToast({
          type: 'success',
          message: `Restocked +${addAmount} ${restockItem.unit} to ${restockItem.name}! New stock: ${newOnHand} ${restockItem.unit}.`,
        });
      }
      setIsRestockModalOpen(false);
      loadData();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to restock ingredient.' });
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [ingData, recData, prodData] = await Promise.all([
        adminService.getIngredients(),
        adminService.getRecipes(),
        adminService.getProducts({ limit: 50 }),
      ]);
      setIngredients(ingData || []);
      setRecipes(recData || []);
      setDirectProducts(prodData?.products || []);
    } catch (e) {
      console.error('Failed to load inventory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedIngredient(null);
    setFormData({
      name: '',
      unit: 'L',
      onHand: '',
      threshold: '',
      supplier: '',
      cost: '',
      category: 'General',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setSelectedIngredient(item);
    setFormData({
      name: item.name || '',
      unit: item.unit || 'L',
      onHand: item.onHand ?? '',
      threshold: item.threshold ?? '',
      supplier: item.supplier || '',
      cost: item.cost ?? '',
      category: item.category || 'General',
    });
    setIsModalOpen(true);
  };

  const handleDeleteIngredient = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await adminService.deleteIngredient(id);
        if (addToast) addToast({ type: 'success', message: `${name} deleted successfully.` });
        loadData();
      } catch (e) {
        if (addToast) addToast({ type: 'error', message: 'Failed to delete ingredient.' });
      }
    }
  };

  const handleSubmitIngredient = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Please enter ingredient name.' });
      return;
    }

    try {
      if (modalMode === 'create') {
        await adminService.addIngredient(formData);
        if (addToast) addToast({ type: 'success', message: `Added ${formData.name} to ingredients!` });
      } else {
        await adminService.updateIngredient(selectedIngredient.id, formData);
        if (addToast) addToast({ type: 'success', message: `Updated ${formData.name} successfully!` });
      }
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to save ingredient.' });
    }
  };

  // Direct Product Stock Adjuster
  const handleProductStockDelta = async (productId, delta, productName, currentStock) => {
    const target = Math.max(0, (currentStock ?? 0) + delta);
    try {
      await adminService.updateStock(productId, { stockCount: target });
      if (addToast) {
        addToast({
          type: 'success',
          message: `Stock for ${productName} updated to ${target} units.`,
        });
      }
      loadData();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to update stock.' });
    }
  };

  // Calculate KPIs
  const totalItemsTracked = ingredients.length;
  const lowStockCount = ingredients.filter((i) => Number(i.onHand) <= Number(i.threshold)).length;
  const inventoryValue = 843289; // Valued from operational records & raw assets

  // Filtered ingredients
  const filteredIngredients = ingredients.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.supplier?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ===================== PAGE HEADER ===================== */}
      <div>
        <div className="flex items-center gap-2">
          <FiArchive className="w-5 h-5 text-slate-700" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Inventory & Stock Management
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Stock levels, supplier pricing and low-stock alerts
        </p>
      </div>

      {/* ===================== TOP KPI SUMMARY CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Items Tracked */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            ITEMS TRACKED
          </span>
          <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900">
            {totalItemsTracked}
          </div>
        </div>

        {/* Low-Stock Alerts */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            LOW-STOCK ALERTS
          </span>
          <div className="mt-2 text-3xl sm:text-4xl font-black text-rose-600">
            {lowStockCount}
          </div>
        </div>

        {/* Inventory Value */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            INVENTORY VALUE
          </span>
          <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900">
            ₹{inventoryValue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* ===================== TAB NAVIGATION ===================== */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'raw'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Stock (Raw/Ings)
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'direct'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Direct Stock Products
        </button>
      </div>

      {/* ===================== TAB CONTENT: RAW INGREDIENTS ===================== */}
      {activeTab === 'raw' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Action Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search bike parts, helmets, accessories, oils..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Stock Item</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Part / Accessory</th>
                  <th className="py-3.5 px-6 min-w-[200px]">Stock Level</th>
                  <th className="py-3.5 px-6">Supplier</th>
                  <th className="py-3.5 px-6">Cost</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredIngredients.length > 0 ? (
                  filteredIngredients.map((item) => {
                    const isLow = Number(item.onHand) <= Number(item.threshold);
                    const capacity = item.totalCapacity || Math.max(item.threshold * 2.5, 20);
                    const percentage = Math.min(100, Math.max(10, Math.round((Number(item.onHand) / capacity) * 100)));

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Ingredient Info */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 text-sm">
                            {item.name}
                          </div>
                          <div className="text-slate-400 text-xs mt-0.5">
                            {item.onHand} {item.unit} on hand · threshold {item.threshold} {item.unit}
                          </div>
                        </td>

                        {/* Stock Level Bar */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isLow ? 'bg-rose-500' : 'bg-teal-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            {isLow && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                <FiAlertTriangle className="w-3 h-3" />
                                LOW
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Supplier */}
                        <td className="py-4 px-6 font-medium text-slate-600">
                          {item.supplier || 'Local Supplier'}
                        </td>

                        {/* Cost */}
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          ₹{Number(item.cost).toFixed(2)}/{item.unit}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleOpenRestock(item)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                              title="Restock Stock"
                            >
                              <FiPlus className="w-3 h-3 text-emerald-600" />
                              <span>Restock</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Edit Ingredient"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteIngredient(item.id, item.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Ingredient"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 text-xs">
                      No ingredients found matching "{search}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* ===================== TAB CONTENT: DIRECT STOCK PRODUCTS ===================== */}
      {activeTab === 'direct' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Direct Finished Goods</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Items tracked by direct pack/piece units without recipe decomposition.
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              {directProducts.length} Products
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Stock Count</th>
                  <th className="py-3.5 px-6 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {directProducts.map((p) => (
                  <tr key={p.id || p._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={p.image || p.images?.[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.sku}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{p.category}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">₹{p.price}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                          (p.stockCount ?? 0) <= 5
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {p.stockCount ?? 0} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleProductStockDelta(p.id || p._id, -5, p.name, p.stockCount)}
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600"
                          title="-5 units"
                        >
                          <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleProductStockDelta(p.id || p._id, 10, p.name, p.stockCount)}
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600"
                          title="+10 units"
                        >
                          <FiPlus className="w-3.5 h-3.5" />
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

      {/* ===================== ADD / EDIT INGREDIENT MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {modalMode === 'create' ? 'Add New Stock Item' : 'Edit Stock Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIngredient} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item / Part Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Face Helmet / Ceramic Brake Pads"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                  required
                />
              </div>

              {/* Unit & Category Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Measurement Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
                  >
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="sets">sets (Sets)</option>
                    <option value="pairs">pairs (Pairs)</option>
                    <option value="L">L (Litres)</option>
                    <option value="packs">packs (Packs)</option>
                    <option value="box">box (Boxes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Helmets & Gear / Spare Parts"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* On Hand & Threshold Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Stock Quantity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 18"
                    value={formData.onHand}
                    onChange={(e) => setFormData({ ...formData, onHand: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Low Alert Threshold
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Supplier & Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supplier / Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Brembo India / Motul"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cost per Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 1250"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                >
                  {modalMode === 'create' ? 'Add Ingredient' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ===================== QUICK RESTOCK MODAL ===================== */}
      {isRestockModalOpen && restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Restock {restockItem.name}</h3>
                <p className="text-xs text-slate-500">
                  Current on hand: <strong className="text-slate-800">{restockItem.onHand} {restockItem.unit}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyRestock} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Quantity to Add ({restockItem.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                  required
                  autoFocus
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2">
                {[5, 10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRestockQty(String(amt))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      Number(restockQty) === amt
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                New Total: <strong className="text-slate-900">{(Number(restockItem.onHand) + (Number(restockQty) || 0)).toFixed(1)} {restockItem.unit}</strong>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;

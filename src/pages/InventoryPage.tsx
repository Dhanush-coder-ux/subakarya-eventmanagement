import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Layers,
  Edit3,
  Trash2,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { InventoryItem, InventoryType } from '../types';
import { formatINR } from '../utils';

export const InventoryPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustInventoryStock,
  } = useMarketplaceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'asset' | 'consumable'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Stock Adjustment Form
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(1);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'allocate' | 'damage'>('allocate');
  const [adjustError, setAdjustError] = useState('');

  // Add / Edit Item Form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Camera Gear');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
  );
  const [totalQuantity, setTotalQuantity] = useState<number>(5);
  const [rentalRate, setRentalRate] = useState<number>(2000);
  const [unit, setUnit] = useState('units');
  const [inventoryType, setInventoryType] = useState<InventoryType>('asset');
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(2);

  const myInventory = inventory.filter((i) => i.professionalId === currentUser.id);

  // Filtered inventory list
  const filteredInventory = myInventory.filter((item) => {
    if (selectedType !== 'all' && item.inventoryType !== selectedType) return false;
    if (
      searchTerm &&
      !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.sku.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Aggregate KPI metrics
  const totalUnits = myInventory.reduce((acc, i) => acc + i.totalQuantity, 0);
  const totalAvailable = myInventory.reduce((acc, i) => acc + i.availableQuantity, 0);
  const totalAllocated = myInventory.reduce((acc, i) => acc + i.allocatedQuantity, 0);
  const lowStockCount = myInventory.filter(
    (i) => i.availableQuantity <= i.lowStockThreshold
  ).length;

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setName('');
    setSku(`SKU-${Date.now().toString().slice(-4)}`);
    setCategory('General');
    setDescription('');
    setTotalQuantity(10);
    setRentalRate(1500);
    setUnit('units');
    setInventoryType('asset');
    setLowStockThreshold(2);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setName(item.name);
    setSku(item.sku);
    setCategory(item.category);
    setDescription(item.description);
    setImage(item.image);
    setTotalQuantity(item.totalQuantity);
    setRentalRate(item.rentalRate);
    setUnit(item.unit);
    setInventoryType(item.inventoryType);
    setLowStockThreshold(item.lowStockThreshold);
    setIsAddModalOpen(true);
  };

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustmentAmount(1);
    setAdjustmentType('allocate');
    setAdjustError('');
    setIsAdjustModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (selectedItem) {
      updateInventoryItem({
        ...selectedItem,
        name,
        sku,
        category,
        description,
        image,
        totalQuantity,
        rentalRate,
        unit,
        inventoryType,
        lowStockThreshold,
        availableQuantity: Math.min(totalQuantity, selectedItem.availableQuantity),
      });
    } else {
      addInventoryItem({
        professionalId: currentUser.id,
        name,
        sku,
        category,
        description,
        image,
        totalQuantity,
        availableQuantity: totalQuantity,
        allocatedQuantity: 0,
        damagedQuantity: 0,
        rentalRate,
        unit,
        inventoryType,
        lowStockThreshold,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleExecuteAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    let deltaAvailable = 0;
    let deltaDamaged = 0;

    if (adjustmentType === 'allocate') {
      if (adjustmentAmount > selectedItem.availableQuantity) {
        setAdjustError(`Cannot allocate ${adjustmentAmount}. Only ${selectedItem.availableQuantity} available in stock.`);
        return;
      }
      deltaAvailable = -adjustmentAmount;
    } else if (adjustmentType === 'add') {
      deltaAvailable = adjustmentAmount;
    } else if (adjustmentType === 'damage') {
      if (adjustmentAmount > selectedItem.availableQuantity) {
        setAdjustError(`Cannot flag ${adjustmentAmount} damaged. Only ${selectedItem.availableQuantity} available.`);
        return;
      }
      deltaAvailable = -adjustmentAmount;
      deltaDamaged = adjustmentAmount;
    }

    const success = adjustInventoryStock(selectedItem.id, deltaAvailable, deltaDamaged);
    if (!success) {
      setAdjustError('Validation failed: negative stock is strictly prohibited.');
      return;
    }

    setIsAdjustModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
            Asset & Supply Tracking
          </span>
          <h1 className="font-bold text-2xl sm:text-3xl font-bold text-charcoal mt-1">
            Inventory & Asset Management
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Monitor reusable equipment, track event allocations, and manage stock quantities with zero negative balance
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Inventory Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Total Catalog Items</span>
          <p className="text-2xl font-bold font-bold text-charcoal mt-1">{myInventory.length}</p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Total Units In Stock</span>
          <p className="text-2xl font-bold font-bold text-charcoal mt-1">{totalUnits}</p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Available for Events</span>
          <p className="text-2xl font-bold font-bold text-success mt-1">{totalAvailable}</p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Low Stock Alerts</span>
          <p className={`text-2xl font-bold font-bold mt-1 ${lowStockCount > 0 ? 'text-error' : 'text-charcoal'}`}>
            {lowStockCount}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card rounded-2xl border border-border p-3.5 sm:p-4 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by name, SKU, or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto shrink-0">
          {(['all', 'asset', 'consumable'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedType === t
                  ? 'bg-wine text-white'
                  : 'bg-surface text-charcoal-muted hover:bg-sand/30 border border-border'
              }`}
            >
              {t === 'all' ? 'All Items' : t === 'asset' ? 'Reusable Assets' : 'Consumables'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-surface-muted text-charcoal-muted font-bold uppercase tracking-wider text-[10px] border-b border-border">
              <tr>
                <th className="py-3 px-4">Item & Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Available / Total</th>
                <th className="py-3 px-4">Rental Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-charcoal-muted">
                    No inventory records match the filter.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.availableQuantity <= item.lowStockThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-sand/10 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover ring-1 ring-border flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-charcoal">{item.name}</p>
                            <span className="font-mono text-[10px] text-charcoal-light">
                              {item.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-charcoal">{item.category}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.inventoryType === 'asset'
                              ? 'bg-sand/70 text-charcoal border border-sand-dark'
                              : 'bg-wine-soft text-wine'
                          }`}
                        >
                          {item.inventoryType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-charcoal text-sm">
                          {item.availableQuantity}
                        </span>
                        <span className="text-charcoal-light text-[11px]">
                          {' '}
                          / {item.totalQuantity} {item.unit}
                        </span>
                        {item.allocatedQuantity > 0 && (
                          <span className="block text-[10px] text-wine font-medium">
                            ({item.allocatedQuantity} allocated)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-charcoal">
                        {formatINR(item.rentalRate)} / {item.unit}
                      </td>

                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-light text-error border border-error/30">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-light text-success border border-success/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Optimal</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAdjust(item)}
                            className="px-2.5 py-1 rounded-md bg-sand/60 hover:bg-sand text-charcoal text-[11px] font-semibold border border-sand-dark flex items-center gap-1"
                            title="Adjust Stock"
                          >
                            <ArrowUpDown className="w-3 h-3 text-wine" />
                            <span>Adjust</span>
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-md hover:bg-sand/30 text-charcoal-muted hover:text-charcoal"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteInventoryItem(item.id)}
                            className="p-1.5 rounded-md hover:bg-error-light text-charcoal-muted hover:text-error"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-sm text-charcoal">Stock Adjustment — {selectedItem.name}</h3>
              <button onClick={() => setIsAdjustModalOpen(false)}>
                <X className="w-4 h-4 text-charcoal-muted" />
              </button>
            </div>

            <form onSubmit={handleExecuteAdjustment} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-surface-muted rounded-xl border border-border flex justify-between">
                <span>Current Available:</span>
                <span className="font-bold text-wine">{selectedItem.availableQuantity} {selectedItem.unit}</span>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('allocate')}
                    className={`py-2 rounded-lg font-semibold border ${
                      adjustmentType === 'allocate' ? 'bg-wine text-white border-wine' : 'border-border bg-surface text-charcoal'
                    }`}
                  >
                    Allocate Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={`py-2 rounded-lg font-semibold border ${
                      adjustmentType === 'add' ? 'bg-wine text-white border-wine' : 'border-border bg-surface text-charcoal'
                    }`}
                  >
                    Restock Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('damage')}
                    className={`py-2 rounded-lg font-semibold border ${
                      adjustmentType === 'damage' ? 'bg-wine text-white border-wine' : 'border-border bg-surface text-charcoal'
                    }`}
                  >
                    Flag Damaged
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Quantity Units</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine font-bold"
                />
              </div>

              {adjustError && (
                <div className="p-2.5 rounded-lg bg-error-light border border-error/30 text-error text-xs">
                  {adjustError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-charcoal font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white font-bold"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-charcoal">
                {selectedItem ? 'Edit Inventory Item' : 'Add New Inventory Asset'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">SKU / Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Inventory Type</label>
                  <select
                    value={inventoryType}
                    onChange={(e) => setInventoryType(e.target.value as InventoryType)}
                    className="w-full px-2.5 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  >
                    <option value="asset">Reusable Asset</option>
                    <option value="consumable">Consumable Supply</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Unit Label</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="units, sets, kg"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Rate / Item (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={rentalRate}
                    onChange={(e) => setRentalRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Low Stock Alert Level</label>
                  <input
                    type="number"
                    min="1"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-charcoal font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


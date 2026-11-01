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
  Store,
  Tag,
  DollarSign,
  Clock,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { InventoryItem, InventoryType, ProductClassification, ProductStatus, ProductVariant } from '../types';
import { formatINR } from '../utils';

export const InventoryPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustInventoryStock,
    businessMode,
  } = useMarketplaceStore();

  const isOrderBased = businessMode === 'ORDER_BASED';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<'all' | ProductClassification>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'asset' | 'consumable'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
  const [sellingPrice, setSellingPrice] = useState<number>(15000);
  const [purchasePrice, setPurchasePrice] = useState<number>(10000);
  const [unit, setUnit] = useState('units');
  const [inventoryType, setInventoryType] = useState<InventoryType>('asset');
  const [classification, setClassification] = useState<ProductClassification>('rental');
  const [productStatus, setProductStatus] = useState<ProductStatus>('active');
  const [rentalDuration, setRentalDuration] = useState('per day');
  const [returnDate, setReturnDate] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(2);

  // Variants input state
  const [variantName, setVariantName] = useState('Color / Finish');
  const [variantOptionsInput, setVariantOptionsInput] = useState('Matte Black, Brushed Silver');

  const myInventory = inventory.filter((i) => i.professionalId === currentUser.id);

  // Unique categories
  const categories = Array.from(new Set(myInventory.map((i) => i.category)));

  // Filtered inventory list
  const filteredInventory = myInventory.filter((item) => {
    if (selectedType !== 'all' && item.inventoryType !== selectedType) return false;
    if (selectedClassification !== 'all' && (item.classification || 'rental') !== selectedClassification) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
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
    setCategory('General Gear');
    setDescription('');
    setTotalQuantity(10);
    setRentalRate(1500);
    setSellingPrice(12000);
    setPurchasePrice(8000);
    setUnit('units');
    setInventoryType('asset');
    setClassification(isOrderBased ? 'sale' : 'rental');
    setProductStatus('active');
    setRentalDuration('per day');
    setReturnDate('');
    setLowStockThreshold(2);
    setVariantName('Model / Option');
    setVariantOptionsInput('Standard Kit, Deluxe Rig');
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
    setRentalRate(item.rentalRate || 0);
    setSellingPrice(item.sellingPrice || item.rentalRate * 4 || 10000);
    setPurchasePrice(item.purchasePrice || 0);
    setUnit(item.unit);
    setInventoryType(item.inventoryType);
    setClassification(item.classification || 'rental');
    setProductStatus(item.productStatus || 'active');
    setRentalDuration(item.rentalDuration || 'per day');
    setReturnDate(item.returnDate || '');
    setLowStockThreshold(item.lowStockThreshold);
    if (item.variants && item.variants.length > 0) {
      setVariantName(item.variants[0].name);
      setVariantOptionsInput(item.variants[0].options.join(', '));
    } else {
      setVariantName('Model / Option');
      setVariantOptionsInput('');
    }
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

    // Parse variants if provided
    const parsedVariants: ProductVariant[] = variantOptionsInput.trim()
      ? [
          {
            id: `var-${Date.now()}`,
            name: variantName,
            options: variantOptionsInput
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          },
        ]
      : [];

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
        sellingPrice,
        purchasePrice,
        unit,
        inventoryType,
        classification,
        productStatus,
        rentalDuration,
        returnDate,
        variants: parsedVariants,
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
        sellingPrice,
        purchasePrice,
        unit,
        inventoryType,
        classification,
        productStatus,
        rentalDuration,
        returnDate,
        variants: parsedVariants,
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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
              {isOrderBased ? 'Seller Catalog Management' : 'Asset & Supply Tracking'}
            </span>
            <span className="text-[10px] font-bold text-charcoal bg-sand px-2 py-0.5 rounded-full border border-sand-dark">
              {isOrderBased ? 'Order Mode' : 'Booking Mode'}
            </span>
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl text-charcoal mt-1">
            {isOrderBased ? 'Products & Inventory Management' : 'Inventory & Asset Management'}
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {isOrderBased
              ? 'Manage retail items for sale, rental gear, product variants, and real-time inventory stock levels.'
              : 'Monitor reusable equipment, track event allocations, and manage stock quantities with zero negative balance.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 icon-hover-base group-hover:scale-110 transition-transform" />
          <span>{isOrderBased ? 'Add New Product / Rental' : 'Add Inventory Item'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">
            {isOrderBased ? 'Total Product SKUs' : 'Total Catalog Items'}
          </span>
          <p className="text-2xl font-bold text-charcoal mt-1">{myInventory.length}</p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Total Units In Stock</span>
          <p className="text-2xl font-bold text-charcoal mt-1">{totalUnits}</p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">
            {isOrderBased ? 'Available to Sell / Rent' : 'Available for Events'}
          </span>
          <p className="text-2xl font-bold text-success mt-1">{totalAvailable}</p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Low Stock Alerts</span>
          <p className={`text-2xl font-bold mt-1 ${lowStockCount > 0 ? 'text-error' : 'text-charcoal'}`}>
            {lowStockCount}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card rounded-2xl border border-border p-3.5 sm:p-4 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by name, SKU, or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Classification Filter (Sale vs Rental) */}
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
            {(['all', 'sale', 'rental', 'both'] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassification(cls)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                  selectedClassification === cls
                    ? 'bg-wine text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
                }`}
              >
                {cls === 'all' ? 'All Classes' : cls === 'sale' ? 'For Sale' : cls === 'rental' ? 'For Rent' : 'Both'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-border bg-surface text-charcoal font-semibold outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Type Filter */}
          <div className="flex items-center gap-1">
            {(['all', 'asset', 'consumable'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                  selectedType === t
                    ? 'bg-sand text-charcoal border border-sand-dark font-bold'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                {t === 'all' ? 'All Types' : t === 'asset' ? 'Assets' : 'Consumables'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-surface-muted text-charcoal-muted font-bold uppercase tracking-wider text-[10px] border-b border-border">
              <tr>
                <th className="py-3 px-4">Product / Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-center">Available / Total</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Variants / Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-charcoal-muted">
                    No products or inventory records match the filter.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.availableQuantity <= item.lowStockThreshold;
                  const itemClassification = item.classification || 'rental';
                  return (
                    <tr key={item.id} className="hover:bg-sand/10 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-border flex-shrink-0"
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
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            itemClassification === 'sale'
                              ? 'bg-success-light text-success border border-success/30'
                              : itemClassification === 'rental'
                              ? 'bg-sand/80 text-charcoal border border-sand-dark'
                              : 'bg-wine-soft text-wine border border-wine/20'
                          }`}
                        >
                          {itemClassification === 'both' ? 'Sale & Rent' : itemClassification}
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

                      <td className="py-3.5 px-4">
                        {itemClassification === 'sale' ? (
                          <div>
                            <span className="font-bold text-charcoal block">
                              {formatINR(item.sellingPrice || 12000)}
                            </span>
                            <span className="text-[10px] text-charcoal-muted">Selling Price</span>
                          </div>
                        ) : itemClassification === 'rental' ? (
                          <div>
                            <span className="font-bold text-charcoal block">
                              {formatINR(item.rentalRate)} / {item.rentalDuration || item.unit}
                            </span>
                            <span className="text-[10px] text-charcoal-muted">Rental Rate</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-charcoal block">
                              Sale: {formatINR(item.sellingPrice || 15000)}
                            </span>
                            <span className="text-[10px] text-wine font-semibold block">
                              Rent: {formatINR(item.rentalRate)}/day
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.variants && item.variants.length > 0 ? (
                          <div>
                            <span className="text-[11px] font-semibold text-charcoal block">
                              {item.variants[0].name}
                            </span>
                            <span className="text-[10px] text-charcoal-muted truncate max-w-[140px] block">
                              {item.variants[0].options.join(', ')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-charcoal-muted italic">Standard</span>
                        )}
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
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteInventoryItem(item.id)}
                            className="p-1.5 rounded-md hover:bg-error-light text-charcoal-muted hover:text-error"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-error" />
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

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-3xl border border-border shadow-elevated w-full max-w-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-charcoal">
                  {selectedItem ? 'Edit Product / Asset' : 'Add Product to Catalog'}
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Supports retail products for sale, event rental equipment, variants, and pricing
                </p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4 text-xs">
              {/* Product Classification Tabs: Sale vs Rental */}
              <div>
                <label className="font-bold text-charcoal block mb-1.5">Product Classification</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sale', label: 'Regular Product (Sale)' },
                    { id: 'rental', label: 'Rental Product' },
                    { id: 'both', label: 'Both Sale & Rental' },
                  ].map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setClassification(cls.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        classification === cls.id
                          ? 'border-wine bg-sand/60 text-wine font-bold shadow-xs'
                          : 'border-border bg-surface text-charcoal hover:bg-sand/20'
                      }`}
                    >
                      {cls.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony FX6 Cinema Kit or Chiavari Gold Chairs"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">SKU / Item Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Lighting, Camera, Furniture, Decor"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>

              {/* Pricing section based on classification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-sand/30 border border-sand-dark">
                {(classification === 'sale' || classification === 'both') && (
                  <div>
                    <label className="font-semibold text-charcoal block mb-1">Selling Price (INR)</label>
                    <input
                      type="number"
                      min="0"
                      required={classification === 'sale'}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal font-bold outline-none focus:border-wine"
                    />
                  </div>
                )}

                {(classification === 'rental' || classification === 'both') && (
                  <div>
                    <label className="font-semibold text-charcoal block mb-1">Rental Rate (INR)</label>
                    <input
                      type="number"
                      min="0"
                      required={classification === 'rental'}
                      value={rentalRate}
                      onChange={(e) => setRentalRate(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal font-bold outline-none focus:border-wine"
                    />
                  </div>
                )}

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Purchase / Cost Price (Opt.)</label>
                  <input
                    type="number"
                    min="0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>

                {(classification === 'rental' || classification === 'both') && (
                  <div>
                    <label className="font-semibold text-charcoal block mb-1">Rental Duration</label>
                    <input
                      type="text"
                      value={rentalDuration}
                      onChange={(e) => setRentalDuration(e.target.value)}
                      placeholder="per day, 3 days"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal font-bold outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Unit Type</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="units, sets, pcs"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Product Status</label>
                  <select
                    value={productStatus}
                    onChange={(e) => setProductStatus(e.target.value as ProductStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  >
                    <option value="active">Active Listing</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Product Variants Input */}
              <div className="p-3 rounded-xl bg-surface border border-border space-y-2">
                <label className="font-bold text-charcoal block">Product Variants (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="Variant Name (e.g. Color or Size)"
                    className="px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal"
                  />
                  <input
                    type="text"
                    value={variantOptionsInput}
                    onChange={(e) => setVariantOptionsInput(e.target.value)}
                    placeholder="Options (comma-separated, e.g. Black, White, Gold)"
                    className="px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specifications, material details, rental condition..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-charcoal font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

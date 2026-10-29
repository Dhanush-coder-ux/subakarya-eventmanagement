import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Layers,
  ArrowRight,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { ServiceItem, ServiceCategory, PricingModel } from '../types';
import { formatINR, getPricingModelLabel } from '../utils';

export const ServicesPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { services, addService, updateService, deleteService, toggleServiceActive } = useMarketplaceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Photographer & Videographer');
  const [description, setDescription] = useState('');
  const [pricingModel, setPricingModel] = useState<PricingModel>('fixed');
  const [basePrice, setBasePrice] = useState<number>(25000);
  const [unitLabel, setUnitLabel] = useState('package');
  const [inclusionsText, setInclusionsText] = useState('');

  // Filter services for current professional
  const myServices = services.filter((s) => s.professionalId === currentUser.id);

  const handleOpenAdd = () => {
    setEditingServiceId(null);
    setName('');
    setDescription('');
    setPricingModel('fixed');
    setBasePrice(25000);
    setUnitLabel('package');
    setInclusionsText('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setName(service.name);
    setCategory(service.category);
    setDescription(service.description);
    setPricingModel(service.pricingModel);
    setBasePrice(service.basePrice);
    setUnitLabel(service.unitLabel || '');
    setInclusionsText(service.inclusions.join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const inclusions = inclusionsText
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    if (editingServiceId) {
      const existing = services.find((s) => s.id === editingServiceId);
      if (existing) {
        updateService({
          ...existing,
          name,
          category,
          description,
          pricingModel,
          basePrice,
          unitLabel,
          inclusions,
        });
      }
    } else {
      addService({
        professionalId: currentUser.id,
        name,
        category,
        description,
        pricingModel,
        basePrice,
        unitLabel,
        inclusions,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="bg-surface-card rounded-2xl border border-border p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
              Vendor Pricing Management
            </span>
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl font-bold text-charcoal mt-1">
            Services & Pricing Packages
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Create reusable pricing structures used to generate automated quotation cards in customer chats
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 icon-hover-base group-hover:scale-110 group-hover:rotate-90 transition-transform" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myServices.map((service) => (
          <div
            key={service.id}
            className={`bg-surface-card rounded-2xl border p-5 shadow-card flex flex-col justify-between transition-all ${
              service.isActive ? 'border-border' : 'border-dashed border-border-dark opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal bg-sand px-2 py-0.5 rounded">
                  {service.category}
                </span>
                <button
                  onClick={() => toggleServiceActive(service.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    service.isActive
                      ? 'bg-success-light text-success'
                      : 'bg-surface-muted text-charcoal-muted'
                  }`}
                  title="Toggle active status"
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <h3 className="text-base font-bold text-charcoal mt-2">{service.name}</h3>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed line-clamp-2">
                {service.description}
              </p>

              {/* Price & Model Callout */}
              <div className="my-4 p-3 rounded-xl bg-sand/30 border border-sand-dark flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">
                    Pricing Model
                  </span>
                  <span className="font-semibold text-xs text-charcoal capitalize">
                    {getPricingModelLabel(service.pricingModel, service.unitLabel)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">
                    Base Rate
                  </span>
                  <span className="font-bold text-base text-wine font-bold">
                    {formatINR(service.basePrice)}
                  </span>
                </div>
              </div>

              {/* Inclusions */}
              {service.inclusions && service.inclusions.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                    Included In Package:
                  </span>
                  {service.inclusions.slice(0, 4).map((inc, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-charcoal">
                      <CheckCircle2 className="w-3.5 h-3.5 text-wine flex-shrink-0" />
                      <span className="truncate">{inc}</span>
                    </div>
                  ))}
                  {service.inclusions.length > 4 && (
                    <span className="text-[10px] text-charcoal-light">
                      +{service.inclusions.length - 4} more deliverables
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenEdit(service)}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3 text-charcoal-muted" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => deleteService(service.id)}
                className="p-1.5 text-charcoal-light hover:text-error transition-colors"
                title="Delete Service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-charcoal">
                {editingServiceId ? 'Edit Service Package' : 'Create New Pricing Package'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Service / Package Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Traditional Candid Photography & Album"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  >
                    <option value="fixed">Fixed Package</option>
                    <option value="per_person">Per Person / Guest (Catering)</option>
                    <option value="per_day">Per Day Rental (Halls/Sound)</option>
                    <option value="per_hour">Per Hour</option>
                    <option value="per_item">Per Item</option>
                    <option value="custom">Custom Quotation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Base Price (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of the deliverables..."
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Package Inclusions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  placeholder="2 Senior Photographers&#10;Full Day Coverage&#10;40-Page Embossed Album"
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-bold"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


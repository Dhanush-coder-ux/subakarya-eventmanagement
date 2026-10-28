import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { mockProfessionals } from '../data/mockUsers';
import { AvailabilitySlotForm } from '../components/availability/AvailabilitySlotForm';
import { AvailabilityBlockForm } from '../components/availability/AvailabilityBlockForm';
import { WorkingHoursEditor } from '../components/availability/WorkingHoursEditor';
import { SlotStatusIndicator } from '../components/availability/SlotStatusIndicator';
import { AvailabilitySlot, AvailabilityBlock } from '../types';
import { formatINR, formatDate } from '../utils';
import {
  Calendar as CalendarIcon,
  Clock,
  Ban,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  AlertCircle,
  Settings,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export const ProfessionalAvailabilityPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const proId = currentUser?.id || 'pro-1';

  const {
    availabilitySlots,
    availabilityBlocks,
    workingHours,
    services,
    bookings,
    addAvailabilitySlot,
    updateAvailabilitySlot,
    deleteAvailabilitySlot,
    duplicateAvailabilitySlot,
    createRecurringSlots,
    updateWorkingHours,
    addAvailabilityBlock,
    deleteAvailabilityBlock,
  } = useMarketplaceStore();

  const proServices = useMemo(() => {
    return services.filter((s) => s.professionalId === proId);
  }, [services, proId]);

  const proSlots = useMemo(() => {
    return availabilitySlots.filter((s) => s.professionalId === proId);
  }, [availabilitySlots, proId]);

  const proBlocks = useMemo(() => {
    return availabilityBlocks.filter((b) => b.professionalId === proId);
  }, [availabilityBlocks, proId]);

  const proBookings = useMemo(() => {
    return bookings.filter((b) => b.professionalId === proId);
  }, [bookings, proId]);

  // Modals state
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'slots' | 'hours' | 'blocks'>('slots');

  // Filter state for slots
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtered slots
  const filteredSlots = useMemo(() => {
    return proSlots.filter((s) => {
      if (filterDate && s.date !== filterDate) return false;
      if (filterStatus !== 'all' && s.status !== filterStatus) return false;
      return true;
    });
  }, [proSlots, filterDate, filterStatus]);

  // Summary Metrics
  const availableSlotsCount = proSlots.filter(
    (s) => s.status === 'available' || s.capacity > s.confirmedCount
  ).length;
  const pendingRequestsCount = proBookings.filter((b) => b.status === 'pending').length;
  const confirmedBookingsCount = proBookings.filter((b) => b.status === 'confirmed').length;
  const blockedDatesCount = proBlocks.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
              Vendor Scheduling
            </span>
            <span className="text-xs text-charcoal-muted">• Real-Time Capacity</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal mt-1">
            Availability & Capacity Management
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Configure time slots, define recurring weekly hours, block unavailable dates, and manage customer booking capacity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/professional/calendar"
            className="flex items-center gap-1.5 px-3.5 py-2 border border-border bg-surface-card rounded-xl text-xs font-semibold text-charcoal hover:bg-sand/30 transition-colors shadow-subtle"
          >
            <CalendarIcon className="w-4 h-4 text-wine" />
            <span>Interactive Calendar</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-charcoal-muted" />
          </Link>

          <button
            onClick={() => {
              setEditingSlot(null);
              setIsSlotModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-wine text-white rounded-xl text-xs font-semibold hover:bg-wine-deep transition-colors shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>Create Slot</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-charcoal-muted">Bookable Slots</span>
            <Clock className="w-4 h-4 text-wine" />
          </div>
          <div className="text-2xl font-bold text-charcoal mt-2">{availableSlotsCount}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-1">
            Accepting reservations
          </div>
        </div>

        <div className="bg-surface-card border border-border rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-charcoal-muted">Pending Requests</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-charcoal mt-2">{pendingRequestsCount}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-1">
            Awaiting quotation review
          </div>
        </div>

        <div className="bg-surface-card border border-border rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-charcoal-muted">Confirmed Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-charcoal mt-2">{confirmedBookingsCount}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-1">
            Slot capacity reserved
          </div>
        </div>

        <div className="bg-surface-card border border-border rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-charcoal-muted">Blocked Ranges</span>
            <Ban className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-charcoal mt-2">{blockedDatesCount}</div>
          <div className="text-[10px] text-charcoal-muted font-medium mt-1">
            Holidays & Maintenance
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="border-b border-border flex items-center gap-6">
        <button
          onClick={() => setActiveTab('slots')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'slots'
              ? 'border-wine text-wine'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active Availability Slots ({proSlots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hours')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'hours'
              ? 'border-wine text-wine'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Standard Working Hours</span>
        </button>

        <button
          onClick={() => setActiveTab('blocks')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'blocks'
              ? 'border-wine text-wine'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Blocked Dates & Time Ranges ({proBlocks.length})</span>
        </button>
      </div>

      {/* TAB 1: Slots Management */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-card p-4 rounded-xl border border-border shadow-subtle">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-charcoal-muted" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-xs p-2 rounded-lg border border-border bg-surface text-charcoal"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs p-2 rounded-lg border border-border bg-surface text-charcoal"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="booked">Booked (Full)</option>
                <option value="unavailable">Unavailable</option>
              </select>
              {(filterDate || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setFilterDate('');
                    setFilterStatus('all');
                  }}
                  className="text-xs text-wine underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="text-xs text-charcoal-muted font-medium">
              Showing {filteredSlots.length} of {proSlots.length} slots
            </div>
          </div>

          {/* Slots List */}
          {filteredSlots.length === 0 ? (
            <div className="bg-surface-card border border-border border-dashed rounded-xl p-12 text-center">
              <Clock className="w-10 h-10 text-charcoal-muted mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-semibold text-charcoal">No availability slots found</h3>
              <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
                Create individual or recurring weekly slots so customers can see when you are free to take appointments or events.
              </p>
              <button
                onClick={() => {
                  setEditingSlot(null);
                  setIsSlotModalOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-wine text-white text-xs font-semibold rounded-lg hover:bg-wine-deep transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Slot
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlots.map((slot) => {
                const remaining = slot.capacity - slot.confirmedCount;

                return (
                  <div
                    key={slot.id}
                    className="bg-surface-card border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between hover:border-wine/40 transition-all space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-wine bg-sand/60 px-2 py-0.5 rounded">
                          {formatDate(slot.date)}
                        </span>
                        <SlotStatusIndicator status={slot.status} remainingCapacity={remaining} />
                      </div>

                      <h3 className="font-bold text-sm text-charcoal mt-2.5 line-clamp-1">
                        {slot.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-charcoal-muted mt-1">
                        <Clock className="w-3.5 h-3.5 text-wine" />
                        <span>
                          {slot.startTime} – {slot.endTime}
                        </span>
                        {slot.durationMinutes && (
                          <span>({slot.durationMinutes}m)</span>
                        )}
                      </div>

                      {slot.notes && (
                        <p className="text-[11px] text-charcoal-muted mt-2 line-clamp-2">
                          {slot.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-charcoal-muted font-medium">Capacity: </span>
                        <strong className="text-charcoal">
                          {slot.confirmedCount} / {slot.capacity}
                        </strong>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => duplicateAvailabilitySlot(slot.id)}
                          className="p-1.5 border border-border rounded text-charcoal-muted hover:text-charcoal hover:bg-sand/30 transition-colors"
                          title="Duplicate Slot"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (slot.confirmedCount > 0) {
                              alert('Cannot delete slot with active confirmed bookings.');
                              return;
                            }
                            if (confirm('Are you sure you want to delete this slot?')) {
                              deleteAvailabilitySlot(slot.id);
                            }
                          }}
                          className="p-1.5 border border-border rounded text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Standard Working Hours */}
      {activeTab === 'hours' && (
        <div className="bg-surface-card border border-border rounded-xl p-6 shadow-subtle space-y-4">
          <WorkingHoursEditor
            workingHours={workingHours}
            professionalId={proId}
            onSaveWorkingHours={(rules) => updateWorkingHours(proId, rules)}
          />
        </div>
      )}

      {/* TAB 3: Blocked Dates */}
      {activeTab === 'blocks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-surface-card p-4 rounded-xl border border-border shadow-subtle">
            <div>
              <h3 className="text-sm font-bold text-charcoal">Scheduled Blockouts & Off-Days</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Block periods when you cannot accept customer requests (weddings, vacations, personal leave).
              </p>
            </div>
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-800 text-white text-xs font-semibold rounded-lg hover:bg-red-900 transition-colors shadow-subtle"
            >
              <Ban className="w-4 h-4" />
              <span>Block New Dates</span>
            </button>
          </div>

          {proBlocks.length === 0 ? (
            <div className="bg-surface-card border border-border border-dashed rounded-xl p-12 text-center">
              <Ban className="w-10 h-10 text-charcoal-muted mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-semibold text-charcoal">No date blocks active</h3>
              <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
                You have not blocked any dates or hours. All slots within working hours will remain open for customer reservation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proBlocks.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface-card border border-red-200/80 rounded-xl p-4 shadow-subtle flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        {b.category}
                      </span>
                      {b.allDay ? (
                        <span className="text-xs text-charcoal-muted font-medium">All Day Block</span>
                      ) : (
                        <span className="text-xs text-charcoal-muted font-medium">
                          {b.startTime} – {b.endTime}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-charcoal">
                      {formatDate(b.startDate)}
                      {b.startDate !== b.endDate && ` to ${formatDate(b.endDate)}`}
                    </h4>
                    {b.reason && <p className="text-xs text-charcoal-muted">{b.reason}</p>}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Unblock this date range?')) {
                        deleteAvailabilityBlock(b.id);
                      }
                    }}
                    className="p-1.5 text-charcoal-muted hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Create or Edit Slot */}
      <AvailabilitySlotForm
        isOpen={isSlotModalOpen}
        onClose={() => {
          setIsSlotModalOpen(false);
          setEditingSlot(null);
        }}
        professionalId={proId}
        services={proServices}
        initialSlot={editingSlot}
        onSaveSlot={(slotData) => {
          addAvailabilitySlot(slotData);
          setIsSlotModalOpen(false);
          setEditingSlot(null);
        }}
        onSaveRecurring={(config) => {
          createRecurringSlots(config);
          setIsSlotModalOpen(false);
          setEditingSlot(null);
        }}
      />

      {/* Modal: Block Dates */}
      <AvailabilityBlockForm
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        professionalId={proId}
        onSaveBlock={(blockData) => {
          addAvailabilityBlock(blockData);
          setIsBlockModalOpen(false);
        }}
      />
    </div>
  );
};

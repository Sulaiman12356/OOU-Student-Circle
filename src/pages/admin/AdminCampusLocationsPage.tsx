import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Store, 
  Layers, 
  Compass, 
  Save, 
  X,
  Search,
  ExternalLink
} from 'lucide-react';
import { CampusStore } from '../../services/campusStore';
import { CampusLocation, CampusLocationStatus } from '../../types/campus';
import { MediaUploader } from '../../components/common/MediaUploader';

export const AdminCampusLocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Partial<CampusLocation> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadLocations = () => {
    const list = CampusStore.getLocations();
    setLocations(list);
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleOpenCreate = () => {
    setEditingLocation({
      name: '',
      slug: '',
      campusType: 'Main Campus',
      status: 'Active',
      description: '',
      landmark: '',
      latitude: 6.9458,
      longitude: 3.9167,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
      displayOrder: locations.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc: CampusLocation) => {
    setEditingLocation({ ...loc });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation?.name) {
      setFeedback({ type: 'error', text: 'Location name is required.' });
      return;
    }

    const slug = editingLocation.slug || editingLocation.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    CampusStore.saveLocation({
      ...editingLocation,
      name: editingLocation.name,
      slug,
      status: editingLocation.status || 'Active',
    });

    setFeedback({ type: 'success', text: `Campus location "${editingLocation.name}" saved successfully.` });
    setIsModalOpen(false);
    setEditingLocation(null);
    loadLocations();

    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleStatus = (loc: CampusLocation) => {
    const nextStatus: CampusLocationStatus = loc.status === 'Active' ? 'Inactive' : 'Active';
    CampusStore.saveLocation({
      ...loc,
      status: nextStatus,
    });
    setFeedback({ type: 'success', text: `Location status changed to ${nextStatus}.` });
    loadLocations();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (loc: CampusLocation) => {
    if (window.confirm(`Are you sure you want to remove "${loc.name}"?`)) {
      CampusStore.deleteLocation(loc.id);
      setFeedback({ type: 'success', text: `Location "${loc.name}" deleted.` });
      loadLocations();
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= locations.length) return;

    const reordered = [...locations];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const orderedIds = reordered.map(l => l.id);
    CampusStore.reorderLocations(orderedIds);
    loadLocations();
  };

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.campusType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#061A4F]/5 text-[#061A4F]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#061A4F]">Campus Location Zones</h1>
              <p className="text-xs text-slate-500 font-medium">
                Manage OOU campus zones, documentation hubs, coordinates, and physical service discovery nodes.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4 text-[#F5B400]" />
          <span>Add Campus Location</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search location zones by campus, name or description..."
          className="flex-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-hidden bg-transparent"
        />
        <span className="text-xs font-bold text-slate-400">{filteredLocations.length} locations</span>
      </div>

      {/* Locations Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLocations.map((loc, index) => {
          const liveShopCount = CampusStore.getShopCountForLocation(loc.id);
          return (
            <div
              key={loc.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-[#061A4F]/30 hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative aspect-video w-full bg-slate-100">
                <img
                  src={loc.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'}
                  alt={loc.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      loc.status === 'Active'
                        ? 'bg-emerald-500 text-white'
                        : loc.status === 'Coming Soon'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-500 text-white'
                    }`}
                  >
                    {loc.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-xs p-1 rounded-xl">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-white hover:bg-white/20 rounded disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === locations.length - 1}
                    className="p-1 text-white hover:bg-white/20 rounded disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-black text-[#061A4F] leading-tight">{loc.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                      {loc.code || loc.slug}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-amber-700">{loc.campusType}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{loc.description}</p>
                  {loc.landmark && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{loc.landmark}</span>
                    </p>
                  )}
                </div>

                {/* Meta stats & actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Store className="w-4 h-4 text-[#061A4F]" />
                    <span>{liveShopCount} Verified {liveShopCount === 1 ? 'Shop' : 'Shops'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(loc)}
                      className={`p-1.5 rounded-lg border transition text-xs font-bold ${
                        loc.status === 'Active'
                          ? 'border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title={loc.status === 'Active' ? 'Deactivate location' : 'Activate location'}
                    >
                      {loc.status === 'Active' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(loc)}
                      className="p-1.5 rounded-lg border border-slate-200 text-[#061A4F] hover:bg-blue-50 transition"
                      title="Edit location"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(loc)}
                      className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition"
                      title="Delete location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Location Modal */}
      {isModalOpen && editingLocation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-black text-[#061A4F]">
                {editingLocation.id ? 'Edit Campus Location' : 'Create Campus Location'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingLocation(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingLocation.name || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                  placeholder="e.g. Motion Ground Commercial Center"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-hidden focus:border-[#061A4F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Campus Zone / Faculty
                  </label>
                  <input
                    type="text"
                    value={editingLocation.campusType || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, campusType: e.target.value })}
                    placeholder="e.g. Main Campus Documentation Hub"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-hidden focus:border-[#061A4F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Status
                  </label>
                  <select
                    value={editingLocation.status || 'Active'}
                    onChange={(e) => setEditingLocation({ ...editingLocation, status: e.target.value as CampusLocationStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-hidden focus:border-[#061A4F] bg-white"
                  >
                    <option value="Active">Active (Visible publicly)</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Key Landmark & Area Guidance
                </label>
                <input
                  type="text"
                  value={editingLocation.landmark || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, landmark: e.target.value })}
                  placeholder="e.g. Facing Administrative Block & Quadrangle Walkway"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-hidden focus:border-[#061A4F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingLocation.description || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, description: e.target.value })}
                  placeholder="Describe the services and shops available in this location zone..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-normal outline-hidden focus:border-[#061A4F]"
                />
              </div>

              {/* Location Cover Image */}
              <div className="space-y-2">
                <MediaUploader
                  storagePathPrefix="campusLocations"
                  images={editingLocation.image ? [editingLocation.image] : []}
                  onChange={(imgs) => setEditingLocation({ ...editingLocation, image: imgs[0] || '' })}
                  maxImages={1}
                  label="Location Photo / Cover"
                  aspectRatio="cover"
                  helperText="Upload a crisp photo representing this campus location zone."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingLocation.latitude ?? 6.9458}
                    onChange={(e) => setEditingLocation({ ...editingLocation, latitude: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-hidden focus:border-[#061A4F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingLocation.longitude ?? 3.9167}
                    onChange={(e) => setEditingLocation({ ...editingLocation, longitude: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-hidden focus:border-[#061A4F]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingLocation(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Save className="w-4 h-4 text-[#F5B400]" />
                  <span>Save Location</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

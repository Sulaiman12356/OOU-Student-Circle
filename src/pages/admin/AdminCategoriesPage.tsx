import React, { useState } from 'react';
import { DataStore } from '../../services/dataStore';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { MarketplaceCategory } from '../../types';
import { 
  Tags, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Store, 
  Layers, 
  X, 
  Save,
  Check
} from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'services'>('marketplace');
  const [marketplaceCategories, setMarketplaceCategories] = useState<MarketplaceCategory[]>(
    MarketplaceStore.getCategories()
  );
  
  const [serviceCategories, setServiceCategories] = useState<string[]>([
    'Graphics & Design',
    'Tech & Development',
    'Writing & Translation',
    'Video & Animation',
    'Tutoring & Academics',
    'Marketing & Social Media',
    'Photography & Media',
    'Business & Admin'
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MarketplaceCategory | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Tag');
  const [featured, setFeatured] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New service category input
  const [newServiceCat, setNewServiceCat] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIconName('Tag');
    setFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: MarketplaceCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIconName(cat.iconName || 'Tag');
    setFeatured(Boolean(cat.featured));
    setIsModalOpen(true);
  };

  const handleSaveMarketplaceCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingCategory) {
      MarketplaceStore.saveCategory({
        ...editingCategory,
        name,
        slug,
        description,
        iconName,
        featured
      });
      DataStore.logAdminAction('UPDATE_CATEGORY', 'category', editingCategory.id, `Updated category ${name}`);
      showToast(`Category "${name}" updated.`);
    } else {
      const newCat: MarketplaceCategory = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        description,
        iconName,
        featured,
        productCount: 0
      };
      MarketplaceStore.saveCategory(newCat);
      DataStore.logAdminAction('CREATE_CATEGORY', 'category', newCat.id, `Created new category ${name}`);
      showToast(`Category "${name}" created.`);
    }

    setMarketplaceCategories(MarketplaceStore.getCategories());
    setIsModalOpen(false);
  };

  const handleDeleteMarketplaceCategory = (catId: string, catName: string) => {
    if (confirm(`Are you sure you want to delete the category "${catName}"?`)) {
      MarketplaceStore.deleteCategory(catId);
      DataStore.logAdminAction('DELETE_CATEGORY', 'category', catId, `Deleted category ${catName}`);
      setMarketplaceCategories(MarketplaceStore.getCategories());
      showToast(`Category "${catName}" deleted.`);
    }
  };

  const handleAddServiceCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceCat.trim()) return;
    if (serviceCategories.includes(newServiceCat.trim())) {
      showToast('Category already exists.');
      return;
    }
    const updated = [...serviceCategories, newServiceCat.trim()];
    setServiceCategories(updated);
    setNewServiceCat('');
    DataStore.logAdminAction('CREATE_SERVICE_CATEGORY', 'service_category', newServiceCat.trim(), `Added service category ${newServiceCat.trim()}`);
    showToast(`Added service category "${newServiceCat.trim()}".`);
  };

  const handleDeleteServiceCategory = (catName: string) => {
    if (confirm(`Remove service category "${catName}"?`)) {
      setServiceCategories(serviceCategories.filter(c => c !== catName));
      DataStore.logAdminAction('DELETE_SERVICE_CATEGORY', 'service_category', catName, `Removed service category ${catName}`);
      showToast(`Removed service category "${catName}".`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#061A4F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#F5B400] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Category Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize taxonomy for freelance services and physical campus products.
          </p>
        </div>

        {activeTab === 'marketplace' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#F5B400]" />
            <span>Add Marketplace Category</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'marketplace'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Physical Marketplace Categories ({marketplaceCategories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'services'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Freelance Service Categories ({serviceCategories.length})</span>
        </button>
      </div>

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketplaceCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#061A4F]">{cat.name}</span>
                  {cat.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">Slug: /{cat.slug}</div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  {cat.productCount || 0} Products Listed
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-[#061A4F] hover:bg-slate-100 rounded-lg transition"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMarketplaceCategory(cat.id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          
          {/* Add Service Category Input */}
          <form onSubmit={handleAddServiceCategory} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-3 max-w-xl">
            <input
              type="text"
              value={newServiceCat}
              onChange={(e) => setNewServiceCat(e.target.value)}
              placeholder="e.g. Architecture & CAD Drafting..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Add Category</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceCategories.map((c) => (
              <div
                key={c}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <span className="font-bold text-xs text-[#061A4F]">{c}</span>
                <button
                  onClick={() => handleDeleteServiceCategory(c)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Remove Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Add / Edit Marketplace Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#061A4F]">
                {editingCategory ? 'Edit Marketplace Category' : 'New Marketplace Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarketplaceCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Campus Fashion & Thrift"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what items fit into this category..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-[#061A4F] focus:ring-[#061A4F]"
                />
                <label htmlFor="featured" className="font-semibold text-slate-700 cursor-pointer">
                  Feature this category on Marketplace Homepage
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold rounded-xl shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

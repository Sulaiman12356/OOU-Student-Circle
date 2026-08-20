import React, { useState } from 'react';
import { DataStore } from '../../services/dataStore';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { OpportunityStore } from '../../services/opportunityStore';
import { MarketplaceCategory } from '../../types';
import { 
  Tags, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Store, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  X, 
  Save,
  Check,
  Search,
  Package
} from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'products' | 'jobs' | 'opportunities'>('services');
  
  // Product Categories
  const [productCategories, setProductCategories] = useState<MarketplaceCategory[]>(
    MarketplaceStore.getCategories()
  );
  
  // Service Categories
  const [serviceCategories, setServiceCategories] = useState<string[]>([
    'Graphics & Design',
    'Tech & Web Development',
    'Writing & Translation',
    'Video & Short Form Content',
    'Tutoring & Academics',
    'Digital Marketing & Social Media',
    'Photography & Event Coverage',
    'Fashion & Tailoring',
    'Hair & Beauty Grooming',
    'Business & Administrative Support'
  ]);

  // Job Categories
  const [jobCategories, setJobCategories] = useState<string[]>([
    'Web & App Development',
    'Graphic & Brand Identity',
    'Social Media Management',
    'Content Writing & Copywriting',
    'Video Editing & Reels',
    'Academic Tutoring & Assignments',
    'Event Ushering & Photography',
    'Campus Delivery & Errands',
    'Virtual Assistance',
    'Sales & Brand Ambassador'
  ]);

  // Opportunity Categories
  const [opportunityCategories, setOpportunityCategories] = useState<string[]>([
    'SIWES / Industrial Training Placement',
    'Undergraduate Internship',
    'Graduate Trainee Programme',
    'Academic Research Grant',
    'Innovation Hackathon & Pitch Competition',
    'Corporate Scholarship',
    'Student Campus Ambassador',
    'Fellowship & Leadership Cohort'
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id?: string; name: string; description?: string } | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setNewCatName('');
    setNewCatDesc('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const name = newCatName.trim();

    if (activeTab === 'services') {
      if (!serviceCategories.includes(name)) {
        setServiceCategories([...serviceCategories, name]);
        DataStore.logAdminAction('ADD_SERVICE_CATEGORY', 'category', name, `Added service category ${name}`);
        showToast(`Service category "${name}" added.`);
      }
    } else if (activeTab === 'products') {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCat: MarketplaceCategory = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        description: newCatDesc,
        productCount: 0,
        featured: false
      };
      MarketplaceStore.saveCategory(newCat);
      setProductCategories(MarketplaceStore.getCategories());
      DataStore.logAdminAction('ADD_PRODUCT_CATEGORY', 'category', newCat.id, `Added product category ${name}`);
      showToast(`Product category "${name}" added.`);
    } else if (activeTab === 'jobs') {
      if (!jobCategories.includes(name)) {
        setJobCategories([...jobCategories, name]);
        DataStore.logAdminAction('ADD_JOB_CATEGORY', 'category', name, `Added job category ${name}`);
        showToast(`Job category "${name}" added.`);
      }
    } else if (activeTab === 'opportunities') {
      if (!opportunityCategories.includes(name)) {
        setOpportunityCategories([...opportunityCategories, name]);
        DataStore.logAdminAction('ADD_OPPORTUNITY_CATEGORY', 'category', name, `Added opportunity category ${name}`);
        showToast(`Opportunity category "${name}" added.`);
      }
    }

    setIsModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleDeleteCategory = (catName: string, id?: string) => {
    if (confirm(`Are you sure you want to remove category "${catName}"?`)) {
      if (activeTab === 'services') {
        setServiceCategories(serviceCategories.filter(c => c !== catName));
      } else if (activeTab === 'products' && id) {
        MarketplaceStore.deleteCategory(id);
        setProductCategories(MarketplaceStore.getCategories());
      } else if (activeTab === 'jobs') {
        setJobCategories(jobCategories.filter(c => c !== catName));
      } else if (activeTab === 'opportunities') {
        setOpportunityCategories(opportunityCategories.filter(c => c !== catName));
      }
      DataStore.logAdminAction('DELETE_CATEGORY', 'category', catName, `Deleted category ${catName}`);
      showToast(`Category "${catName}" removed.`);
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
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Category Taxonomy Governance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure, curate, and optimize discovery taxonomy across services, products, jobs, and campus opportunities.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#061A4F] hover:bg-[#08226b] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-[#F5B400]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Navigation Tabs (4 required category domains) */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold max-w-2xl">
        
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'services'
              ? 'bg-white text-[#061A4F] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span>Services ({serviceCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-white text-[#061A4F] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-indigo-600" />
          <span>Products ({productCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'jobs'
              ? 'bg-white text-[#061A4F] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-600" />
          <span>Jobs ({jobCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'opportunities'
              ? 'bg-white text-[#061A4F] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-600" />
          <span>Opportunities ({opportunityCategories.length})</span>
        </button>

      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeTab === 'services' && (
          serviceCategories.map((cat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-xs text-[#061A4F]">{cat}</div>
                  <div className="text-[10px] text-slate-400">Service Category</div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                title="Remove Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}

        {activeTab === 'products' && (
          productCategories.map((cat) => (
            <div key={cat.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#061A4F]">{cat.name}</div>
                  <div className="text-[10px] text-slate-400">{cat.description || 'Marketplace Item'}</div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.name, cat.id)}
                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                title="Remove Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}

        {activeTab === 'jobs' && (
          jobCategories.map((cat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-xs text-[#061A4F]">{cat}</div>
                  <div className="text-[10px] text-slate-400">Job Classification</div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                title="Remove Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}

        {activeTab === 'opportunities' && (
          opportunityCategories.map((cat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-xs text-[#061A4F]">{cat}</div>
                  <div className="text-[10px] text-slate-400">Opportunity Domain</div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                title="Remove Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#061A4F]">
                Add {activeTab.slice(0, 1).toUpperCase() + activeTab.slice(1, -1)} Category
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Mobile App Development"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>

              {activeTab === 'products' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Short description for SEO and catalogue..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#061A4F] hover:bg-[#08226b] text-white rounded-xl font-bold transition shadow-md"
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

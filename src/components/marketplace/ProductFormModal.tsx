import React, { useState } from 'react';
import { ProductItem, ProductCondition, DeliveryOption, ProductStatus } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { MediaUploader } from '../common/MediaUploader';
import { 
  Package, 
  X, 
  MapPin, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Tag
} from 'lucide-react';

interface ProductFormModalProps {
  product?: ProductItem | null;
  vendorId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (product: ProductItem) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  vendorId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const vendor = MarketplaceStore.getVendorById(vendorId);
  const categories = MarketplaceStore.getCategories();

  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || categories[0]?.name || 'Fashion & Clothing');
  const [price, setPrice] = useState<number>(product?.price || 0);
  const [discountPrice, setDiscountPrice] = useState<string>(product?.discountPrice ? String(product.discountPrice) : '');
  const [quantity, setQuantity] = useState<number>(product?.quantity !== undefined ? product.quantity : 1);
  const [sku, setSku] = useState(product?.sku || `SKU-${Date.now().toString().slice(-4)}`);
  const [condition, setCondition] = useState<ProductCondition>(product?.condition || 'brand_new');
  const [campus, setCampus] = useState(product?.campus || 'Ago-Iwoye Main Campus');
  const [location, setLocation] = useState(product?.location || vendor?.location || 'Ago-Iwoye Main Campus');
  
  // Delivery & Pickup
  const [pickupAvailable, setPickupAvailable] = useState<boolean>(product?.pickupAvailable !== undefined ? product.pickupAvailable : true);
  const [pickupLocationDescription, setPickupLocationDescription] = useState(product?.pickupLocationDescription || 'Front of ICT Centre / Main Gate, Ago-Iwoye');
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean>(product?.deliveryAvailable !== undefined ? product.deliveryAvailable : true);
  const [deliveryFee, setDeliveryFee] = useState<number>(product?.deliveryFee || 500);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(product?.estimatedDeliveryTime || '24-48 Hours');

  // Images list
  const [images, setImages] = useState<string[]>(product?.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  ]);

  // Status
  const [status, setStatus] = useState<ProductStatus>(product?.status || 'published');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a product title.');
      return;
    }
    if (price <= 0) {
      setErrorMessage('Please enter a valid price in NGN.');
      return;
    }
    if (images.length === 0 || !images[0]) {
      setErrorMessage('Please upload at least one valid product image.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const parsedDiscount = discountPrice.trim() ? Number(discountPrice) : undefined;
      const deliveryOptions: DeliveryOption = pickupAvailable && deliveryAvailable ? 'both' : pickupAvailable ? 'campus_pickup' : 'vendor_delivery';

      const productItem: ProductItem = {
        id: product?.id || `prod-${Date.now()}`,
        vendorId,
        vendorName: vendor?.studentName || currentUser?.fullName || 'Student Vendor',
        vendorStoreName: vendor?.storeName || currentUser?.businessName || 'Campus Vendor',
        vendorPhoto: vendor?.profileImage || currentUser?.profilePhoto,
        isVendorVerified: vendor?.verificationStatus === 'approved',
        title: title.trim(),
        name: title.trim(),
        description: description.trim(),
        category,
        price,
        discountPrice: parsedDiscount && parsedDiscount < price ? parsedDiscount : undefined,
        quantity: Math.max(0, quantity),
        sku: sku.trim() || undefined,
        images,
        mainImage: images[0],
        condition,
        campus: campus.trim(),
        location: location.trim(),
        deliveryOptions,
        pickupAvailable,
        pickupLocationDescription: pickupAvailable ? pickupLocationDescription.trim() : undefined,
        deliveryAvailable,
        deliveryFee: deliveryAvailable ? deliveryFee : 0,
        estimatedDeliveryTime: estimatedDeliveryTime.trim(),
        status: quantity <= 0 ? 'out_of_stock' : status,
        views: product?.views || 0,
        ordersCount: product?.ordersCount || 0,
        salesCount: product?.salesCount || 0,
        rating: product?.rating || 5.0,
        reviewsCount: product?.reviewsCount || 0,
        isPromoted: product?.isPromoted || false,
        promotionType: product?.promotionType,
        isDemo: product?.isDemo || false,
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      MarketplaceStore.saveProduct(productItem);
      onSuccess?.(productItem);
      onClose();
    } catch (err) {
      setErrorMessage('Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        id="product-form-modal"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#F5B400]" />
            <h3 className="font-black text-lg">
              {product ? 'Edit Product Listing' : 'List New Campus Product'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              1. General Details
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Product Title *
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. Customized OOU Heavyweight Graphic Hoodie"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ProductCondition)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="brand_new">Brand New</option>
                  <option value="handmade">Handmade / Custom Crafted</option>
                  <option value="like_new">Like New (Mint)</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="used_good">Gently Used</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="published">Published (Active)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="paused">Paused</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  OOU Campus *
                </label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Ago-Iwoye Main Campus">Ago-Iwoye Main Campus</option>
                  <option value="Ago-Iwoye Mini Campus">Ago-Iwoye Mini Campus</option>
                  <option value="Sagamu Campus (CHS)">Sagamu Campus (CHS - Medical)</option>
                  <option value="Ayetoro Campus (Agric)">Ayetoro Campus (Agricultural Science)</option>
                  <option value="Ibogun Campus (Engineering)">Ibogun Campus (Engineering)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Hostel / Faculty / Campus Location *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Silver Hostel Area / Faculty of Science"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Full Description & Specifications *
              </label>
              <textarea 
                rows={4}
                required
                placeholder="Describe material, sizing, colors available, preparation time, flavor, and highlights..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              2. Pricing & Inventory Management
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Price (₦ NGN) *
                </label>
                <input 
                  type="number"
                  min={100}
                  required
                  placeholder="5000"
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-black text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Discount Price (₦ Optional)
                </label>
                <input 
                  type="number"
                  min={0}
                  placeholder="4500"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold text-rose-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Available Quantity (Stock) *
                </label>
                <input 
                  type="number"
                  min={0}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Item SKU / Code (Optional)
                </label>
                <input 
                  type="text"
                  placeholder="HD-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Photos */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <MediaUploader
              storagePathPrefix={`products/${product?.id || vendorId || 'new'}/images`}
              images={images}
              onChange={setImages}
              maxImages={6}
              label="3. Product Photography (Upload from Device)"
              helperText="Upload clear photos from your phone or computer. The first photo is your primary cover."
              aspectRatio="square"
              allowPrimarySelection={true}
            />
          </div>

          {/* Section 4: Fulfillment, Pickup & Delivery */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              4. Fulfillment & Campus Delivery Options
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup Option Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 font-bold text-xs text-slate-900 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={pickupAvailable}
                    onChange={(e) => setPickupAvailable(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Allow Free Campus Pickup</span>
                </label>
                {pickupAvailable && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Campus Pickup Spot / Landmark
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Front of ICT Centre, Ago-Iwoye Main Campus"
                      value={pickupLocationDescription}
                      onChange={(e) => setPickupLocationDescription(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Delivery Option Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 font-bold text-xs text-slate-900 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={deliveryAvailable}
                    onChange={(e) => setDeliveryAvailable(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Offer Hostel / Faculty Delivery</span>
                </label>
                {deliveryAvailable && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Delivery Fee (₦)
                      </label>
                      <input 
                        type="number"
                        min={0}
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Delivery Time
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Same Day / 24 hrs"
                        value={estimatedDeliveryTime}
                        onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 text-xs font-bold bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl shadow transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-[#F5B400]" />
              <span>{submitting ? 'Saving...' : product ? 'Update Product' : 'Publish Product to Marketplace'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

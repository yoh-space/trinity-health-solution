"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
  AlertCircle,
  ExternalLink,
  Package,
  Heart,
  Baby,
  Droplets,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  ProductItem,
  ProductForm,
  emptyProductForm,
  formFromProduct,
  PRODUCT_CATEGORIES,
} from "./types";
import { ProductEditor } from "./ProductEditor";

export function ProductsStudio() {
  const products = useQuery(anyApi.products.listForAdmin) as ProductItem[] | undefined;

  const createProduct = useMutation(anyApi.products.create);
  const updateProduct = useMutation(anyApi.products.update);
  const publishProduct = useMutation(anyApi.products.publish);
  const toggleStock = useMutation(anyApi.products.toggleStock);
  const removeProduct = useMutation(anyApi.products.remove);
  const reorderProducts = useMutation(anyApi.products.reorder);
  const seedProducts = useMutation(anyApi.products.ensureSeedProducts);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleStartCreate = () => {
    setForm({
      ...emptyProductForm,
      order: (products?.length ?? 0) + 1,
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleStartEdit = (item: ProductItem) => {
    setEditingItem(item);
    setForm(formFromProduct(item));
    setIsCreating(false);
  };

  const handleCancelEditor = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleFormChange = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      if (editingItem) {
        await updateProduct({
          id: editingItem._id as any,
          ...form,
        });
        showFeedback("Product updated successfully.");
      } else {
        await createProduct(form);
        showFeedback("New product created in draft mode.");
      }
      handleCancelEditor();
    } catch (err: any) {
      showError(err?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: ProductItem) => {
    const nextState = item.status !== "published";
    try {
      await publishProduct({
        id: item._id as any,
        publish: nextState,
      });
      showFeedback(
        nextState
          ? `"${item.titleEn}" published live!`
          : `"${item.titleEn}" moved to draft.`
      );
    } catch (err: any) {
      showError(err?.message || "Failed to update publish state.");
    }
  };

  const handleToggleStock = async (item: ProductItem) => {
    const nextStock = !item.inStock;
    try {
      await toggleStock({
        id: item._id as any,
        inStock: nextStock,
      });
      showFeedback(
        nextStock
          ? `"${item.titleEn}" marked as In Stock.`
          : `"${item.titleEn}" marked as Out of Stock.`
      );
    } catch (err: any) {
      showError(err?.message || "Failed to update stock status.");
    }
  };

  const handleDelete = async (item: ProductItem) => {
    if (!confirm(`Are you sure you want to delete "${item.titleEn}"?`)) return;
    try {
      await removeProduct({ id: item._id as any });
      showFeedback("Product removed from catalog.");
    } catch (err: any) {
      showError(err?.message || "Failed to delete product.");
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("Populate catalog with default maternal wellness and infant nutrition products?")) return;
    setSeeding(true);
    try {
      const res: any = await seedProducts();
      showFeedback(`Seeding complete: ${res?.productsInserted ?? 0} products inserted.`);
    } catch (err: any) {
      showError(err?.message || "Failed to seed default products.");
    } finally {
      setSeeding(false);
    }
  };

  const handleMoveOrder = async (item: ProductItem, direction: "up" | "down") => {
    if (!products) return;
    const sorted = [...products].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((p) => p._id === item._id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sorted.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    try {
      await reorderProducts({
        orderedIds: sorted.map((p) => p._id as any),
      });
      showFeedback("Product order updated.");
    } catch (err: any) {
      showError("Failed to update ordering.");
    }
  };

  // Filtered List
  const filteredProducts = (products ?? []).filter((p) => {
    const matchesSearch =
      p.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      p.titleAm.toLowerCase().includes(search.toLowerCase()) ||
      p.descriptionEn.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesStatus =
      filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const publishedCount = (products ?? []).filter((p) => p.status === "published").length;
  const inStockCount = (products ?? []).filter((p) => p.inStock).length;
  const outOfStockCount = (products ?? []).filter((p) => !p.inStock).length;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "lactation":
        return <Heart size={14} className="text-[#b45d34]" />;
      case "weaning":
        return <Baby size={14} className="text-[#1c573e]" />;
      case "wash":
        return <Droplets size={14} className="text-[#1c647b]" />;
      case "learning":
        return <BookOpen size={14} className="text-[#643c82]" />;
      default:
        return <Package size={14} className="text-[#1c573e]" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-5 rounded-3xl border border-[#dce6dc] bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#eef6f0] text-[#1c573e]">
              <ShoppingBag size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              Catalog & Content Studio
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-[#163826]">
            Maternal & Infant Products Studio
          </h2>
          <p className="mt-1 text-xs text-[#526a5b]">
            Manage lactation blends, infant complementary weaning cereals, WASH kits, and inventory settings on /products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#cbd8cb] bg-white px-3.5 py-2.5 text-xs font-bold text-[#2d4e39] transition hover:bg-[#f6faf6] disabled:opacity-50"
            title="Import official products if catalog is empty"
          >
            <RefreshCw size={13} className={seeding ? "animate-spin" : ""} />
            <span>Seed Default Products</span>
          </button>
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1c573e] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#154631] active:scale-95"
          >
            <Plus size={14} />
            <span>Add New Product</span>
          </button>
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-1 rounded-xl border border-[#d2ddd0] bg-[#f8faf6] px-3 py-2.5 text-xs font-semibold text-[#3b5444] transition hover:text-[#1c573e]"
          >
            <span>Live /products</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {feedbackMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#bfe3ca] bg-[#eef8f2] p-4 text-xs font-bold text-[#1a5732]">
          <CheckCircle2 size={16} />
          <span>{feedbackMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#f0c3c3] bg-[#fdf2f2] p-4 text-xs font-bold text-[#a12f2f]">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Active Editor Drawer / Modal */}
      {(isCreating || editingItem) && (
        <ProductEditor
          form={form}
          editing={!!editingItem}
          saving={saving}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelEditor}
        />
      )}

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#dce6dc] bg-white p-4">
          <p className="text-[11px] font-bold text-[#627768]">Total Products</p>
          <p className="mt-1 text-2xl font-black text-[#163826]">{products?.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-[#bfe3ca] bg-[#f3f9f4] p-4">
          <p className="text-[11px] font-bold text-[#1c573e]">Published Live</p>
          <p className="mt-1 text-2xl font-black text-[#1c573e]">{publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-[#bfe3ca] bg-[#f3f9f4] p-4">
          <p className="text-[11px] font-bold text-[#1c573e]">In Stock</p>
          <p className="mt-1 text-2xl font-black text-[#1c573e]">{inStockCount}</p>
        </div>
        <div className="rounded-2xl border border-[#f0dfcc] bg-[#fcf8f3] p-4">
          <p className="text-[11px] font-bold text-[#b45d34]">Out of Stock</p>
          <p className="mt-1 text-2xl font-black text-[#b45d34]">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filters and List */}
      <div className="rounded-3xl border border-[#dce6dc] bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e9485]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title or formulation..."
              className="w-full rounded-xl border border-[#cddad0] bg-white py-2 pl-9 pr-3 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl bg-[#f0f4ee] p-1 text-xs font-semibold">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterStatus === "all"
                  ? "bg-white text-[#1c573e] shadow-xs"
                  : "text-[#587061] hover:text-[#1c573e]"
              }`}
            >
              All ({products?.length ?? 0})
            </button>
            <button
              onClick={() => setFilterStatus("published")}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterStatus === "published"
                  ? "bg-white text-[#1c573e] shadow-xs"
                  : "text-[#587061] hover:text-[#1c573e]"
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterStatus === "draft"
                  ? "bg-white text-[#1c573e] shadow-xs"
                  : "text-[#587061] hover:text-[#1c573e]"
              }`}
            >
              Drafts ({(products?.length ?? 0) - publishedCount})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium border-t border-[#edf2ed] pt-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              selectedCategory === "all"
                ? "bg-[#1c573e] text-white font-bold"
                : "bg-[#f2f6f1] text-[#425d4c] hover:bg-[#e6efe5]"
            }`}
          >
            All Categories
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3.5 py-1.5 transition ${
                selectedCategory === cat.id
                  ? "bg-[#1c573e] text-white font-bold"
                  : "bg-[#f2f6f1] text-[#425d4c] hover:bg-[#e6efe5]"
              }`}
            >
              {cat.labelEn}
            </button>
          ))}
        </div>

        {/* Products List */}
        <div className="mt-6 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ccd9cc] py-12 text-center">
              <ShoppingBag size={28} className="mx-auto text-[#8ea394]" />
              <p className="mt-2 text-xs font-bold text-[#455c4c]">No products found</p>
              <p className="mt-1 text-[11px] text-[#788c7d]">
                Click "Seed Default Products" or "Add New Product" to populate the catalog.
              </p>
            </div>
          ) : (
            filteredProducts.map((item, index) => (
              <div
                key={item._id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e1eae1] bg-white p-5 shadow-2xs transition hover:border-[#b8cfba] sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3.5">
                  {/* Order Arrows */}
                  <div className="flex flex-col items-center gap-1 pt-1 text-[#7a8f81]">
                    <button
                      onClick={() => handleMoveOrder(item, "up")}
                      disabled={index === 0}
                      className="rounded p-0.5 hover:bg-[#eaf1e8] disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <span className="text-[10px] font-bold text-[#1c573e]">{item.order}</span>
                    <button
                      onClick={() => handleMoveOrder(item, "down")}
                      disabled={index === filteredProducts.length - 1}
                      className="rounded p-0.5 hover:bg-[#eaf1e8] disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  {/* Thumbnail / Category Icon */}
                  {item.coverImageUrl ? (
                    <img
                      src={item.coverImageUrl}
                      alt={item.titleEn}
                      className="size-14 shrink-0 rounded-xl border border-[#d2ddd0] object-cover"
                    />
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-[#d2ddd0] bg-[#f4f7f2] text-[#1c573e]">
                      {getCategoryIcon(item.category)}
                    </div>
                  )}

                  {/* Main Details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-[#f0f4ee] px-2.5 py-0.5 text-[10px] font-bold text-[#1c573e]">
                        {getCategoryIcon(item.category)}
                        <span>{item.badgeEn}</span>
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.status === "published"
                            ? "bg-[#eaf5ee] text-[#1a5f36]"
                            : "bg-[#fdf2e8] text-[#974d1a]"
                        }`}
                      >
                        {item.status === "published" ? "Published" : "Draft"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.inStock
                            ? "bg-[#eef8f1] text-[#1e613b]"
                            : "bg-[#fdeded] text-[#b33a3a]"
                        }`}
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <h4 className="mt-1 text-sm font-extrabold text-[#173827]">
                      {item.titleEn}
                      <span className="ml-2 font-normal text-[#597161]">({item.titleAm})</span>
                    </h4>

                    <p className="mt-0.5 text-xs font-semibold text-[#8b5a38]">
                      {item.subtitleEn}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[#718576]">
                      <span>Packaging: {item.formatEn}</span>
                      <span>•</span>
                      <span>{item.highlightsEn?.length ?? 0} benefits listed</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 border-t border-[#eaf0ea] pt-3 sm:border-0 sm:pt-0">
                  <button
                    onClick={() => handleToggleStock(item)}
                    className="rounded-xl border border-[#ccdacc] bg-white px-2.5 py-1.5 text-xs font-bold text-[#34513f] hover:bg-[#f6f8f5]"
                    title="Toggle stock availability"
                  >
                    {item.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                  </button>

                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      item.status === "published"
                        ? "border border-[#ccdacc] bg-white text-[#455c4d] hover:bg-[#f6f8f5]"
                        : "bg-[#1c573e] text-white hover:bg-[#154631]"
                    }`}
                  >
                    {item.status === "published" ? (
                      <>
                        <EyeOff size={12} />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye size={12} />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleStartEdit(item)}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#ccdacc] bg-white px-3 py-1.5 text-xs font-bold text-[#1c573e] transition hover:bg-[#f4f8f4]"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-xl p-1.5 text-[#97a69b] transition hover:bg-[#fbeaea] hover:text-[#b43d3d]"
                    title="Delete product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

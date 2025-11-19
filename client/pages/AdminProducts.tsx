import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Loader2,
  Search,
  X,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "@/lib/products";
import { getStoredUser, clearUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";

const ITEMS_PER_PAGE = 10;

export default function AdminProducts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getStoredUser();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    price: 0,
    features: "",
    image_url: "",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/admin/login");
    }
  }, [currentUser, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch products";
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Apply search and filter
  useEffect(() => {
    let result = products;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((product) => product.status === statusFilter);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, statusFilter]);

  const handleLogout = () => {
    clearUser();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate("/admin/login");
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      errors.name = "Product name is required";
    }

    if (formData.price !== undefined && formData.price < 0) {
      errors.price = "Price cannot be negative";
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      errors.image_url = "Please enter a valid URL";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      price: 0,
      features: "",
      image_url: "",
      status: "active",
    });
    setFormErrors({});
    setHasUnsavedChanges(false);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setFormErrors({});
    setHasUnsavedChanges(false);
    setShowForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
    setHasUnsavedChanges(true);
    // Clear error for this field when user starts editing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCloseForm = () => {
    if (hasUnsavedChanges) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to discard them?",
        )
      ) {
        return;
      }
    }
    setShowForm(false);
    setHasUnsavedChanges(false);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct.id, formData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Create new product
        const result = await createProduct(formData as any);
        if (result.success) {
          toast({
            title: "Success",
            description: "Product created successfully",
          });
        }
      }

      // Refresh products list
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setShowForm(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save product";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      // Refresh products list
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        onLogout={handleLogout}
        userName={currentUser.name || currentUser.email}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground mt-1">
                Manage financial products and services
              </p>
            </div>
            <button
              onClick={handleNewProduct}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing {paginatedProducts.length > 0 ? startIndex + 1 : 0} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}{" "}
              of {filteredProducts.length} products
            </p>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        formErrors.name ? "border-red-500" : "border-border"
                      } bg-white focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="e.g., Fair Personal Loans"
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Loans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price (KES)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || 0}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        formErrors.price ? "border-red-500" : "border-border"
                      } bg-white focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="0"
                      step="0.01"
                      min="0"
                    />
                    {formErrors.price && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Product description..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Features
                    </label>
                    <textarea
                      name="features"
                      value={formData.features || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Key features (comma-separated)..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url || ""}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        formErrors.image_url
                          ? "border-red-500"
                          : "border-border"
                      } bg-white focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="https://..."
                    />
                    {formErrors.image_url && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.image_url}
                      </p>
                    )}
                    {formData.image_url && !formErrors.image_url && (
                      <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() =>
                            setFormErrors((prev) => ({
                              ...prev,
                              image_url: "Failed to load image",
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status || "active"}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-gray-100 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {selectedProduct ? "Update" : "Create"} Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">No products yet</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Create your first product to get started.
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900">
                  No products match
                </h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Created
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 rounded-md object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "";
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                              No image
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {product.category || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {product.price
                            ? `KES ${product.price.toLocaleString()}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                          <span className="line-clamp-2">
                            {product.description || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === "active"
                                ? "bg-green-100 text-green-700"
                                : product.status === "inactive"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(product.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded text-primary hover:bg-primary/10 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "border border-border bg-white hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

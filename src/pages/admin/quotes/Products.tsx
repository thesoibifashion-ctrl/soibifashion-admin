// "use client";

// import { useMemo, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Search, ChevronDown, Package, Pencil, Trash2 } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { getProducts, deleteProduct } from "@/api/products";

// interface Product {
//   id: string;
//   name: string;
//   slug: string;
//   basePrice: number;
//   category: string;
//   isFeatured?: boolean;
//   images?: { imageUrl: string; isPrimary: boolean }[];
//   sizes?: number[];
//   createdAt?: string;
// }

// const fmt = (value: number) => `₦${value.toLocaleString()}`;

// const ProductsAdminPage = () => {
//   const queryClient = useQueryClient();

//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [selected, setSelected] = useState<string[]>([]);

//   const { data, isLoading } = useQuery({
//     queryKey: ["products"],
//     queryFn: getProducts,
//     staleTime: 1000 * 60 * 5,
//   });

//   const { mutate: removeProduct, isPending: isDeleting } = useMutation({
//     mutationFn: deleteProduct,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   const products = data ?? [];

//   const filtered = useMemo(() => {
//     let list = products;

//     if (categoryFilter) {
//       list = list.filter((p) => p.category === categoryFilter);
//     }

//     if (search.trim()) {
//       const q = search.trim().toLowerCase();
//       list = list.filter((p) => p.name.toLowerCase().includes(q));
//     }

//     const sorted = [...list];

//     if (sort === "newest") {
//       sorted.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
//     } else if (sort === "priceHigh") {
//       sorted.sort((a, b) => b.basePrice - a.basePrice);
//     } else if (sort === "priceLow") {
//       sorted.sort((a, b) => a.basePrice - b.basePrice);
//     } else if (sort === "name") {
//       sorted.sort((a, b) => a.name.localeCompare(b.name));
//     }

//     return sorted;
//   }, [products, search, sort, categoryFilter]);

//   const toggleSelected = (id: string) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     setSelected((prev) =>
//       prev.length === filtered.length ? [] : filtered.map((p) => p.id)
//     );
//   };

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-[#0B0B0B]">Products</h1>
//           <p className="text-sm text-gray-500">Manage your product catalog.</p>
//         </div>

//         <span className="rounded-full bg-[#C9A227]/10 px-4 py-2 text-sm font-semibold text-[#8a6d15]">
//           {products.length} Products
//         </span>
//       </div>

//       {/* Search / Sort / Filter */}
//       <div className="grid gap-4 sm:grid-cols-3">
//         <div>
//           <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
//             Search
//           </label>

//           <div className="relative">
//             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <Input
//               placeholder="Search products"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
//             Sort
//           </label>

//           <div className="relative">
//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="h-11 w-full appearance-none rounded-xl border bg-white px-3 pr-9 text-sm outline-none focus:border-[#C9A227]"
//             >
//               <option value="newest">Newest</option>
//               <option value="priceHigh">Price: High to Low</option>
//               <option value="priceLow">Price: Low to High</option>
//               <option value="name">Name (A–Z)</option>
//             </select>
//             <ChevronDown
//               size={16}
//               className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
//             Filter
//           </label>

//           <div className="relative">
//             <select
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//               className="h-11 w-full appearance-none rounded-xl border bg-white px-3 pr-9 text-sm outline-none focus:border-[#C9A227]"
//             >
//               <option value="">All Categories</option>
//               <option value="Shoes">Shoes</option>
//               <option value="Accessories">Accessories</option>
//             </select>
//             <ChevronDown
//               size={16}
//               className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//           </div>
//         </div>
//       </div>

//       {/* List */}
//       <div className="overflow-hidden rounded-2xl border bg-white">
//         <div className="grid grid-cols-[auto_1fr_120px_120px_100px_140px] items-center gap-4 border-b bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//           <input
//             type="checkbox"
//             checked={selected.length > 0 && selected.length === filtered.length}
//             onChange={toggleSelectAll}
//             className="h-4 w-4 accent-[#C9A227]"
//           />
//           <span>Product</span>
//           <span>Price</span>
//           <span>Category</span>
//           <span>Sizes</span>
//           <span>Actions</span>
//         </div>

//         {isLoading ? (
//           <div className="p-10 text-center text-sm text-gray-500">Loading products...</div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center gap-3 p-12 text-center">
//             <Package size={32} className="text-gray-300" />
//             <p className="text-sm text-gray-500">No products found.</p>
//           </div>
//         ) : (
//           filtered.map((product) => {
//             const image = product.images?.find((img) => img.isPrimary)?.imageUrl
//               ?? product.images?.[0]?.imageUrl;

//             return (
//               <div
//                 key={product.id}
//                 className="grid grid-cols-[auto_1fr_120px_120px_100px_140px] items-center gap-4 border-b px-5 py-4 last:border-b-0 hover:bg-gray-50"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selected.includes(product.id)}
//                   onChange={() => toggleSelected(product.id)}
//                   className="h-4 w-4 accent-[#C9A227]"
//                 />

//                 <div className="flex items-center gap-3">
//                   <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
//                     {image ? (
//                       <img src={image} alt={product.name} className="h-full w-full object-cover" />
//                     ) : (
//                       <div className="flex h-full w-full items-center justify-center text-gray-300">
//                         <Package size={18} />
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <p className="text-sm font-semibold text-[#0B0B0B]">{product.name}</p>
//                     {product.isFeatured && (
//                       <span className="text-xs text-[#C9A227]">Featured</span>
//                     )}
//                   </div>
//                 </div>

//                 <span className="text-sm font-medium">{fmt(product.basePrice)}</span>

//                 <span className="text-sm text-gray-600">{product.category}</span>

//                 <span className="text-sm text-gray-600">{product.sizes?.length ?? 0}</span>

//                 <div className="flex items-center gap-2">
//                   <Button type="button" variant="outline" size="icon" title="Edit">
//                     <Pencil size={14} />
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="icon"
//                     title="Delete"
//                     disabled={isDeleting}
//                     onClick={() => removeProduct(product.id)}
//                     className="text-red-600 hover:bg-red-50"
//                   >
//                     <Trash2 size={14} />
//                   </Button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductsAdminPage;


const Products = () => {
  return (
    <div>Products</div>
  )
}

export default Products
import { ProductList } from "@/components/ProuductList";

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Product List</h1>
      <ProductList />
    </div>
  )
}


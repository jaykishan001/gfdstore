import { ProductUploadForm } from "@/components/ProductUploadForm"

export default function ProductUploadPage() {
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl text-center font-bold mt-20">Upload New Product</h1>
      <ProductUploadForm />
    </div>
  )
}

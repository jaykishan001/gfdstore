import { ProductUploadForm } from "@/components/ProductUploadForm"
import { Suspense } from "react"

export default function ProductUploadPage() {
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl text-center font-bold mt-20">Upload New Product</h1>
      <Suspense fallback={<div>Loading...</div>}>
      <ProductUploadForm />
      </Suspense>
    </div>
  )
}

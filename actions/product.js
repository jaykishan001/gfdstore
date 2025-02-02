"use server"
import { revalidatePath } from "next/cache"
export async function deleteProduct(productId) {
  try {
    const response = await fetch(`/api/product?id=${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete product")
    }

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}

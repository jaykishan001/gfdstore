"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteProduct } from "../../actions/product"
import { redirect } from "next/dist/server/api-utils"
import { useRouter } from "next/navigation"

export function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const limit = 10

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product", {
          params: { page: currentPage, limit, search: searchTerm },
        })
        setProducts(response.data.products)
        setTotalPages(response.data.totalPages)
      } catch (err) {
        setError("Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, searchTerm])

  // const handleDelete = async (productId) => {
  //   try {
  //     await deleteProduct(productId)
  //     setProducts(products.filter((product) => product._id !== productId))
  //   } catch (error) {
  //     console.error("Failed to delete product:", error)
  //     // Optionally, show an error message to the user
  //   }
  // }

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      // Re-fetch product list after deletion
      const response = await axios.get("/api/product", {
        params: { page: currentPage, limit, search: searchTerm },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };
  
  
  const router = useRouter();

  // const handleEdit = (productId) => {
  //   router.push(`/admin/products/upload?id=${productId}`);
  // };

  if (loading) return <div className="text-center py-10">Loading products...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>Add New Product</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Product ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product._id.slice(-6)}</TableCell>
                <TableCell>
                  <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="object-cover rounded"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {/* <Button onClick={()=>handleEdit(product._id)} variant="ghost" size="icon" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}


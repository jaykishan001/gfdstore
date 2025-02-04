"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select or add a category.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number.",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number.",
  }),
  sizeOptions: z.array(z.string()).min(1, {
    message: "Please add at least one size option.",
  }),
  images: z.array(z.instanceof(File)).min(1, {
    message: "Please upload at least one image.",
  }),
  coupon: z.string().optional(),
})

const predefinedSizes = ["XS", "S", "M", "L", "XL", "XXL"]
const predefinedCategories = ["Clothing", "Accessories", "Footwear"]

export function ProductUploadForm() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [sizeOptions, setSizeOptions] = useState([])
  const [newSize, setNewSize] = useState("")
  const [isEditing, setIsEditing] = useState(!!id) // Determine if we're editing or creating

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      sizeOptions: [],
      images: [],
      coupon: "",
    },
  })

  
  useEffect(() => {
    if (id) {
      const fetchProductData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/productinfo/?productId=${id}`)
          const productData = response.data.data
          form.reset({
            name: productData.name,
            description: productData.description,
            category: productData.category,
            price: productData.price.toString(),
            stock: productData.stock.toString(),
            sizeOptions: productData.sizeOptions,
            coupon: productData.coupon || "",
          })
          setSizeOptions(productData.sizeOptions)
        } catch (error) {
          console.error("Error fetching product data:", error)
        }
      }
      fetchProductData()
    }
  }, [id, form])


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/category")
        setCategories(response.data.data)
      } catch (error) {
        console.error("Error fetching categories:", error.message)
      }
    }
    fetchCategories()
  }, [])


  const onSubmit = async (values) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("description", values.description)
    formData.append("category", values.category)
    formData.append("price", values.price)
    formData.append("stock", values.stock)
    formData.append("coupon", values.coupon || "")
    values.sizeOptions.forEach((size) => formData.append("sizeOptions", size))
    values.images.forEach((image) => formData.append("images", image))

    try {
     
        await axios.post("http://localhost:3000/api/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        console.log("Product created successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message)
    }
  }


  const addCategory = () => {
    if (newCategory && !categories.some((cat) => cat.name === newCategory)) {
      const newCategoryObj = { name: newCategory, _id: newCategory.toLowerCase().replace(/\s/g, "-") }
      setCategories([...categories, newCategoryObj])
      form.setValue("category", newCategoryObj._id)
      setNewCategory("")
    }
  }

  const addSizeOption = () => {
    if (newSize && !sizeOptions.includes(newSize)) {
      setSizeOptions((prev) => [...prev, newSize])
      form.setValue("sizeOptions", [...sizeOptions, newSize])
      setNewSize("")
    }
  }


  const toggleSizeOption = (size) => {
    const updatedSizes = sizeOptions.includes(size)
      ? sizeOptions.filter((s) => s !== size)
      : [...sizeOptions, size]
    setSizeOptions(updatedSizes)
    form.setValue("sizeOptions", updatedSizes)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-28">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start">
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Category
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Category</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                              <Input
                                placeholder="New category name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                              />
                              <Button onClick={addCategory}>Add</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter product description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="sizeOptions"
              render={() => (
                <FormItem>
                  <FormLabel>Size Options</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {predefinedSizes.map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox
                              id={size}
                              checked={sizeOptions.includes(size)}
                              onCheckedChange={() => toggleSizeOption(size)}
                            />
                            <label
                              htmlFor={size}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {size}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add custom size"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                        />
                        <Button type="button" onClick={addSizeOption}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sizeOptions
                          .filter((size) => !predefinedSizes.includes(size))
                          .map((size) => (
                            <div
                              key={size}
                              className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                            >
                              {size}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-auto p-0"
                                onClick={() => toggleSizeOption(size)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        field.onChange(files)
                      }}
                    />
                  </FormControl>
                  <FormDescription>Upload one or more images of the product.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="coupon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter coupon code" {...field} />
                  </FormControl>
                  <FormDescription>Create a coupon code for this product if desired.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Product"
          )}
        </Button>
      

        {/* <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Uploading..."}
            </>
          ) : (
            isEditing ? "Edit Product" : "Add New Product"
          )}
        </Button> */}
      </form>
    </Form>
  )
}
"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const products = [
  {
    id: "1",
    name: "Product 1",
    price: 19.99,
    imageUrl:
      "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "This is a detailed description of Product 1. It's an amazing item that you'll love!",
    category: "Electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Product 2",
    price: 29.99,
    imageUrl:
      "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Product 2 is a high-quality item perfect for your needs. Don't miss out!",
    category: "Home & Living",
    inStock: true,
  },
  {
    id: "3",
    name: "Product 3",
    price: 39.99,
    imageUrl:
      "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Discover the amazing features of Product 3. It's a game-changer in its category!",
    category: "Fashion",
    inStock: false,
  },
  {
    id: "4",
    name: "Product 4",
    price: 49.99,
    imageUrl:
      "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Product 4 is the ultimate solution for your everyday needs. Try it today!",
    category: "Electronics",
    inStock: true,
  },
  {
    id: "5",
    name: "Product 5",
    price: 59.99,
    imageUrl:
      "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Experience luxury with Product 5. It's the perfect addition to your collection!",
    category: "Fashion",
    inStock: true,
  },
]

export default function ProductPage({ params }) {
  const product = products.find((p) => p.id === params.id)
  const [quantity, setQuantity] = useState(1)
  if (!product) {
    notFound()
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 10)

  return (
    <div className="container mx-auto py-8 px-4 mt-10">
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <Link href="/product" className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                Products
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <span className="ml-1 text-gray-500 md:ml-2">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div
          className="relative overflow-hidden rounded-lg"
        >
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            width={800}
            height={600}
            className={`w-full h-auto transition-transform duration-300`}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4">{product.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Category:</span> {product.category}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Availability:</span>
            {product.inStock ? (
              <span className="text-green-600 ml-2">In Stock</span>
            ) : (
              <span className="text-red-600 ml-2">Out of Stock</span>
            )}
          </div>
          <div className="flex items-center mb-4">
            <span className="font-semibold mr-4">Quantity:</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={!product.inStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-4 text-xl">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} disabled={!product.inStock}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button className="w-full" disabled={!product.inStock}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Card key={relatedProduct.id}>
              <CardContent className="p-4">
                <Image
                  src={relatedProduct.imageUrl || "/placeholder.svg"}
                  alt={relatedProduct.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                <p className="text-gray-600 mb-2">${relatedProduct.price.toFixed(2)}</p>
                <Link href={`/products/${relatedProduct.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}



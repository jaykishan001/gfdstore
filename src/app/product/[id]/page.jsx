"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { triggerCartUpdate } from "@/components/CartIcon"
import axios from "axios"


//make an api call to fetch all the product of smame categie and add it to product state for suggestions

export default function ProductPage({ params }) {
  const [products, setProducts]= useState([]);
  const product = products.find((p) => p.id === params.id);
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(()=>{
    const fetchProducts = async()=> {
      try {
        const response = await axios.get('http:/localhost:3000/api/products');
        setProducts(response.data.products);

      } catch (error) {
        setError('Failed to fetch products');
      }
      finally {
        setLoading(false);
      }
    }
  })

   if (!product) {
    notFound()
   }


  const handleCart = ()=>{
     const existingCart = JSON.parse(window.localStorage.getItem("cart")) || [];
     const isInCart = existingCart.some((item)=> item.id === product.id);

     if(!isInCart){
      const updateCart = [...existingCart, product];
      window.localStorage.setItem("cart", JSON.stringify(updateCart));
      setCartItems(updateCart);
      triggerCartUpdate();
     }
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
          <Button onClick={handleCart} className="w-full" disabled={!product.inStock}>
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



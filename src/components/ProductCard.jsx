"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ProductCard({ id, name, price, imageUrl }) {
  const [isInWishlist, setIsInWishlist] = useState(false)

  const handleWishlistClick = (e) => {
    e.preventDefault() 
    setIsInWishlist(!isInWishlist)
    console.log(`${isInWishlist ? "Removed from" : "Added to"} wishlist:`, id)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    console.log("Added to cart:", id)
  }

  return (
    <Link href={`/product/${id}`} passHref>
      <Card className="w-full max-w-xs mx-auto cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
        <CardContent className="p-3">
          <div className="relative w-full h-40 overflow-hidden group rounded-md">
            {/* Image with Zoom Effect on Hover */}
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="rounded-md transform transition-transform duration-300 group-hover:scale-105"
            />
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-200"
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            </button>
          </div>
          <h3 className="text-base font-semibold mt-3 truncate">{name}</h3>
          <p className="text-gray-600 text-sm">${price?.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-3">
          <Button onClick={handleAddToCart} className="w-full py-1 text-sm hover:bg-primary/90 transition duration-200">
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

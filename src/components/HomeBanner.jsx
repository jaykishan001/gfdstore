"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

export function HomeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-screen overflow-hidden">
      <Carousel className="w-full">
        <CarouselContent
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <CarouselItem key={index} className="w-full flex-shrink-0">
              <div className="p-1">
                <Card className="h-[30vh] lg:h-[40vh] overflow-hidden">
                  <CardContent className="relative w-full h-full p-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      layout="fill" 
                      objectFit="cover"
                      alt={`Slide ${index + 1}`}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Left Arrow */}
        <CarouselPrevious
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
            )
          }
        />

        {/* Right Arrow */}
        <CarouselNext
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)}
        />
      </Carousel>
    </div>
  )
}

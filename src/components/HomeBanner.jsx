import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"

export function HomeBanner() {
  return (
    <Carousel className="w-full max-w-screen -z-50">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="h-[30vh] lg:h-[40vh]">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <Link href={`https://example.com/page${index + 1}`} passHref> {/* Replace with actual links */}
                    <a className="w-full h-full">
                      <img 
                        src={`https://via.placeholder.com/150?text=Image+${index + 1}`} 
                        alt={`Banner ${index + 1}`} 
                        className="w-full h-full object-cover cursor-pointer" 
                      />
                    </a>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

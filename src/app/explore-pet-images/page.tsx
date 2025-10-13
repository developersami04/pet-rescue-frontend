
import { PageHeader } from "@/components/page-header";
import { exploreImages, UnsplashImage } from "@/lib/page-data/explore-images";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";

function ImageCard({ image }: { image: UnsplashImage }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <p className="text-white text-center p-4">{image.alt}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-4">
        <DialogHeader>
          <DialogTitle>{image.alt}</DialogTitle>
          <DialogDescription>
            Photo by{" "}
            <a href={image.authorUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
              {image.author}
            </a>{" "}
            on Unsplash
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-full w-full">
          <Image src={image.url} alt={image.alt} fill className="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ExplorePetImagesPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Explore Pet Images"
        description="A gallery of beautiful pet images from Unsplash to inspire you."
      />
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {exploreImages.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
       <p className="text-center text-sm text-muted-foreground mt-8">
        All images are from{" "}
        <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          Unsplash
        </a>.
      </p>
    </div>
  );
}

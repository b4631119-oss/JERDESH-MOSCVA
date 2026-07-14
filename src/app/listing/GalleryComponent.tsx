"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function GalleryComponent({ images, title }: { images: string[]; title: string }) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="relative aspect-square rounded-3xl overflow-hidden shadow-sm mb-4 bg-gray-200 cursor-zoom-in group"
      >
        <Image 
          src={mainImage} 
          alt={title} 
          fill 
          className="object-cover transition-all duration-500 group-hover:scale-105" 
          priority 
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-sm">
          Увеличить
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url: string, i: number) => (
            <div 
              key={i} 
              onClick={() => setMainImage(url)}
              className={`w-20 h-20 relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                mainImage === url ? "border-blue-500 scale-95 shadow-md" : "border-transparent hover:border-blue-300"
              } bg-gray-100`}
            >
              <Image src={url} alt={`thumb-${i}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={mainImage} 
              alt={title} 
              fill 
              className="object-contain" 
            />
          </div>
        </div>
      )}
    </>
  );
}
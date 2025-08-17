import { useState, useEffect } from "react";
import mainBanner from "../../assets/banner.png"
import mainBanner2 from "../../assets/banner2.png"



export default function ImageSlider() {
  const images = [
  
   mainBanner2,
    mainBanner
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex justify-center py-6 w-full overflow-hidden">
    <div className="w-[90%] h-[250px] contain md:h-[600px] rounded-2xl border-black border-1">
      {/* Image */}
      <div className="overflow-hidden rounded-2xl">
        <img
          src={images[current]}
          alt="Slide"
          className="w-full h-[250px] md:h-[600px]  object-auto transition-all duration-500"
        />
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="relative bottom-30 left-[5%] md:bottom-80 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="relative bottom-30 left-[80%]  md:bottom-80 md:left-[90%]  -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
      >
        ❯
      </button>

      {/* Dots */}
      {/* <div className="flex justify-center mt-2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-gray-800" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div> */}
    </div>
    </div>
  );
}

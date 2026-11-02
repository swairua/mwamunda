import { useState, useEffect } from "react";

interface HeroSliderProps {
  autoPlay?: boolean;
  interval?: number;
}

export default function HeroSlider({
  autoPlay = true,
  interval = 5000,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2Fefd1420552484b6a9a2406a4e685d75a?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2Ff77b7379aff34c41bad00c584a5a12d2?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2F060dff18bacf407aac8af7d66fefce9d?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2Fd0cade1647d142efbd9e642ff77edbbb?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2F57bdf64481ac4745a5221164754528b8?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2F7891a322c40649f99465c4ccac0c18e7?format=webp&width=800&height=1200",
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Slides */}
      <div className="relative w-full h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transition: "opacity 2s ease-out",
            }}
          >
            <img
              src={slide}
              alt={`Hero slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Transparent green overlay */}
            <div className="absolute inset-0 bg-green-600/40" />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

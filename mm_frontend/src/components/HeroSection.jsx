import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Mouse } from 'lucide-react';

const HeroSection = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);

  // Video slides data - using local videos
  const slides = [
    {
      video: '/src/assets/vdo/keyboard.mp4',
      title: 'MoMo Pro',
      subtitle: 'PRO GAMING',
      description: 'ประสบการณ์เกมมิ่งระดับโปรด้วย Gaming Gear คุณภาพสูง',
      buttonText: 'สั่งซื้อตอนนี้',
      buttonLink: 'keyboards'
    },
    {
      video: '/src/assets/vdo/mouse.mp4',
      title: 'Gaming Mouse',
      subtitle: 'PRECISION CONTROL',
      description: 'เมาส์เกมมิ่งที่ตอบสนองทุกการเคลื่อนไหว',
      buttonText: 'ดูสินค้า',
      buttonLink: 'mice'
    },
    {
      video: '/src/assets/vdo/headsets.mp4',
      title: 'Gaming Headset',
      subtitle: 'IMMERSIVE SOUND',
      description: 'หูฟังเกมมิ่งเสียงรอบทิศทางสมจริง',
      buttonText: 'ดูสินค้า',
      buttonLink: 'headsets'
    }
  ];

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Play current video when slide changes
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.currentTime = 0;
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {/* Video Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Video Background */}
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
          >
            <source src={slide.video} type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

          {/* Content */}
          <div className={`relative z-20 flex flex-col items-center justify-center h-full text-center px-6 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            {/* Title with animation */}
            <h1 className={`text-4xl md:text-7xl font-bold text-white mb-3 tracking-tight transition-all duration-700 delay-100 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {slide.title}
            </h1>

            {/* Subtitle with animation */}
            <p className={`text-xl md:text-2xl text-white/90 font-semibold mb-4 transition-all duration-700 delay-200 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {slide.subtitle}
            </p>

            {/* Description with animation */}
            <p className={`text-white/80 text-base md:text-lg max-w-xl mb-8 transition-all duration-700 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {slide.description}
            </p>

            {/* Button with animation */}
            <button
              onClick={() => onNavigate && onNavigate(slide.buttonLink)}
              className={`px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-700 delay-400 transform hover:scale-105 shadow-lg ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {slide.buttonText}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${index === currentSlide
              ? 'w-8 h-2 bg-white rounded-full'
              : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/80'
              }`}
          />
        ))}
      </div>


    </div>
  );
};

export default HeroSection;
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import OfficialWhatsAppIcon from './OfficialWhatsAppIcon';
import { useShop } from '../context/ShopContext';

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: '/assets/hero_banner_1.jpg',
    alt: 'Diwali Festive Threads - Flat 15% Off On All Our Products',
    badge: 'Diwali Festive Offer • Code: DIWALI15',
    headline: 'Diwali Festive Threads',
    subtext: 'Flat 15% Off on pure handloom silks & regal silhouettes',
  },
  {
    id: 2,
    image: '/assets/hero_banner_2.jpg',
    alt: 'The Diwali Edit - Handcrafted Indian Ethnic & Indo-Western Sets',
    badge: 'Grand Festive Edit 2026',
    headline: 'The Diwali Edit',
    subtext: 'Handcrafted kurtas, shararas and luxury festive coordinates',
  },
  {
    id: 3,
    image: '/assets/hero_banner_3.jpg',
    alt: 'The Diwali Edit - Regal Handloom Silks and Artisanal Needlework',
    badge: 'Artisanal Needlework • Limited Edition',
    headline: 'Timeless Festive Glamour',
    subtext: 'Crafted with fine French seams and mindful custom fits',
  },
];

export default function HeroSection() {
  const { setSelectedCategory } = useShop();

  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heroSettings, setHeroSettings] = useState({
    whatsappNumber: '918767547517',
  });

  // Touch swipe handling
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHero = async () => {
      try {
        const res = await fetch('/api/settings/hero');
        const data = await res.json();
        if (isMounted && data.success && data.hero) {
          setHeroSettings((prev) => ({
            ...prev,
            ...data.hero,
          }));

          // If custom banners are provided by backend, use them
          if (Array.isArray(data.hero.banners) && data.hero.banners.length > 0) {
            setSlides(
              data.hero.banners.map((img, idx) => ({
                id: idx + 1,
                image: img,
                alt: `Sui Dhaga Hero Banner ${idx + 1}`,
                badge: 'Grand Festive Edit 2026',
                headline: 'Sui-Dhaga Festive Collection',
                subtext: 'Pure handloom silks and royal silhouettes',
              }))
            );
          }
        }
      } catch (err) {
        console.warn('Hero settings load notice:', err.message);
      }
    };
    fetchHero();
    return () => {
      isMounted = false;
    };
  }, []);

  // Autoplay timer (5 seconds)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const scrollToProducts = () => {
    setSelectedCategory('All');
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const cleanPhone = (heroSettings.whatsappNumber || '918767547517').replace(/\D/g, '');

  return (
    <section
      className="hero-slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#1c080e',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
      }}
    >
      {/* Slides Container */}
      <div
        className="hero-carousel-viewport"
        onClick={scrollToProducts}
        style={{
          position: 'relative',
          width: '100%',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        title="Click to explore the Festive Collection"
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id || idx}
              className={`hero-slide-item ${isActive ? 'active' : ''}`}
              style={{
                position: idx === 0 ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out',
                transform: isActive ? 'scale(1)' : 'scale(1.02)',
                zIndex: isActive ? 2 : 1,
              }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="hero-banner-img"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  maxHeight: '680px',
                }}
              />
            </div>
          );
        })}

        {/* Previous Arrow Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="hero-arrow-btn hero-arrow-prev"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next Arrow Button */}
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="hero-arrow-btn hero-arrow-next"
        >
          <ChevronRight size={24} />
        </button>

        {/* Floating Controls at Bottom: Dots & WhatsApp Styling Pill */}
        <div
          className="hero-bottom-controls"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Slide Indicator Dots */}
          <div className="hero-dots-container">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`hero-dot-indicator ${idx === currentSlide ? 'active' : ''}`}
                aria-label={`Go to banner ${idx + 1}`}
              />
            ))}
          </div>

          {/* Quick WhatsApp Styling Assistance Chip */}
          <a
            href={`https://wa.me/${cleanPhone}?text=Hi%20SuiDhaga%20Team!%20I'm%20browsing%20the%20Diwali%20collection%20on%20the%20website%20and%20would%20love%20styling%20guidance.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-wa-chip"
            title="Chat directly on WhatsApp with SuiDhaga Styling Team"
          >
            <OfficialWhatsAppIcon size={16} color="#25D366" />
            <span>Talk to Sui Dhaga Team</span>
          </a>
        </div>
      </div>

      <style>{`
        .hero-slider-section {
          user-select: none;
        }

        .hero-carousel-viewport {
          position: relative;
          background: #1c080e;
          min-height: 220px;
        }

        .hero-banner-img {
          width: 100%;
          display: block;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          object-position: center;
        }

        /* Navigation Arrows */
        .hero-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(28, 8, 14, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.45);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.25s, transform 0.2s, border-color 0.2s;
          opacity: 0.85;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
        }
        .hero-arrow-btn:hover {
          background: rgba(107, 29, 47, 0.85);
          border-color: #ffd700;
          color: #ffd700;
          transform: translateY(-50%) scale(1.08);
          opacity: 1;
        }
        .hero-arrow-prev {
          left: 1.5rem;
        }
        .hero-arrow-next {
          right: 1.5rem;
        }

        /* Bottom Controls (Dots + WhatsApp Chip) */
        .hero-bottom-controls {
          position: absolute;
          bottom: 1.25rem;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 10;
          pointer-events: auto;
        }

        .hero-dots-container {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: rgba(28, 8, 14, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(212, 175, 55, 0.35);
        }

        .hero-dot-indicator {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, border-radius 0.3s;
        }
        .hero-dot-indicator:hover {
          background: rgba(255, 215, 0, 0.8);
        }
        .hero-dot-indicator.active {
          width: 26px;
          border-radius: 6px;
          background: #ffd700;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
        }

        .hero-wa-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(28, 8, 14, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #ffffff;
          border: 1px solid rgba(37, 211, 102, 0.5);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s, background 0.2s, border-color 0.2s;
        }
        .hero-wa-chip:hover {
          background: rgba(37, 211, 102, 0.25);
          border-color: #25D366;
          color: #25D366;
          transform: translateY(-2px);
        }

        /* Responsive Mobile Styling */
        @media (max-width: 768px) {
          .hero-arrow-btn {
            width: 34px;
            height: 34px;
          }
          .hero-arrow-prev {
            left: 0.6rem;
          }
          .hero-arrow-next {
            right: 0.6rem;
          }
          .hero-bottom-controls {
            bottom: 0.75rem;
            padding: 0 0.85rem;
          }
          .hero-dots-container {
            padding: 0.3rem 0.6rem;
            gap: 0.4rem;
          }
          .hero-dot-indicator {
            width: 7px;
            height: 7px;
          }
          .hero-dot-indicator.active {
            width: 18px;
          }
          .hero-wa-chip {
            padding: 0.35rem 0.75rem;
            font-size: 0.72rem;
            gap: 0.35rem;
          }
        }
      `}</style>
    </section>
  );
}

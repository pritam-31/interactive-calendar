import { useEffect, useMemo, useRef, useState } from 'react';
import { getMonthName } from '../utils/calendarHelpers';

type HeroImageProps = {
  selectedMonth: number;
  selectedYear: number;
  onThemeChange?: (theme: string) => void;
};

const SLIDE_INTERVAL_MS = 5000;
const FLIP_DURATION_MS = 650;

const HeroImage = ({ selectedMonth, selectedYear, onThemeChange }: HeroImageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null);
  const lastThemeRef = useRef<string | null>(null);
  const flipTimeoutRef = useRef<number | null>(null);

  const seasonalImages = useMemo<Record<number, string[]>>(() => ({
    0: ['winter', 'winter-2'],
    1: ['winter', 'valentine'],
    2: ['spring', 'spring-2'],
    3: ['spring', 'flower'],
    4: ['spring', 'garden'],
    5: ['summer', 'summer-2'],
    6: ['summer', 'beach'],
    7: ['summer', 'beach'],
    8: ['fall', 'fall-2'],
    9: ['fall', 'halloween'],
    10: ['fall', 'thanksgiving'],
    11: ['winter', 'christmas'],
  }), []);

  const [images, setImages] = useState<string[]>(
    seasonalImages[selectedMonth] || ['default']
  );

  const shuffleArray = (items: string[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const scheduleFlipReset = () => {
    if (flipTimeoutRef.current) {
      window.clearTimeout(flipTimeoutRef.current);
    }
    flipTimeoutRef.current = window.setTimeout(() => {
      setIsFlipping(false);
      setPrevImageIndex(null);
    }, FLIP_DURATION_MS);
  };

  const setImageWithFlip = (nextIndex: number) => {
    setCurrentImageIndex((prev) => {
      if (prev === nextIndex) return prev;
      setPrevImageIndex(prev);
      setIsFlipping(true);
      scheduleFlipReset();
      return nextIndex;
    });
  };

  useEffect(() => {
    const nextImages = shuffleArray(seasonalImages[selectedMonth] || ['default']);
    setImages(nextImages);
    setPrevImageIndex(null);
    if (nextImages.length <= 1) {
      setCurrentImageIndex(0);
    } else {
      let nextIndex = Math.floor(Math.random() * nextImages.length);
      if (lastThemeRef.current && nextImages[nextIndex] === lastThemeRef.current) {
        nextIndex = (nextIndex + 1) % nextImages.length;
      }
      setCurrentImageIndex(nextIndex);
    }
    setManualPause(false);
    setFailedImages([]);
    setImageError(false);
    setIsFlipping(false);
  }, [selectedMonth, seasonalImages]);

  useEffect(() => {
    const currentKey = images[currentImageIndex];
    if (currentKey) {
      lastThemeRef.current = currentKey;
    }
  }, [currentImageIndex, images]);

  useEffect(() => {
    setImageError(false);
  }, [currentImageIndex, selectedMonth]);

  useEffect(() => {
    if (images.length <= 1 || isPaused || manualPause || showThemeSelector) return undefined;
    const intervalId = window.setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % images.length;
        setPrevImageIndex(prev);
        setIsFlipping(true);
        scheduleFlipReset();
        return next;
      });
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [images.length, isPaused, manualPause, showThemeSelector]);

  useEffect(() => {
    if (!manualPause) return undefined;
    const timeoutId = window.setTimeout(() => setManualPause(false), 12000);
    return () => window.clearTimeout(timeoutId);
  }, [manualPause]);

  useEffect(() => {
    if (!onThemeChange) return;
    const imageKey = images[currentImageIndex] || 'default';
    const themeLookup: Record<string, string> = {
      winter: 'winter',
      'winter-2': 'winter',
      christmas: 'winter',
      valentine: 'winter',
      spring: 'spring',
      'spring-2': 'spring',
      flower: 'spring',
      garden: 'spring',
      summer: 'summer',
      'summer-2': 'summer',
      beach: 'summer',
      fall: 'fall',
      'fall-2': 'fall',
      halloween: 'fall',
      thanksgiving: 'fall',
      default: 'neutral',
    };
    onThemeChange(themeLookup[imageKey] || 'neutral');
  }, [currentImageIndex, images, onThemeChange]);

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setImageWithFlip(nextIndex);
  };

  const previousImage = () => {
    const nextIndex = (currentImageIndex - 1 + images.length) % images.length;
    setImageWithFlip(nextIndex);
  };

  const moveToNextAvailableImage = (nextFailed: string[]) => {
    if (images.length === 0) return;
    const available = images.filter((image) => !nextFailed.includes(image));
    if (available.length === 0) {
      setImageError(true);
      return;
    }
    const currentKey = images[currentImageIndex];
    const startIndex = images.indexOf(currentKey);
    for (let offset = 1; offset <= images.length; offset += 1) {
      const nextIndex = (startIndex + offset) % images.length;
      const candidate = images[nextIndex];
      if (!nextFailed.includes(candidate)) {
        setImageWithFlip(nextIndex);
        return;
      }
    }
  };

  const getImageUrl = (index: number) => {
    const placeholders: Record<string, string> = {
      winter: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1200&q=80',
      spring: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      summer: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      fall: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80',
      christmas: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80',
      valentine: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?auto=format&fit=crop&w=1200&q=80',
      halloween: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80',
      thanksgiving: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1200&q=80',
      beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      garden: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      flower: 'https://images.unsplash.com/photo-1490750967868-88aa4476b879?auto=format&fit=crop&w=1200&q=80',
      'winter-2': 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80',
      'spring-2': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      'summer-2': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'fall-2': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    };

    const imageKey = images[index] || 'default';
    return placeholders[imageKey] || placeholders.default;
  };

  const monthLabel = getMonthName(selectedMonth, 'long');
  const previousSrc = prevImageIndex !== null ? getImageUrl(prevImageIndex) : null;

  return (
    <div className="hero-section">
      <div
        className="hero-image-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {imageError ? (
          <div className="hero-fallback">
            <span>Seasonal Theme</span>
          </div>
        ) : (
          <div className="hero-image-layer">
            {previousSrc && (
              <img
                src={previousSrc}
                alt=""
                className={`hero-image hero-image-outgoing ${isFlipping ? 'flip-out' : ''}`}
                aria-hidden="true"
              />
            )}
            <img
              src={getImageUrl(currentImageIndex)}
              alt={`${monthLabel} ${selectedYear} calendar theme`}
              className={`hero-image hero-image-incoming ${isFlipping ? 'flip-in' : ''}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setImageError(false)}
              onError={() => {
                const imageKey = images[currentImageIndex] || 'default';
                setFailedImages((prev) => {
                  const nextFailed = prev.includes(imageKey) ? prev : [...prev, imageKey];
                  if (nextFailed.length >= images.length) {
                    setImageError(true);
                  } else {
                    moveToNextAvailableImage(nextFailed);
                  }
                  return nextFailed;
                });
              }}
            />
          </div>
        )}

        <div className="hero-sash" aria-hidden="true" />

        <div className="hero-overlay">
          <div className="month-title">
            <div className="month-stack">
              <span className="month-year">{selectedYear}</span>
              <span className="month-name">{monthLabel}</span>
            </div>
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="theme-button"
              type="button"
            >
              Theme
            </button>
          </div>

          {showThemeSelector && (
            <div className="theme-selector">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setImageWithFlip(index);
                    setImageError(false);
                    setManualPause(true);
                    setShowThemeSelector(false);
                  }}
                  className={index === currentImageIndex ? 'active' : undefined}
                  type="button"
                >
                  Theme {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <>
            <button onClick={previousImage} className="image-nav-button prev" type="button">
              {'<'}
            </button>
            <button onClick={nextImage} className="image-nav-button next" type="button">
              {'>'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroImage;

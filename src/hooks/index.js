import { useState, useEffect, useRef } from 'react';

// Custom hook for typing animation
export function useTypingEffect(texts, speed = 80, pauseDelay = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const currentText = texts[textIndex];

    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDelay);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
          if (displayText === currentText) {
            setIsPaused(true);
          }
        } else {
          setDisplayText(currentText.substring(0, displayText.length - 1));
          if (displayText === '') {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timer);
  }, [displayText, textIndex, isDeleting, isPaused, texts, speed, pauseDelay]);

  return displayText;
}

// Hook for scroll reveal animation
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Hook for active section tracking
export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState('');
  
  // Create a stable dependency string to prevent unnecessary re-attachments
  const sectionIdsStr = sectionIds.join(',');

  useEffect(() => {
    let ticking = false;
    const ids = sectionIdsStr.split(',').filter(Boolean);

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Use the center of the viewport for robust detection
          const viewportCenter = window.innerHeight / 2;
          let current = '';

          for (const id of ids) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              // Check if the center of the viewport falls within this section
              if (rect.top <= viewportCenter && rect.bottom > viewportCenter) {
                current = id;
                break;
              }
            }
          }

          // Fallback: If scrolled to the absolute bottom, activate the last section
          const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
          if (isAtBottom && ids.length > 0) {
            current = ids[ids.length - 1];
          }

          if (current) {
            setActiveSection(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIdsStr]);

  return activeSection;
}

// Hook for localStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (val) => {
    try {
      setValue(val);
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error(e);
    }
  };

  return [value, setStoredValue];
}

// Hook for window scroll position
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return scrollY;
}

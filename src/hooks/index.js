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

  useEffect(() => {
    const observers = {};

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      observers[id] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4, rootMargin: '-80px 0px -80px 0px' }
      );
      observers[id].observe(el);
    });

    return () => Object.values(observers).forEach((obs) => obs.disconnect());
  }, [sectionIds]);

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
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return scrollY;
}

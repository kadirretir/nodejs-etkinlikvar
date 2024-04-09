import React, { useEffect, useState, useRef } from 'react';

const calculateTopSpace = (elementRef) => {
    if (!elementRef || !elementRef.current) {
        return 0;
    }

    const element = elementRef.current;
    const prevPosition = element.style.position;
    const prevTop = element.style.top;

    // Önceki pozisyonu ve üst değerini geçici olarak değiştir
    element.style.position = 'static'; // Önceki pozisyonu almak için
    element.style.top = 'auto'; // Önceki üst değeri almak için

    // Normal akışta iken öğenin üst değerini hesapla
    const topSpace = element.offsetTop;

    // Önceki stil özelliklerini geri yükle
    element.style.position = prevPosition;
    element.style.top = prevTop;

    return topSpace;
};

const useStickyOnTop = () => {
    const [isSticky, setIsSticky] = useState(false);
    const elementRef = useRef(null);

    const handleScroll = () => {
        if (elementRef.current) {
            const { top } = elementRef.current.getBoundingClientRect();
            setIsSticky(top <= 0);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return { elementRef, isSticky, calculateTopSpace };
};




export default  useStickyOnTop;
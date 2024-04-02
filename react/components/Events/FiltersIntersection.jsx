import React, { useEffect, useState, useRef } from 'react';

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

    return { elementRef, isSticky };
};

export default useStickyOnTop;
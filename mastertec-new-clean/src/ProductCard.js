import React, { useState, useEffect, useRef } from 'react';

const ProductCard = ({ product, children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [opacity, setOpacity] = useState(1);

  let images = [];
  try {
    images = product.image && product.image.startsWith('[') ? JSON.parse(product.image) : [product.image || '/Logo.jpg'];
  } catch {
    images = [product.image || '/Logo.jpg'];
  }

  const timeoutRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isHovering && images.length > 1) {
      interval = setInterval(() => {
        setOpacity(0); // Start fade out
        timeoutRef.current = setTimeout(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          setOpacity(1); // Start fade in
        }, 300); // Time for fade out
      }, 1500); // Change image every 1.5 seconds
    } else {
      setCurrentImageIndex(0);
      setOpacity(1);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering, images.length]);

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={images[currentImageIndex] || '/Logo.jpg'}
        alt={product.name}
        style={{ transition: 'opacity 0.3s ease-in-out', opacity: opacity }}
      />
      {children}
    </div>
  );
};

export default ProductCard;

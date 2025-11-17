import React, { useState, useEffect, useRef } from 'react';

const ProductCard = ({ product, children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [opacity, setOpacity] = useState(1);

  let images = [];
  try {
    if (product.image) {
      if (product.image.startsWith('[')) {
        images = JSON.parse(product.image);
      } else {
        images = [product.image];
      }
    }
  } catch {
    // If parsing fails, do nothing, images will be an empty array
  }

  if (images.length === 0) {
    images.push('/Logo.jpg'); // Add a fallback if no images are available
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

  const hasDiscount = product.discountPrice && parseFloat(product.discountPrice) < parseFloat(product.price);

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={images[currentImageIndex] || '/Logo.jpg'}
        alt={product.name}
        loading="lazy"
        style={{ transition: 'opacity 0.3s ease-in-out', opacity: opacity }}
      />
      {children ? (
        children
      ) : (
        <div className="product-info">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="price">
            {hasDiscount ? (
              <>
                <span className="discounted-price">Ksh {product.discountPrice} (Excl. tax)</span>
                <span className="original-price">Ksh {product.price} (Excl. tax)</span>
              </>
            ) : (
              <span>Ksh {product.price} (Excl. tax)</span>
            )}
          </div>
          <button
            style={{ background: '#25d366', color: 'white', marginLeft: '8px', marginTop: '4px' }}
            onClick={() => {
              const phone = '254790999150';
              const message = encodeURIComponent(
                `Hello, I want to buy the ${product.name} (Ksh ${hasDiscount ? product.discountPrice : product.price}).`
              );
              window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            }}
          >
            Buy via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;

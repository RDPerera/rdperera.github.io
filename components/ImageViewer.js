import React, { useState, useRef, useEffect } from 'react';
import './ImageViewer.css';

const ImageViewer = ({ images, startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigateImage(-1);
      if (e.key === 'ArrowRight') navigateImage(1);
      if (e.key === '+') zoomIn();
      if (e.key === '-') zoomOut();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [currentIndex]);

  const navigateImage = (step) => {
    const newIndex = (currentIndex + step + images.length) % images.length;
    setCurrentIndex(newIndex);
    resetZoomAndPosition();
  };

  const resetZoomAndPosition = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsMoving(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isMoving && scale > 1) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsMoving(false);
  };

  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
    e.preventDefault();
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="image-viewer-overlay" onClick={() => onClose()}>
      <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
        <div 
          className="image-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            ref={imageRef}
            src={images[currentIndex].src || images[currentIndex]}
            alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
              cursor: scale > 1 ? (isMoving ? 'grabbing' : 'grab') : 'default'
            }}
          />
        </div>

        <div className="image-controls">
          <button onClick={zoomOut} className="zoom-button">-</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="zoom-button">+</button>
        </div>

        <button className="nav-button prev" onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}>
          &lt;
        </button>
        <button className="nav-button next" onClick={(e) => { e.stopPropagation(); navigateImage(1); }}>
          &gt;
        </button>
        
        <button className="close-button" onClick={() => onClose()}>×</button>
        
        <div className="image-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;

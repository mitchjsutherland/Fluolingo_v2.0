import React, { useState, useEffect } from 'react';

const ImageDisplay = ({ imageUrl, size }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        setLoading(false);
      };
      img.onerror = () => {
        setLoading(false);
        setError(true);
      };
      img.src = imageUrl;
    } else {
      setLoading(false);
    }
  }, [imageUrl]);

  if (loading) {
    return <p>Loading image...</p>;
  }

  if (error) {
    return <p>Error: Failed to load image</p>;
  }

  return (
    <div style={{ width: size, height: size, overflow: 'hidden' }}>
      <img src={imageUrl} alt="GIF" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
};

export default ImageDisplay;

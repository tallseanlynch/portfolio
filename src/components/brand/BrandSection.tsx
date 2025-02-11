import { useState, useEffect, useRef } from 'react';
import { BrandHeader, BrandLanding } from '../index';
import '../../assets/css/brand.css';

const BrandSection: React.FC = () => {
  const brandRef = useRef<HTMLDivElement>(null);
  const [brandClickStatus, setBrandClickStatus] = useState<boolean>(false);

  useEffect(() => {
    const handleBrandClick = (): void => {
      setBrandClickStatus(true);
      if (brandRef.current) {
        brandRef.current.removeEventListener('click', handleBrandClick);
        brandRef.current.removeEventListener('touchstart', handleBrandClick);
        brandRef.current.removeEventListener('touchmove', handleBrandClick);
        brandRef.current.removeEventListener('mousewheel', handleBrandClick);
      }
    };

    const brandElement = brandRef.current;
    if (brandElement) {
      brandElement.addEventListener('click', handleBrandClick);
      brandElement.addEventListener('touchstart', handleBrandClick);
      brandElement.addEventListener('touchmove', handleBrandClick);
      brandElement.addEventListener('mousewheel', handleBrandClick);
    };

    return () => {
      if (brandElement) {
        brandElement.removeEventListener('click', handleBrandClick);
        brandElement.removeEventListener('touchstart', handleBrandClick);
        brandElement.removeEventListener('touchmove', handleBrandClick);
        brandElement.removeEventListener('mousewheel', handleBrandClick);
      }
    };
  }, []);

  return (
    <div
      className={`${brandClickStatus ? 'no-pointer-events' : ''} main-container`}
      ref={brandRef}
    >
      <BrandLanding brandHasBeenClicked={brandClickStatus} />
      <BrandHeader brandHasBeenClicked={brandClickStatus} />
    </div>
  )
};

export { BrandSection }
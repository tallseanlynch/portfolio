import React from 'react';
import InverseLogo from '../../assets/images/logo-bw-1-inverse.svg';
import '../../assets/css/brand.css';
import ChevronLeft from '../../assets/images/chevron-left.svg';
import ChevronRight from '../../assets/images/chevron-right.svg';
import { useDispatch } from 'react-redux'
import { decrement, increment } from '../../features/sceneCounter'

interface BrandHeaderProps {
    brandHasBeenClicked?: boolean; 
}

const BrandHeader: React.FC<BrandHeaderProps> = ({brandHasBeenClicked = false}) => {
    const dispatch = useDispatch();

    const handleChevronLeftClick = () => {
        dispatch(decrement());
    }
    
    const handleChevronRightClick = () => {
        dispatch(increment());
    }
    
    return (
        <div className={`brand-small transition-opacity ${brandHasBeenClicked ? 'opacity-point95' : 'opacity-0'}`}>
            <div className="brand-name">
                <div className="chevron-container">
                    <img
                        className="chevron chevron-left"
                        src={ChevronLeft}
                        onClick={handleChevronLeftClick}
                    />
                </div>
                <div className="logo-container">
                    <img src={InverseLogo} />
                </div>
                <div className="chevron-container">
                    <img
                        className="chevron chevron-right"
                        src={ChevronRight}
                        onClick={handleChevronRightClick}
                    />
                </div>
            </div>
        </div>
    )
}

export { BrandHeader }  
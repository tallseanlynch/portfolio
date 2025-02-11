import Logo from '../../assets/images/logo-bw-1.svg';
import '../../assets/css/brand.css';

interface BrandLandingProps {
    brandHasBeenClicked?: boolean; 
}

const BrandLanding: React.FC<BrandLandingProps> = ({brandHasBeenClicked = false}) => {
    return (
        <div className={`brand transition-opacity ${brandHasBeenClicked ? 'opacity-0 no-pointer-events' : 'opacity-point95'}`} >
            <div className="brand-name">
                <img src={Logo} />
            </div>
        </div> 
    )
}

export { BrandLanding }
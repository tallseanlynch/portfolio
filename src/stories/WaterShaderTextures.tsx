import { useEffect, useState } from 'react';
import '../assets/css/brand.css';

const importImages = async () => {
    const sprites = await Promise.all([
        import('/pattern-1-optimized.jpg'),
        import('/pattern-2-optimized.jpg')
    ]);

    return sprites.map(sprite => sprite.default);
}

const WaterShaderTextures: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        importImages().then(setImages);
    }, []);

    return (
        <div className='texture-gallery-container'>
            <h1>Water Shader Textures</h1>
            <div className='sprite-gallery'>
                {images.map((src, index) => (
                    <div className='texture-container' key={index} >
                        <img className='texture' src={src} alt={`Dynamic imported ${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WaterShaderTextures;
import { useEffect, useState } from 'react';
import '../assets/css/brand.css';

const importImages = async () => {
    const sprites = await Promise.all([
        import('/sprites/tree-000.png'),
        import('/sprites/tree-001.png'),
        import('/sprites/tree-002.png'),
        import('/sprites/tree-003.png'),
        import('/sprites/tree-004.png'),
        import('/sprites/tree-005.png'),
        import('/sprites/tree-006.png'),
        import('/sprites/tree-007.png'),
        import('/sprites/tree-008.png'),
        import('/sprites/tree-009.png'),
        import('/sprites/tree-010.png'),
        import('/sprites/tree-011.png'),
        import('/sprites/tree-012.png'),
        import('/sprites/tree-013.png'),
        import('/sprites/tree-014.png'),
        import('/sprites/tree-015.png'),
        import('/sprites/tree-016.png'),
        import('/sprites/tree-017.png'),
        import('/sprites/tree-018.png'),
        import('/sprites/tree-019.png'),
        import('/sprites/tree-020.png'),
        import('/sprites/tree-021.png'),
        import('/sprites/tree-022.png'),
        import('/sprites/tree-023.png'),
        import('/sprites/tree-024.png'),
        import('/sprites/tree-025.png'),
        import('/sprites/tree-026.png'),
        import('/sprites/tree-027.png'),
        import('/sprites/tree-028.png'),
        import('/sprites/tree-029.png'),
        import('/sprites/tree-030.png'),
        import('/sprites/tree-031.png'),
        import('/sprites/tree-032.png'),
        import('/sprites/tree-033.png'),
        import('/sprites/tree-034.png'),
        import('/sprites/tree-035.png'),
        import('/sprites/tree-036.png'),
        import('/sprites/tree-037.png'),
        import('/sprites/tree-038.png'),
        import('/sprites/tree-039.png'),
        import('/sprites/tree-040.png'),
        import('/sprites/tree-041.png'),
        import('/sprites/tree-042.png'),
        import('/sprites/tree-043.png'),
        import('/sprites/ground.png'),
    ]);

    return sprites.map(sprite => sprite.default);
}

const SnowShaderSprites: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        importImages().then(setImages);
    }, []);

    return (
        <div className='sprite-gallery-container'>
            <h1>Snow Shader Sprites</h1>
            <h2>Animals</h2>
            <div className='sprite-gallery'>
                {images.slice(40, 44).map((src, index) => (
                    <div className='sprite-container' key={index} >
                        <img className='sprite' src={src} alt={`Dynamic imported ${index}`} />
                    </div>
                ))}
            </div>
            <h2>Trees</h2>
            <div className='sprite-gallery'>
                {images.slice(0, 39).map((src, index) => (
                    <div className='sprite-container' key={index} >
                        <img className='sprite' src={src} alt={`Dynamic imported ${index}`} />
                    </div>
                ))}
            </div>
            <h2>Ground</h2>
            <div className='sprite-gallery'>
                <div className='sprite-container' key={44} >
                    <img className='sprite sprite-ground' src={images[44]} alt={`Dynamic imported ${44}`} />
                </div>
            </div>
        </div>
    );
};

export default SnowShaderSprites;
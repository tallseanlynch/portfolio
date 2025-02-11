import { useEffect, useState } from 'react';
import '../assets/css/brand.css';

const importImages = async () => {
    const sprites = await Promise.all([
        import('/rome/arch-50-compressed.png'),
        import('/rome/bush-0-50-compressed.png'),
        import('/rome/light-post-0-50-compressed.png'),
        import('/rome/tree-0-inverse-mix-1-50-compressed.png'),
        import('/rome/tree-0-inverse-mix-2-50-compressed.png'),
        import('/rome/wall-0-50-compressed.png'),
        import('/rome/wall-1-50-compressed.png'),
        import('/rome/ground-inverse-compressed.jpg'),
    ]);

    return sprites.map(sprite => sprite.default);
}

const RomeShaderTextures: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        importImages().then(setImages);
    }, []);

    return (
        <div className='texture-gallery-container'>
            <h1>Rome Shader Textures</h1>
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

export default RomeShaderTextures;
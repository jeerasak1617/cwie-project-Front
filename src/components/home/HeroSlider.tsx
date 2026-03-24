import { useState, useEffect } from 'react';
import hero1 from '../../assets/hero-1.jpg';
import hero2 from '../../assets/hero-2.jpg';
import hero3 from '../../assets/hero-3.jpg';

const HeroSlider = () => {
    const images = [hero1, hero2, hero3];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full h-[550px] md:h-[590px] overflow-hidden bg-gray-900">
            {/* Background Images with Fade Transition */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-top transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{ backgroundImage: `url(${img})` }}
                >
                    {/* Dark Overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            ))}

            {/* Slider Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;

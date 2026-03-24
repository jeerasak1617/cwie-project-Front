import HeroSlider from '../components/home/HeroSlider';
import NewsSection from '../components/home/NewsSection';


const HomePage = () => {
    return (
        <div className="flex flex-col">
            <HeroSlider />
            <NewsSection />

        </div>
    );
};

export default HomePage;

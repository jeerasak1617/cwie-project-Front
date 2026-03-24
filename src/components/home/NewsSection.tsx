
import news1 from '../../assets/news-1.png';
import news2 from '../../assets/news-2.png';
import news3 from '../../assets/news-3.png';
import news4 from '../../assets/news-4.png';

const NewsCard = ({ title, image, link }: { title: string, image: string, link?: string }) => {
    const CardContent = (
        <div className="group cursor-pointer flex flex-col h-full mx-auto w-full max-w-[280px]">
            {/* Card Container with Premium Shadow and Border */}
            <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col hover:-translate-y-2">

                {/* Image Section - Taller aspect ratio or fixed height */}
                <div className="h-64 overflow-hidden relative border-b border-gray-50">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Text Content - The "Frame" below */}
                <div className="p-6 flex flex-col justify-between flex-1 bg-white relative transition-colors group-hover:bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#4472c4] transition-colors mb-4 line-clamp-2">
                        {title}
                    </h3>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-[#4472c4] font-medium group-hover:underline">
                            อ่านรายละเอียด
                        </span>
                        {/* Circle Arrow removed as requested */}
                    </div>
                </div>
            </div>
        </div>
    );

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full w-full max-w-[280px] mx-auto">
                {CardContent}
            </a>
        );
    }

    return CardContent;
};

const NewsSection = () => {
    const newsItems = [
        { title: "ข่าวประชาสัมพันธ์", image: news1, link: "https://www.chandra.ac.th/?cat=16" },
        { title: "ข่าวรับสมัครเรียน", image: news2, link: "https://www.chandra.ac.th/?cat=17" },
        { title: "ข่าวรับสมัครงาน", image: news3, link: "https://www.chandra.ac.th/?cat=18" },
        { title: "ข่าวจัดซื้อจัดจ้าง", image: news4, link: "https://www.chandra.ac.th/?cat=1" },
    ];

    return (
        <section className="py-12 bg-gray-50">
            {/* Main Container - 85% width */}
            <div className="max-w-[85%] mx-auto px-4 md:px-8">
                {/* White Card Background */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    {/* Header */}
                    <div className="mb-10 text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 border-l-8 border-yellow-400 pl-4">ข่าวสารและประกาศล่าสุด</h2>
                        <p className="text-gray-500 text-base">ติดตามกิจกรรม โอกาสฝึกงาน และประกาศสำคัญจากคณะและมหาวิทยาลัย</p>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                        {newsItems.map((news, index) => (
                            <NewsCard key={index} {...news} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;

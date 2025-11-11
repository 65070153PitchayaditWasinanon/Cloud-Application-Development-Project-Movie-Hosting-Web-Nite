import PLAY from '../assets/BlackTriangle.png'
import POSTER1 from '../assets/templatepromotion.jpg'
import { useState, useEffect } from "react";
import PromotionList from '../components/PromotionList';
import axios from "axios";
import { useNavigate} from "react-router-dom";


const PromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [promotionsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/promotions"),
                ])
                console.log(promotionsRes.data)
                setPromotions(promotionsRes.data)
            }
            catch (error) {
                console.log("error", error)
            }
        }
        fetchData()
    }, [])

    const now = new Date();

    const activePromos = promotions.filter((p) => {
        const startDate = new Date(p.startDate);
        const endDate = new Date(p.endDate);
        return startDate <= now && now < endDate;
    });
    const upcomingPromos = promotions.filter((p) => {
        const startDate = new Date(p.startDate);
        return now < startDate;
    });

    console.log(activePromos, upcomingPromos)
    return (
        <div className='bg-[#F2F2F2]'>
            <section className="relative w-full">
                <div className="bg-[#3D4979]">
                    <div className="grid grid-cols-2 gap-8 items-center max-w-6xl mx-auto pt-2">
                        <div className="space-y-4 text-center">
                            <h1 className="text-5xl font-bold text-white">เช่าหนังดูได้ทันที<br />ราคาเริ่มต้นเพียง 29 บาท</h1>
                            <p className="text-lg text-white font-thin">หนังใหม่ หนังดัง หนังรางวัล กว่าหลายพันเรื่อง<br />เช่าดูได้ 48 ชั่วโมง ไม่ต้องผูกมัด ไม่มีค่าสมาชิก</p>
                            <div className="flex flex-row gap-3 justify-center pt-2">
                                <button 
                                className="flex w-1/3 font-bold bg-white text-[#3D4979] text-center rounded-lg mt-4 mx-3 p-2 text-lg items-center justify-center hover:opacity-80"
                                onClick={() => navigate(`/`)}>
                                    <img className="mx-3" src={PLAY} alt="" />
                                    เริ่มเช่าหนังเลย
                                </button>
                                <button 
                                className="bg-transparent border-white border-2 text-white hover:bg-white hover:text-[#3D4979] text-center rounded-lg mt-4 p-2 text-lg items-center"
                                onClick={() => navigate(`/`)}>
                                    ดูหนังทั้งหมด
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="relative aspect-[2/3] rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-transform">
                                    <img src={POSTER1} alt="Featured Movie 1" />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="relative aspect-[2/3] rounded-lg shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform">
                                    <img src={POSTER1} alt="Featured Movie 1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-6">
                        <h2 className="text-4xl font-bold mb-4">โปรโมชั่นพิเศษ</h2>
                        <p className="text-lg">ข้อเสนอสุดคุ้มที่คุณไม่ควรพลาด</p>
                    </div>
                    {/* Active Promotions */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-[#3D4979]">
                            <span className="text-3xl mr-3">🔥</span>
                            Hot Deals Now
                        </h2>
                        {activePromos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activePromos.map((promo) => (
                                    <PromotionList key={promo.id} promotion={promo} status="active" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                                    ตอนนี้ยังไม่มีโปรโมชั่นที่ใช้งานได้
                                </h2>
                            </div>
                        )}
                    </section>
                    {/* Upcoming Promotions */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-[#3D4979]">
                            <span className="text-3xl mr-3">⏰</span>
                            Coming Soon
                        </h2>
                        {upcomingPromos.length > 0 ? (

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingPromos.map((promo) => (
                                    <PromotionList key={promo.id} promotion={promo} status="upcoming" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                                    ตอนนี้ยังไม่มีโปรโมชั่นที่กำลังมาถึง
                                </h2>
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </div>
    )
}


export default PromotionPage
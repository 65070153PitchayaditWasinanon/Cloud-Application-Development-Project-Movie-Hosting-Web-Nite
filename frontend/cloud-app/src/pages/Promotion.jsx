import PLAY from '../assets/BlackTriangle.png'
import POSTER1 from '../assets/templatepromotion.jpg'
import Gift from "../assets/Gift.png"
import Film from "../assets/Film.png"
import Star from "../assets/Star.png"
import Zap from "../assets/Zap.png"
import Clock from "../assets/Clock.png"
import Preview from '../assets/preview.png'
import { useRef } from "react";

const MovieList = ({ title }) => {
  const rowRef = useRef(null);
  const scrollByCards = (dir = 1) => {
    const row = rowRef.current;
    if (!row) return;
    const firstCard = row.querySelector(":scope > *");
    const cardW = firstCard?.getBoundingClientRect().width ?? 320; // ชัวร์กว่า
    const gap = 16; // space-x-4 = 1rem = 16px
    row.scrollBy({ left: dir * (cardW + gap) * 3, behavior: "smooth" });
  };

  return (
    <div className="ml-[120px] mt-[60px]">
      <p className="text-4xl text-black text-bold">{title}</p>
      <div className="relative">
        <button
          onClick={() => scrollByCards(-1)}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          ‹
        </button>

        <div
          id={title=="หนังใหม่ราคาพิเศษ" ? "new" : "old"}
          ref={rowRef}
          className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory space-x-4 p-4 scroll-pl-4"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='p-4 bg-[#D3D3D3] rounded-xl shadow-lg border border-gray-100'>
                <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden">
                    <img src={Preview} alt="" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg mb-1 line-clamp-1 mt-3">Tenet</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">฿{title=="หนังใหม่ราคาพิเศษ" ? "29" : "19"}</span>
                    <span className="text-sm text-muted-foreground line-through">฿99</span>
                </div>
                <p className="text-s text-gray-500 mt-1">Sci-Fi, Action, Thriller | 2020</p>
                <button className="w-full py-2 bg-[#3D4979] text-white font-bold rounded-lg hover:bg-[#2A3459] mt-4">เช่าเลย</button>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollByCards(1)}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          ›
        </button>
      </div>
    </div>
  );
}


const PromotionPage = () => {
    return (
        <div className='bg-[#F2F2F2]'>
            <section className="relative w-full">
                <div className="bg-[#3D4979]">
                    <div className="grid grid-cols-2 gap-8 items-center max-w-6xl mx-auto pt-2">
                        <div className="space-y-4 text-center">
                            <h1 className="text-5xl font-bold text-white">เช่าหนังดูได้ทันที<br />ราคาเริ่มต้นเพียง 29 บาท</h1>
                            <p className="text-lg text-white font-thin">หนังใหม่ หนังดัง หนังรางวัล กว่าหลายพันเรื่อง<br />เช่าดูได้ 48 ชั่วโมง ไม่ต้องผูกมัด ไม่มีค่าสมาชิก</p>
                            <div className="flex flex-row gap-3 justify-center pt-2">
                                <button className="flex w-1/3 font-bold bg-white text-[#3D4979] text-center rounded-lg mt-4 mx-3 p-2 text-lg items-center justify-center hover:opacity-80">
                                    <img className="mx-3" src={PLAY} alt="" />
                                    เริ่มเช่าหนังเลย
                                </button>
                                <button className="bg-transparent border-white border-2 text-white hover:bg-white hover:text-[#3D4979] text-center rounded-lg mt-4 p-2 text-lg items-center">
                                    ดูหนังทั้งหมด
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="relative aspect-[2/3] rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-transform">
                                    <img src={POSTER1} alt="Featured Movie 1"/>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="relative aspect-[2/3] rounded-lg shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform">
                                    <img src={POSTER1} alt="Featured Movie 1"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">โปรโมชั่นพิเศษ</h2>
                        <p className="text-lg">ข้อเสนอสุดคุ้มที่คุณไม่ควรพลาด</p>
                    </div>
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        <a 
                        href="#new"
                        className="hover:shadow-lg cursor-pointer bg-[#838EA4] rounded-lg p-3 border-gray border-1 p-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <img src={Zap} alt="Zap" className="h-12 w-12" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Flash Sale</h3>
                            <p className="text-m mb-4">เช่าหนังใหม่ เพียง 29 บาท</p>
                            <div className="flex items-center gap-2 text-sm mt-6">
                                <img src={Star} alt="Star" className="h-6 w-6" />
                                <span className="font-medium">ราคาพิเศษเฉพาะหนังใหม่</span>
                            </div>
                        </a>
                        <div 
                        className="hover:shadow-lg cursor-pointer bg-[#838EA4] rounded-lg p-3 border-gray border-1 p-6"
                        onClick={() => alert('เช่าอีก ... เพื่อรับหนังฟรี 1 เรื่อง')}>
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <img src={Gift} alt="Gift" className="h-12 w-12 grayscale" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">เช่า 5 แถม 1</h3>
                            <p className="text-m mb-4">เช่าครบ 5 เรื่อง รับฟรี 1 เรื่อง</p>
                            <div className="flex items-center gap-2 text-sm mt-6">
                                <img src={Star} alt="Star" className="h-6 w-6" />
                                <span className="font-medium">รับสิทธิ์ได้ไม่จำกัด</span>
                            </div>
                        </div>
                        <a 
                        href="#old"
                        className="hover:shadow-lg cursor-pointer bg-[#838EA4] rounded-lg p-3 border-gray border-1 p-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <img src={Film} alt="Film" className="h-12 w-12" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">หนังคลาสสิก</h3>
                            <p className="text-m mb-4">หนังเก่าดีๆ เพียง 19 บาท</p>
                            <div className="flex items-center gap-2 text-sm mt-6">
                                <img src={Star} alt="Star" className="h-6 w-6" />
                                <span className="font-medium">ย้อนวันวานกับหนังดัง</span>
                            </div>
                        </a>
                        <div 
                        className="hover:shadow-lg cursor-pointer bg-[#838EA4] rounded-lg p-3 border-gray border-1 p-6"
                        onClick={() => alert('ราคาพิเศษหากเช่านาน 1 ปี')}>
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <img src={Clock} alt="Clock" className="h-12 w-12" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">เช่า 1 ปี</h3>
                            <p className="text-m mb-4">เช่าดูได้ยาวนาน ราคาพิเศษ</p>
                            <div className="flex items-center gap-2 text-sm mt-6">
                                <img src={Star} alt="Star" className="h-6 w-6" />
                                <span className="font-medium">คุ้มค่ากว่ารายเดือน 100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <MovieList title="หนังใหม่ราคาพิเศษ" />
            <MovieList title="หนังเก่าราคาพิเศษ" />
        </div>
    )
}


export default PromotionPage
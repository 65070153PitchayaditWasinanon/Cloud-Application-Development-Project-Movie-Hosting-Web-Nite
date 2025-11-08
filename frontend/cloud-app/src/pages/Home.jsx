import React from 'react'
import IMG from '../assets/templatehome.png'
import PLAY from '../assets/BlackTriangle.png'
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
      <p className="text-2xl text-[#3D4979]">{title}</p>
      <div className="relative">
        <button
          onClick={() => scrollByCards(-1)}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          ‹
        </button>

        <div
          ref={rowRef}
          className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory space-x-4 p-4 scroll-pl-4"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden">
              <img src={Preview} alt="" className="w-full h-full object-cover" />
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


const Home = () => {

  return (
    <div >
      {/* wallpaper */}
      <div className='relative w-screen min-w-screen'>
        <img src={IMG} alt="wallpaper" className='w-full h-auto object-cover brightness-60' />


        <div className='absolute bottom-10 left-30 text-white max-w-md space-y-8'>
          <p className='text-4xl font-bold'>JOHN WICK</p>
          <p className='text-base leading-relaxed'>
            John Wick is a former hitman grieving the loss of his true love.
            When his home is broken into, robbed, and his dog killed,
            he is forced to return to action to exact revenge.
          </p>
          <button className='flex flex-row bg-white text-black py-2 px-6 items-center gap-2 rounded-lg font-semibold hover:bg-gray-300'>
            <img src={PLAY} alt="" />
            Play
          </button>
        </div>
      </div>


      {/* list หนังหมา */}
      <MovieList title="รับชมต่อ" />
      <MovieList title="ภาพยนตร์ติด Top" />





    </div>
  )
}

export default Home

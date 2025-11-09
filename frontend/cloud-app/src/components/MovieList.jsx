import React from 'react'
import { useRef, useState } from "react";
import Preview from '../assets/preview.png'



const MovieList = ({ title, setIsOpen }) => {
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
          <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
                    <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
                    <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
                    <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
                    <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-80 h-40 shrink-0 snap-start rounded-lg overflow-hidden" onClick={()=>{
            setIsOpen(true)
            }}>
            <img src={Preview} alt="" className="w-full h-full object-cover" />
          </div>
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

export default MovieList
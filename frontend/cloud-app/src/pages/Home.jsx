import React from 'react'
import IMG from '../assets/templatehome.png'
import PLAY from '../assets/BlackTriangle.png'
import { useState } from "react";
import MovieList from '../components/MovieList';
import Check from '../assets/check_small.png'
import Comment from '../assets/comment.png'
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
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
      <MovieList title="รับชมต่อ" setIsOpen={setIsOpen} />
      <MovieList title="ภาพยนตร์ติด Top" setIsOpen={setIsOpen} />

      {
        isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="grid grid-rows-3 bg-[#3D4979] rounded-lg shadow-lg  w-180 h-130 text-center relative">

              <div className='relative row-span-2 w-full h-full overflow-hidden'>
                <img src={IMG} className='w-full h-full object-cover' />
                <div className='absolute top-2 left-2' onClick={() => { setIsOpen(false) }}>
                  <p className='text-2xl text-white hover:text-gray-500'>x</p>
                </div>
              </div>

              <div className='row-span-2 pt-4 pl-8 text-start text-white'>
                <p className='text-2xl font-bold'>JOHN WICK</p>
                <p className='text-sm leading-relaxed pt-2'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio eius pariatur quia, facere consectetur quam quas architecto quis accusamus amet fugit consequuntur, aut officiis libero doloremque voluptatum quos laborum harum?</p>
              </div>

              <div className='flex row-span-1 text-white text-xl space-x-4 justify-end  pr-4 pb-2'>

                <div className='flex items-center' onClick={()=> navigate("/payment")}>
                  <img src={Check} alt="" className='h-6 w-6'/>
                  <p>Buy</p>
                </div>

                <div className='flex items-center'onClick={()=> navigate("/review")}>
                  <img src={Comment} alt="" className='h-6 w-6'/>
                  <p>Review</p>
                </div>

              </div>
            </div>
          </div>
        )
      }



    </div>
  )
}

export default Home

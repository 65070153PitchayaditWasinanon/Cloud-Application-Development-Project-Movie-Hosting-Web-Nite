import React from 'react'
import IMG from '../assets/templatehome.png'
import PLAY from '../assets/BlackTriangle.png'
import { useState, useEffect } from "react";
import MovieList from '../components/MovieList';
import Check from '../assets/check_small.png'
import Comment from '../assets/comment.png'
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [movie, setMovie] = useState({});
  const [moviePop, setMoviePop] = useState({});
  const [mostPopMovie, setMostPopMovie] = useState({});
  const [selectedMovie, setselectedMovie] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, moviesPopRes] = await Promise.all([
          axios.get("http://localhost:5000/api/movies"),
          axios.get("http://localhost:5000/api/movies/popular")
        ])
        console.log(moviesRes.data)
        console.log(moviesPopRes.data.movie)
        setMovie(moviesRes.data)
        setMoviePop(moviesPopRes.data.movie)
        setMostPopMovie(moviesPopRes.data.mostmovie)
      }
      catch (error) {
        console.log("error", error)
      }
    }
    fetchData()
  }, [])
  return (
    <div>
      {/* wallpaper */}
      <div className="relative w-screen h-[500px] overflow-hidden">
        <img
          src={mostPopMovie.imagePath}
          alt="wallpaper"
          className="w-full h-full object-cover brightness-60"
        />

        <div className="absolute bottom-10 left-30 text-white max-w-md space-y-8">
          <p className="text-4xl font-bold">{mostPopMovie.title}</p>
          <p className="text-base leading-relaxed">{mostPopMovie.description}</p>
          <button onClick={() => {
            setselectedMovie({
              id: mostPopMovie._id,
              title: mostPopMovie.title,
              des: mostPopMovie.description,
              img: mostPopMovie.imagePath
            })
            setIsOpen(true)
          }} className="flex flex-row bg-white text-black py-2 px-6 items-center gap-2 rounded-lg font-semibold hover:bg-gray-300">
            <img src={PLAY} alt="" />
            Play
          </button>
        </div>
      </div>


      {/* list หนังหมา */}
      <MovieList title="รับชมต่อ" setIsOpen={setIsOpen} movielist={movie} setselectedMovie={setselectedMovie} />
      <MovieList title="ภาพยนตร์ติด Top" setIsOpen={setIsOpen} movielist={moviePop} setselectedMovie={setselectedMovie} />

      {
        isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="grid grid-rows-3 bg-[#3D4979] rounded-lg shadow-lg  w-180 h-130 text-center relative">

              <div className='relative row-span-2 w-full h-full overflow-hidden'>
                <img src={selectedMovie.img} className='w-full h-full object-cover' />
                <div className='absolute top-2 left-2' onClick={() => { setIsOpen(false) }}>
                  <p className='text-2xl text-white hover:text-gray-500'>x</p>
                </div>
              </div>

              <div className='row-span-2 pt-4 pl-8 text-start text-white'>
                <p className='text-2xl font-bold'>{selectedMovie.title}</p>
                <p className='text-sm leading-relaxed pt-2'>{selectedMovie.des}</p>
              </div>

              <div className='flex row-span-1 text-white text-xl space-x-4 justify-end  pr-4 pb-2'>

                <div className='flex items-center' onClick={() => navigate(`/payment/${selectedMovie.id}`)}>
                  <img src={Check} alt="" className='h-6 w-6' />
                  <p>Buy</p>
                </div>

                <div className='flex items-center' onClick={() => navigate(`/review/${selectedMovie.id}`)}>
                  <img src={Comment} alt="" className='h-6 w-6' />
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

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Star from "../assets/Star.png";

const API_URL_MOVIE = "http://localhost:5000/api/movies";

const Watch = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await axios.get(`${API_URL_MOVIE}/${id}`);
        setMovie(movieRes.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <p>กำลังโหลดข้อมูล...</p>;
  if (!movie) return <p>ไม่พบข้อมูลหนัง</p>;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen p-4 pt-24">
      <div className="relative w-full max-w-5xl">
        <video
          ref={videoRef}
          className="w-full rounded-lg shadow-lg"
          src={`https://transcode-nite.s3.us-east-1.amazonaws.com/${movie.moviePath}`}
          controls
        />
        <h1 className="absolute top-3 left-3 bg-black/60 text-white text-lg font-bold px-3 py-1 rounded-lg">
          {movie.title}
        </h1>
      </div>
    </div>
  );
};

export default Watch;

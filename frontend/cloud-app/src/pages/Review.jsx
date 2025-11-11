import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Star from "../assets/Star.png";

const API_URL_MOVIE = 'http://localhost:5000/api/movies';
const API_URL_REVIEW = 'http://localhost:5000/api/reviews';

// ข้อมูล login
const CURRENT_USER_ID = "6740a0dfc2b1b82f5f31d002";
const CURRENT_USERNAME = "john_doe";

const ReviewPage = () => {
    const { id } = useParams(); // movieId จาก URL
    const [movie, setMovie] = useState(null);       // สำหรับรายละเอียดหนัง
    const [comments, setComments] = useState([]);   // สำหรับรีวิว
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ดึงรายละเอียดหนัง
                const movieRes = await axios.get(`${API_URL_MOVIE}/${id}`);
                setMovie(movieRes.data);

                // ดึงรีวิวของหนังนี้
                const reviewRes = await axios.get(`${API_URL_REVIEW}/${id}`);
                setComments(reviewRes.data);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newCommentPayload = {
            movieId: id,             
            userId: CURRENT_USER_ID, 
            username: CURRENT_USERNAME,
            comment: message,
        };


        try {
            const response = await axios.post("http://localhost:5000/api/add_reviews", newCommentPayload);
            setComments([response.data, ...comments]); // เพิ่ม comment ใหม่ด้านบน
            setMessage('');
            window.location.reload();
        } catch (error) {
            console.error("Error submitting review:", error);
            
        }
    };

    const CommentCard = ({ username, comment }) => (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-[#3D4979]">
            <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-sm font-bold">
                    {username.charAt(0)}
                </div>
                <h4 className="text-lg font-bold text-[#3D4979]">{username}</h4>
            </div>
            <p className="text-gray-700">{comment}</p>
        </div>
    );

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className='min-h-screen bg-[#F2F2F2] py-16'>
            <div className="container mx-auto px-4 max-w-6xl">
                {movie && (
                    <section className="bg-[#3D4979] text-white p-8 rounded-lg shadow-xl mb-12">
                        <div className="flex items-start space-x-6">
                            <img
                                src={movie.posterUrl || "https://via.placeholder.com/150"}
                                className="w-48 h-auto object-cover rounded-lg shadow-lg"
                                alt={`Movie Poster: ${movie.title}`}
                            />
                            <div>
                                <h2 className="text-4xl font-extrabold mb-2">{movie.title}</h2>
                                <p className="text-lg font-light">{movie.description}</p>
                            </div>
                        </div>
                    </section>
                )}

                <section className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-1">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl sticky top-4">
                            <h3 className="text-3xl font-bold mb-6 text-[#3D4979]">Comment</h3>
                            <div className="mb-4">
                                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    placeholder="Describe message here"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#3D4979] hover:bg-[#2A3459] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">User Reviews</h3>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentCard
                                    key={comment._id}
                                    username={comment.username}
                                    comment={comment.comment}
                                />
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ReviewPage;
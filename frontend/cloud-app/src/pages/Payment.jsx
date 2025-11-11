import { useState, useEffect } from "react";
import IMG from '../assets/preview.png';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CouponModal from '../components/CouponModal';

const formatRentalDate = (date) => {
    const options = {
        day: 'numeric', month: 'numeric', year: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: false
    };
    return new Date(date).toLocaleString('th-TH', options);
};

const Payment = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const [user, setUser] = useState({});
    const [selectedMethod, setSelectedMethod] = useState('qr_promptpay');

    const [pointDiscount, setPointDiscount] = useState(0);
    const [couponDiscount, setcouponDiscount] = useState(0);
    const [error, setError] = useState('');
    const [finalPrice, setFinalPrice] = useState(0);
    const [rentalPeriod, setRentalPeriod] = useState("");
    const [pointsUsedText, setPointsUsedText] = useState("แต้มโปรโมชั่น (5 ฟรี 1)");
    const [pointsRemaining, setPointsRemaining] = useState(0);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [appliedCouponCode, setAppliedCouponCode] = useState("");

    const navigate = useNavigate();

    const applyCoupon = async (code) => {
        try {
            const [promotionsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/promotions/${code}`),
            ])
            console.log(promotionsRes.data)
            let calculatedDiscount;
            if (promotionsRes.data.discountType == "PERCENTAGE") {
                calculatedDiscount = movie.rentalPrice * (promotionsRes.data.discountValue / 100)
            } else {
                calculatedDiscount = promotionsRes.data.discountValue
            }
            setcouponDiscount(calculatedDiscount)
            setAppliedCouponCode(code);
            setIsCouponModalOpen(false);
        }
        catch (error) {
            setError(error.response.data.message)
            console.log("error", error)
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const authUserString = localStorage.getItem("authUser");
                if (!authUserString) {
                    console.error("User not logged in!");
                    alert("กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน");
                    navigate('/login');
                    return;
                }
                const authUser = JSON.parse(authUserString);
                const userId = authUser._id;
                if (!userId) {
                    console.error("User ID not found in localStorage!");
                    navigate('/login');
                    return;
                }
                const [movieRes, userRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/movies/${id}`),
                    axios.get(`http://localhost:5000/api/users/${userId}`)
                ])

                console.log("Movie Data:", movieRes.data);
                console.log("User Data:", userRes.data);

                setMovie(movieRes.data)
                setUser(userRes.data);
                setPointsRemaining(userRes.data.promotionPoint || 0);
            }
            catch (error) {
                console.log("error", error)
            }
        }
        fetchData()
    }, [id])

    {/* คำนวณเช่า 1 เดือนกับแต้มโปรโมชั่น 5 ฟรี 1 */ }
    useEffect(() => {
        const rentalDate = new Date();
        const dueDate = new Date();
        dueDate.setMonth(rentalDate.getMonth() + 1);
        setRentalPeriod(
            `${formatRentalDate(rentalDate)} - ${formatRentalDate(dueDate)}`
        );
        const price = movie.rentalPrice || 0;
        const points = user.promotionPoint || 0;
        let calculatedPointDiscount = 0;
        let calculatedCouponDiscount = couponDiscount;
        let calculatedFinalPrice = price;
        let calculatedPointsRemaining = points;
        let calculatedPointsUsedText = "แต้มโปรโมชั่น (5 ฟรี 1)";
        if (points >= 5 && price > 0) {
            calculatedPointDiscount = price;
            calculatedCouponDiscount = 0;
            calculatedFinalPrice = 0;
            calculatedPointsRemaining = points - 5;
            calculatedPointsUsedText = "แต้มโปรโมชั่น (ใช้ 5 แต้ม)";
        }
        else if (calculatedCouponDiscount > 0) {
            calculatedPointDiscount = 0;
            calculatedFinalPrice = Math.max(0, price - calculatedCouponDiscount);
            calculatedPointsRemaining = points;
        }
        else {
            calculatedFinalPrice = price;
            calculatedPointsRemaining = points;
        }

        calculatedFinalPrice = price - couponDiscount
        setPointDiscount(calculatedPointDiscount);
        setPointsRemaining(calculatedPointsRemaining);
        setPointsUsedText(calculatedPointsUsedText);
        setFinalPrice(calculatedFinalPrice);

    }, [couponDiscount, movie, user]);

    const handlePayment = async () => {
        try {
            const rentalDate = new Date();
            const dueDate = new Date();
            dueDate.setMonth(rentalDate.getMonth() + 1);
            const totalDiscount = pointDiscount + couponDiscount;
            const pointsAreUsed = pointDiscount > 0;
            
            const rentalPayload = {
                userId: user._id,
                status: "ACTIVE",
                rentalDate: rentalDate.toISOString(),
                dueDate: dueDate.toISOString(),
                movie: {
                    movieId: movie._id,
                    title: movie.title,
                    rentalPriceAtTime: movie.rentalPrice
                },
                payment: {
                    originalAmount: movie.rentalPrice,
                    amountPaid: finalPrice,
                    paymentMethod: selectedMethod,
                    paymentDate: rentalDate.toISOString(),
                    promotionUsed: (totalDiscount > 0) ? {
                        code: appliedCouponCode,
                        discountAmount: totalDiscount,
                        pointUsage: pointsAreUsed ? 5 : 0
                    } : null
                }
            };
            await axios.post("http://localhost:5000/api/rentals", rentalPayload);
            alert("ชำระเงินสำเร็จ!");
            navigate('/');
        } catch (error) {
            console.error("Payment failed:", error);
            alert("การชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง");
        }
    };
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">

            <div className="flex-grow p-8 lg:p-16">
                <div className="mb-11 w-sm ">
                    <div className="flex gap-4 items-center ">
                        <button className="text-3xl font-bold text-gray-600 cursor-pointer">
                            &lt;
                        </button>

                        <div>
                            <p className=" font-bold text-black text-lg">
                                {movie.title}
                            </p>
                            <p className="text-sm text-gray-500">
                                หนังที่เลือก
                            </p>
                        </div>
                    </div>

                    <hr className="my-4 border-0 h-1.5 bg-[#3D4979]" />

                </div>
                <h1 className="mb-6 font-bold text-blue-950 text-3xl ">
                    เลือกวิธีการชำระเงิน
                </h1>
                <div className="space-y-4">
                    {/* QR พร้อมเพย์ */}
                    <div
                        className={`border rounded-lg p-4 cursor-pointer ${selectedMethod === 'qr_promptpay' ? 'border-2 border-[#3D4979]' : 'border-gray-300'
                            }`}
                        onClick={() => setSelectedMethod('qr_promptpay')}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center">
                                    {selectedMethod === 'qr_promptpay' && <div className="w-3 h-3 bg-[#3D4979] rounded-full"></div>}
                                </div>
                                <span className="font-semibold text-gray-800">QR พร้อมเพย์</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-gray-500">PromptPay</span>
                            </div>
                        </div>
                    </div>

                    {/* แอปธนาคาร */}
                    <div
                        className={`border rounded-lg p-4 cursor-pointer ${selectedMethod === 'bank_app' ? 'border-2 border-[#3D4979]' : 'border-gray-300'
                            }`}
                        onClick={() => setSelectedMethod('bank_app')}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center">
                                    {selectedMethod === 'bank_app' && <div className="w-3 h-3 bg-[#3D4979] rounded-full"></div>}
                                </div>
                                <span className="font-semibold text-gray-800">แอปธนาคาร</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-gray-500">K+</span>
                                <span className="text-xs font-bold text-gray-500">SCB</span>
                            </div>
                        </div>
                    </div>

                </div>
                <button
                    onClick={handlePayment}
                    className="w-full font-bold bg-[#3D4979] text-white py-3 rounded-lg mt-8  text-lg ">
                    ชำระเงิน
                </button>
            </div>

            <div className="w-full lg:w-1/3 bg-[#3D4979] text-white p-8">
                <h2 className="text-2xl mb-6  font-bold">สรุปรายการเช่าหนัง</h2>
                <hr className="my-6 border-t-4" />

                {/* Poster หนัง*/}
                <div className="gap-4 items-center flex mb-6">
                    <img
                        src={movie.imagePath}
                        alt={movie.title}
                        className="rounded-lg"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">{movie.title}</h3>
                        <p className="text-sm text-gray-300">
                            {movie.description || 'ไม่มีคำอธิบาย'}
                        </p>
                    </div>
                </div>

                {/* รายละเอียด */}
                <div className="space-y-2 ">
                    <div className="flex justify-between">
                        <span className="text-gray-300">ระยะเวลาการเช่า</span>
                        <span className="text-right">{rentalPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">คูปอง</span>
                        <span
                            className="cursor-pointer hover:text-gray-200"
                            onClick={() => setIsCouponModalOpen(true)}
                            role="button"
                            tabIndex={0}
                        >
                            {appliedCouponCode ? appliedCouponCode : <>ใช้คูปอง {'>'}</>}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">แต้มโปรโมชั่นที่มี</span>
                        <span>{user.promotionPoint || 0} แต้ม</span>
                    </div>
                </div>

                <hr className="my-4 border-gray-500" />

                {/* สรุปราคา */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-300">ราคาเช่าหนัง</span>
                        <span>฿ {movie.rentalPrice || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">คูปองส่วนลด</span>
                        <span className='text-red-700'>- ฿ {couponDiscount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">แต้มโปรโมชั่น (5 ฟรี 1)</span>
                        <span className="text-gray-300">{pointsUsedText}</span>
                        <span className='text-red-700'>- ฿ {pointDiscount}</span>
                    </div>
                    {pointDiscount > 0 && (
                        <div className="flex justify-between text-gray-200">
                            <span className="text-gray-300">แต้มคงเหลือ (หลังชำระเงิน)</span>
                            <span>{pointsRemaining} แต้ม</span>
                        </div>
                    )}
                </div>

                <hr className="my-4 border-gray-500" />

                {/* ราคารวม */}
                <div className="flex justify-between text-xl font-bold">
                    <span>ทั้งหมด</span>
                    <span>฿ {finalPrice}</span>
                </div>
            </div>
            {isCouponModalOpen && (
                <CouponModal
                    isOpen={isCouponModalOpen}
                    onClose={() => setIsCouponModalOpen(false)}
                    onApply={applyCoupon}
                    errorfront={error}
                />
            )}
        </div>
    );
};

export default Payment;
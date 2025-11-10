import React, { useState } from 'react'; 
import IMG from '../assets/preview.png';
import { useParams } from "react-router-dom";

const Payment = () => {
    const { id } = useParams(); //อันนี้ id ของ movie 
    const [selectedMethod, setSelectedMethod] = useState('credit_card');
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
                                TENET (2020)
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
                <button className="w-full font-bold bg-[#3D4979] text-white py-3 rounded-lg mt-8  text-lg ">
                    ชำระเงิน
                </button>
            </div>

            <div className="w-full lg:w-1/3 bg-[#3D4979] text-white p-8">
                <h2 className="text-2xl mb-6  font-bold">สรุปรายการเช่าหนัง</h2>
                <hr className="my-6 border-t-4" />

                {/* Poster หนัง*/}
                <div className="gap-4 items-center flex mb-6">
                    <img
                        src={IMG}
                        alt="Tenet Poster"
                        className=" rounded-lg"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">TENET (2020)</h3>
                        <p className="text-sm text-gray-300">Description</p>
                    </div>
                </div>

                {/* รายละเอียด */}
                <div className="space-y-2 ">
                    <div className="flex justify-between">
                        <span className="text-gray-300">ระยะเวลาการเช่า</span>
                        <span>1/11/2020 7:30 PM - 1/12/2020 7:30 PM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">คูปอง</span>
                        <span className="cursor-pointer hover:text-gray-200">ใช้คูปอง {'>'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">แต้มโปรโมชั่นที่มี</span>
                        <span>5 แต้ม</span>
                    </div>
                </div>

                <hr className="my-4 border-gray-500" />

                {/* สรุปราคา */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-300">ราคาเช่าหนัง</span>
                        <span>฿ 200</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">คูปองส่วนลด</span>
                        <span className='text-red-700'>- ฿ 20</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">แต้มโปรโมชั่น (5 ฟรี 1)</span>
                        <span className='text-red-700'>- ฿ 180</span>
                    </div>
                </div>

                <hr className="my-4 border-gray-500" />

                {/* ราคารวม */}
                <div className="flex justify-between text-xl font-bold">
                    <span>ทั้งหมด</span>
                    <span>฿ 0</span>
                </div>
            </div>

        </div>
    );
};

export default Payment;
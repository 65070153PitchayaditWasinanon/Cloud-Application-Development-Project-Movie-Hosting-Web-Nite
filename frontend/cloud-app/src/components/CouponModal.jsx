import React, { useState, useEffect } from 'react';
const CouponModal = ({ isOpen, onClose, onApply, errorfront }) => {
    const [couponCode, setCouponCode] = useState('');
    const [error, setError] = useState('')

    const handleApply = () => {
        setError('');
        if (!couponCode) {
            setError('กรุณากรอกรหัสคูปอง');
            return;
        }
        onApply(couponCode);
    };

    useEffect(() => {
        setError(errorfront)
    }, [errorfront])

    if (!isOpen) return null; 

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-[#3D4979]">
                        ใช้รหัสคูปอง
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Body: Input Field */}
                <div className="mb-4">
                    <label 
                        htmlFor="couponInput" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        กรอกรหัสส่วนลด
                    </label>
                    <input
                        id="couponInput"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3D4979] focus:ring-0"
                        placeholder="เช่น LAUNCH50"
                    />
                    
                    {/* Error Message */}
                    {error && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                </div>

                {/* Footer: Action Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleApply}
                        className="bg-[#3D4979] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#2A3459] transition-colors"
                    >
                        ใช้คูปอง (Apply)
                    </button>
                </div>
                
                {/* 💡 ส่วนเสริม: อาจแสดงคูปองที่มีอยู่ใต้ปุ่มนี้ */}

            </div>
        </div>
    );
};

export default CouponModal;
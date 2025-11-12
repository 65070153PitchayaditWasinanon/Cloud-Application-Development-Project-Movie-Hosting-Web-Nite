import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
    // State สำหรับเก็บข้อมูลฟอร์มของภาพยนตร์
    const [formData, setFormData] = useState({
        title: '',         // ชื่อเรื่อง (String)
        description: '',   // เรื่องย่อ (String)
        imagePath: '',     // ลิงก์รูปภาพปก (String)
        rentalPrice: 0,    // ราคาเช่า (Number)
        videoFile: null,   // ไฟล์วิดีโอ (File object)
    });

    // State สำหรับจัดการสถานะการอัปโหลด
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    // ฟังก์ชันจัดการการเปลี่ยนแปลงของ Input ทั่วไป (Title, Description, ImagePath, RentalPrice)
    const handleChange = (e) => {
        const { name, value, type } = e.target;

        // แปลงค่าให้เป็นตัวเลขถ้าเป็นช่อง Rental Price
        const updatedValue = type === 'number' ? parseFloat(value) : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: updatedValue,
        }));
    };

    // ฟังก์ชันจัดการการเลือกไฟล์ (Video)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            videoFile: file,
        }));
    };

    // ฟังก์ชันจัดการการ Submit ฟอร์ม (แก้ไขส่วนนี้)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบข้อมูลเบื้องต้น
        if (!formData.videoFile) {
            setMessage('กรุณาเลือกไฟล์วิดีโอ');
            return;
        }
        if (formData.rentalPrice <= 0) {
            setMessage('ราคาเช่าต้องมากกว่า 0 บาท');
            return;
        }

        setIsUploading(true);
        setMessage('กำลังอัปโหลดไฟล์วิดีโอ...');

        // 1. สร้าง FormData object
        // นี่คือส่วนสำคัญที่เปลี่ยนไป
        const data = new FormData();

        // 2. ผนวก (append) ข้อมูลทั้งหมดลงใน FormData
        // key (เช่น 'title') ต้องตรงกับที่ Server คาดหวัง
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('imagePath', formData.imagePath);
        data.append('rentalPrice', formData.rentalPrice);

        // 3. ผนวกไฟล์วิดีโอ (นี่คือ File object จริงๆ)
        // Key 'videoFile' คือชื่อที่ Server (เช่น multer) จะใช้รับไฟล์
        data.append('videoFile', formData.videoFile);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', data);

            const result = response.data;

            setIsUploading(false);
            setMessage(`อัปโหลดภาพยนตร์ "${formData.title}" สำเร็จ!`);

            setFormData({
                title: '',
                description: '',
                imagePath: '',
                rentalPrice: 0,
                videoFile: null,
            });

            document.getElementById('videoFile').value = null;

        } catch (error) {
            setIsUploading(false);
            if (error.response) {
                const errorMessage = error.response.data.message || error.message;
                setMessage(`ข้อผิดพลาดในการอัปโหลด (${error.response.status}): ${errorMessage}`);
            } else if (error.request) {
                setMessage('ไม่ได้รับการตอบกลับจาก Server');
            } else {
                setMessage(`ข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`);
            }
            console.error('Submit Error:', error);
        }
    };


    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>อัปโหลดภาพยนตร์ใหม่</h3>
            <form onSubmit={handleSubmit}>

                {/* Title */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="title" style={{ display: 'block', fontWeight: 'bold' }}>ชื่อเรื่อง (Title):</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
                        placeholder="เช่น Inception"
                    />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="description" style={{ display: 'block', fontWeight: 'bold' }}>เรื่องย่อ (Description):</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
                        placeholder="คำอธิบายสั้นๆ เกี่ยวกับภาพยนตร์"
                    ></textarea>
                </div>

                {/* Image Path */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="imagePath" style={{ display: 'block', fontWeight: 'bold' }}>ลิงก์รูปภาพปก (ImagePath):</label>
                    <input
                        type="url"
                        id="imagePath"
                        name="imagePath"
                        value={formData.imagePath}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
                        placeholder="เช่น https://example.com/images/poster.jpg"
                    />
                </div>

                {/* Rental Price */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="rentalPrice" style={{ display: 'block', fontWeight: 'bold' }}>ราคาเช่า (RentalPrice - บาท):</label>
                    <input
                        type="number"
                        id="rentalPrice"
                        name="rentalPrice"
                        value={formData.rentalPrice}
                        onChange={handleChange}
                        required
                        min="1"
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
                    />
                </div>

                {/* Video File */}
                <div style={{ marginBottom: '20px', padding: '10px', border: '1px dashed #007bff', borderRadius: '4px' }}>
                    <label htmlFor="videoFile" style={{ display: 'block', fontWeight: 'bold', color: '#007bff' }}>ไฟล์วิดีโอ (Video File):</label>
                    <input
                        type="file"
                        id="videoFile"
                        name="videoFile"
                        accept="video/*"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                    {formData.videoFile && (
                        <p style={{ marginTop: '5px', fontSize: '12px', color: '#555' }}>
                            ไฟล์ที่เลือก: **{formData.videoFile.name}** ({Math.round(formData.videoFile.size / 1024 / 1024)} MB)
                        </p>
                    )}
                </div>

                {/* ปุ่ม Submit */}
                <button
                    type="submit"
                    disabled={isUploading || !formData.videoFile || formData.rentalPrice <= 0}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: isUploading ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        width: '100%'
                    }}
                >
                    {isUploading ? '📤 กำลังอัปโหลดภาพยนตร์...' : '🎬 Submit ข้อมูลภาพยนตร์'}
                </button>

            </form>

            {/* แสดงสถานะ/ข้อความ */}
            {message && (
                <p style={{ marginTop: '20px', padding: '10px', backgroundColor: message.startsWith('⚠️') ? '#fff3cd' : message.startsWith('❌') ? '#f8d7da' : '#e2f0ff', borderLeft: message.startsWith('⚠️') || message.startsWith('❌') ? '5px solid #ffc107' : '5px solid #007bff', color: '#333' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Upload;
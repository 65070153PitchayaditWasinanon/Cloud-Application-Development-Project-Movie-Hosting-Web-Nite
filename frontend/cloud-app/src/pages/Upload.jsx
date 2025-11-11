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
      setMessage('⚠️ กรุณาเลือกไฟล์วิดีโอ');
      return;
    }
    if (formData.rentalPrice <= 0) {
      setMessage('⚠️ ราคาเช่าต้องมากกว่า 0 บาท');
      return;
    }

    setIsUploading(true);
    setMessage('กำลังเตรียมข้อมูลและอัปโหลด...');

    // เตรียม Payload สำหรับ axios (เป็น JSON object)
    // ⚠️ โค้ดนี้ยังคงใช้การส่ง Metadata เป็น JSON ซึ่งไม่ใช่วิธีที่ถูกต้องในการอัปโหลดไฟล์จริง ๆ
    const payload = {
        title: formData.title,
        description: formData.description,
        imagePath: formData.imagePath,
        rentalPrice: formData.rentalPrice,
        // **สมมติว่าชื่อไฟล์วิดีโอจะเป็น moviePath ในฐานข้อมูล (ตามโค้ดเดิม)**
        moviePath: `uploads/${formData.videoFile.name}`, 
    };

    try {
        // ใช้ axios.post แทน fetch
        const response = await axios.post('http://localhost:5000/api/upload', payload);
        
        // ใน axios:
        // - ไม่ต้องกำหนด headers: 'Content-Type': 'application/json' เพราะ axios จัดการให้เอง
        // - ไม่ต้องใช้ JSON.stringify เพราะ axios จะแปลง object เป็น JSON ให้เอง
        // - response.data คือ body ของ response (JSON object)
        
        const result = response.data;
        
        setIsUploading(false);
        setMessage(`✅ อัปโหลดภาพยนตร์ "${formData.title}" สำเร็จ! ID: ${result.upload._id}`);
        
        // Reset ฟอร์ม
        setFormData({
            title: '',
            description: '',
            imagePath: '',
            rentalPrice: 0,
            videoFile: null,
        });
        // ⚠️ ต้องมีการล้างค่าของ input type="file" ด้วยในโลกจริง
        document.getElementById('videoFile').value = null;

        // ถ้าต้องการรีโหลดหน้าเว็บหลัง Submit
        // window.location.reload(); 

    } catch (error) {
        // axios จะโยน Error เมื่อได้รับสถานะ 4xx หรือ 5xx (Internal Server Error)
        setIsUploading(false);
        
        // ตรวจสอบว่า Error มาจาก Server หรือ Network
        if (error.response) {
            // Server ตอบกลับด้วยสถานะ 4xx, 5xx (เช่น 500 Internal Server Error)
            // ดึงข้อความ error จาก body ของ response (ถ้ามี)
            const errorMessage = error.response.data.message || error.message; 
            setMessage(`❌ ข้อผิดพลาดในการอัปโหลด (${error.response.status}): ${errorMessage}`);
        } else if (error.request) {
            // ไม่มีการตอบกลับจาก Server
            setMessage('❌ ไม่ได้รับการตอบกลับจาก Server');
        } else {
            // ข้อผิดพลาดอื่น ๆ
            setMessage(`❌ ข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`);
        }
        
        console.error('Submit Error:', error);
    }
  };


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>✨ อัปโหลดภาพยนตร์ใหม่</h3>
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
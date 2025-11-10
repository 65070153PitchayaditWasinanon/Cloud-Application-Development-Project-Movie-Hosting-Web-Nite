"use client"

import { useState } from "react"

export default function PromotionCardCustomer({ promotion, status }) {
    const [copied, setCopied] = useState(false)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(promotion.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getStatusColor = () => {
        switch (status) {
            case "active":
                return { bg: "#FF6B6B", text: "#FFFFFF" }
            case "upcoming":
                return { bg: "#FFA500", text: "#FFFFFF" }
            default:
                return { bg: "#D3D3D3", text: "#FFFFFF" }
        }
    }

    const statusColor = getStatusColor()

    return (
        <div
            className="rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:scale-105 duration-300"
            style={{ backgroundColor: "#FFFFFF" }}
        >
            <div className="px-6 py-3 text-center font-bold text-white" style={{ backgroundColor: statusColor.bg }}>
                {status === "active" ? "🎯 ใข้เลยตอนนี้" : "⏳ กำลังมา"}
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-[#3D4979]">
                    {promotion.name}
                </h3>
                <p className="mb-6 text-sm text-[#666666]">
                    {promotion.description}
                </p>
                <div className="rounded-lg p-4 mb-6 text-center bg-[#3D4979]">
                    <p className="text-white text-sm mb-2">ประหยัดถึง</p>
                    <p className="text-white text-4xl font-bold">
                        {promotion.discountType === "PERCENTAGE" ? `${promotion.discountValue}%` : `฿${promotion.discountValue}`}
                    </p>
                </div>
                <div className="mb-6">
                    <p className="text-xs mb-2 text-[#838EA4]">
                        Promo Code
                    </p>
                    <button
                        onClick={handleCopyCode}
                        className="w-full px-4 py-3 rounded-lg border-2 font-mono font-bold text-lg transition-all"
                        style={{
                            borderColor: "#3D4979",
                            color: "#3D4979",
                            backgroundColor: copied ? "#E8F5E9" : "#F2F2F2",
                        }}
                    >
                        {copied ? "✓ Copied!" : promotion.code}
                    </button>
                </div>
                <div className="flex gap-4 bg-[#F2F2F2] rounded-lg">
                    <div className="flex-1 mb-6 p-4">
                        <p className="text-sm text-[#838EA4]">
                            {status === "active" ? "ใช้ได้ถึง" : "ใช้ได้ใน"}
                        </p>
                        <p className="text-lg font-bold text-[#3D4979]">
                            {status === "active" ? formatDate(promotion.endDate) : formatDate(promotion.startDate)}
                        </p>
                    </div>
                    <div className="flex-1 mb-6 p-4">
                        <p className="text-sm text-[#838EA4]">
                            แต้มที่ต้องใช้
                        </p>
                        <p className="text-lg font-bold text-[#3D4979]">
                            {promotion.pointUsage}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

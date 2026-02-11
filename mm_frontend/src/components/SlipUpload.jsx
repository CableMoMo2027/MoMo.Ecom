import React, { useState, useRef } from 'react';
import { Upload, Image, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import { paymentApi } from '../api';

const SlipUpload = ({ orderId, onVerified, onError }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.match(/image\/(jpeg|jpg|png|gif)/)) {
                alert('กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, GIF)');
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert('ไฟล์ต้องมีขนาดไม่เกิน 5MB');
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            const input = fileInputRef.current;
            const dt = new DataTransfer();
            dt.items.add(droppedFile);
            input.files = dt.files;
            handleFileSelect({ target: { files: [droppedFile] } });
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setResult(null);

        try {
            const response = await paymentApi.verifySlip(orderId, file);

            setResult(response);

            if (response.success) {
                onVerified?.(response);
            } else {
                onError?.(response);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setResult({
                success: false,
                message: 'เกิดข้อผิดพลาดในการอัพโหลด',
            });
            onError?.(error);
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${preview
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-600 hover:border-red-500 bg-gray-800/50'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {preview ? (
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFile();
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 z-10"
                        >
                            <X size={16} />
                        </button>
                        <img
                            src={preview}
                            alt="Slip preview"
                            className="max-h-48 mx-auto rounded-lg"
                        />
                        <p className="text-green-400 text-sm mt-2 flex items-center justify-center gap-1">
                            <CheckCircle size={16} />
                            {file?.name}
                        </p>
                    </div>
                ) : (
                    <div className="py-4">
                        <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-300 font-medium">ลากไฟล์มาวางที่นี่</p>
                        <p className="text-gray-500 text-sm mt-1">หรือคลิกเพื่อเลือกไฟล์</p>
                        <p className="text-gray-600 text-xs mt-2">รองรับ: JPG, PNG, GIF (สูงสุด 5MB)</p>
                    </div>
                )}
            </div>

            {/* Upload Button */}
            {file && !result?.success && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${uploading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            กำลังตรวจสอบ...
                        </>
                    ) : (
                        <>
                            <Image size={20} />
                            ยืนยันการชำระเงิน
                        </>
                    )}
                </button>
            )}

            {/* Result Display */}
            {result && (
                <div
                    className={`p-4 rounded-lg ${result.success
                            ? 'bg-green-500/20 border border-green-500'
                            : 'bg-yellow-500/20 border border-yellow-500'
                        }`}
                >
                    <div className="flex items-start gap-3">
                        {result.success ? (
                            <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                        ) : (
                            <XCircle size={24} className="text-yellow-500 flex-shrink-0" />
                        )}
                        <div>
                            <p className={`font-medium ${result.success ? 'text-green-400' : 'text-yellow-400'}`}>
                                {result.success ? 'ตรวจสอบสำเร็จ!' : 'รอการตรวจสอบ'}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                {result.success
                                    ? 'การชำระเงินได้รับการยืนยันแล้ว'
                                    : result.verification?.message || 'กรุณารอการตรวจสอบจากผู้ดูแล'}
                            </p>
                            {result.verification?.mockMode && (
                                <p className="text-gray-500 text-xs mt-2">
                                    * โหมดทดสอบ: ยังไม่ได้เชื่อมต่อ SlipOK API
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlipUpload;

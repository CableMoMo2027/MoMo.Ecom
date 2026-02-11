import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, MapPin, CreditCard, CheckCircle, QrCode, Loader2, Package, ChevronRight, ChevronDown, Copy, Home, X } from 'lucide-react';
import Stepper from './Stepper';
import BlurText from './Blur_Text';
import Counter from './Counter';
import SlipUpload from './SlipUpload';
import { orderApi, paymentApi, userApi } from '../api';
import ttbLogo from '../assets/ttb-logo.png';

// ─── Main CheckoutPage ─────────────────────────────────────────
const CheckoutPage = ({ cartItems, user, onNavigate, onOrderComplete, updateQuantity, removeFromCart }) => {
    const navigate = useNavigate();

    // Shipping state
    const [shippingInfo, setShippingInfo] = useState({
        name: user?.displayName || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);

    // Payment state
    const [paymentTab, setPaymentTab] = useState('qr');
    const [order, setOrder] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [loadingQR, setLoadingQR] = useState(false);
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [copied, setCopied] = useState(false);

    // Step tracking
    const [currentStep, setCurrentStep] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);

    // Computed values
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Load saved addresses
    useEffect(() => {
        if (user?.uid) {
            setLoadingSaved(true);
            userApi.get(user.uid)
                .then(data => {
                    if (data?.shippingAddresses?.length > 0) {
                        setSavedAddresses(data.shippingAddresses);
                    }
                    // Fallback: check old single address
                    else if (data?.shippingAddress?.name) {
                        setSavedAddresses([data.shippingAddress]);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoadingSaved(false));
        }
    }, [user]);

    const useSavedAddress = (addr) => {
        setShippingInfo({
            name: addr.name || '',
            phone: addr.phone || '',
            address: addr.address || '',
            city: addr.city || '',
            postalCode: addr.postalCode || '',
        });
    };

    const handleShippingChange = (field, value) => {
        if (field === 'postalCode') {
            value = value.replace(/\D/g, '');
        }
        setShippingInfo(prev => ({ ...prev, [field]: value }));
    };

    const isShippingValid = shippingInfo.name?.trim() && shippingInfo.phone?.trim() && shippingInfo.address?.trim();

    // Save address
    const saveAndContinue = async () => {
        if (user?.uid) {
            try {
                await userApi.updateShippingAddress(user.uid, shippingInfo);
            } catch (err) {
                console.error('Failed to save address:', err);
            }
        }
        setShowSavePopup(false);
    };

    // QR Code
    const generateQR = async () => {
        setLoadingQR(true);
        try {
            const result = await paymentApi.generateQR(total);
            setQrCode(result);
        } catch (error) {
            console.error('Failed to generate QR:', error);
        } finally {
            setLoadingQR(false);
        }
    };

    const copyAccountNumber = () => {
        navigator.clipboard.writeText('1002917308');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Create order when reaching payment step
    useEffect(() => {
        if (currentStep === 3 && !order) {
            const createOrder = async () => {
                try {
                    const orderData = {
                        userId: user?.uid,
                        customerName: shippingInfo.name || user?.displayName || 'Guest',
                        customerEmail: user?.email || '',
                        customerPhone: shippingInfo.phone || 'N/A',
                        items: cartItems.map(item => ({
                            productId: item._id || item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image,
                        })),
                        shippingInfo,
                        paymentMethod: paymentTab === 'qr' ? 'promptpay' : paymentTab === 'bank' ? 'transfer' : paymentTab,
                        subtotal,
                        shippingFee: shipping,
                        total,
                    };
                    const newOrder = await orderApi.create(orderData);
                    setOrder(newOrder);
                } catch (error) {
                    console.error('Failed to create order:', error);
                }
            };
            createOrder();
        }
    }, [currentStep]);

    const addressesToShow = showAllAddresses ? savedAddresses : savedAddresses.slice(0, 1);

    const handleStepChange = (step) => {
        // Show save address popup when moving from step 2 to step 3
        if (currentStep === 2 && step === 3 && user && isShippingValid) {
            setShowSavePopup(true);
        }
        setCurrentStep(step);
    };

    const handleFinalStep = () => {
        setIsCompleted(true);
    };

    const handleGoHome = () => {
        if (onOrderComplete) onOrderComplete();
        onNavigate('home');
    };

    // Determine if next should be disabled
    const getDisableNext = () => {
        if (currentStep === 1) return cartItems.length === 0;
        if (currentStep === 2) return !isShippingValid;
        if (currentStep === 3) return !paymentVerified;
        return false;
    };

    const handleDisabledNextClick = () => {
        if (currentStep === 1) alert('ตะกร้าสินค้าว่างเปล่า');
        else if (currentStep === 2) alert('กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน');
        else if (currentStep === 3) alert('กรุณาอัพโหลดสลิปการชำระเงิน');
    };

    // Custom step labels
    const stepLabels = ['ตะกร้าสินค้า', 'ที่อยู่จัดส่ง', 'ชำระเงิน', 'สำเร็จ'];
    const stepDescs = [
        'ตรวจสอบรายการสินค้าและปรับจำนวนตามต้องการ',
        'กรอกที่อยู่สำหรับการจัดส่งสินค้า',
        'เลือกวิธีชำระเงินและตรวจสอบยอดรวมอีกครั้ง',
        'คำสั่งซื้อของคุณเสร็จสมบูรณ์',
    ];

    if (isCompleted) {
        // Step 4: Confirmation
        return (
            <div className="min-h-screen bg-gradient-navy pt-24 pb-8 px-4 sm:px-6 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-400" />
                    </div>
                    <h2 className="text-white text-3xl font-bold mb-3">ชำระเงินสำเร็จ!</h2>
                    <p className="text-gray-400 mb-8">ขอบคุณสำหรับการสั่งซื้อ เราจะจัดส่งสินค้าให้เร็วที่สุด</p>
                    {order?.orderId && (
                        <p className="text-gray-500 text-sm mb-6">หมายเลขคำสั่งซื้อ: <span className="text-[#5227FF] font-mono font-bold">{order.orderId}</span></p>
                    )}
                    <button
                        onClick={handleGoHome}
                        className="px-8 py-3 bg-[#5227FF] hover:bg-[#6B3FFF] text-white font-medium rounded-xl transition flex items-center gap-2 mx-auto"
                    >
                        <Home size={18} />
                        กลับหน้าหลัก
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-navy pt-24 pb-8 px-4 sm:px-6">
            {/* Save Address Popup */}
            {showSavePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#5227FF]/20 rounded-full flex items-center justify-center">
                                <MapPin size={20} className="text-[#5227FF]" />
                            </div>
                            <h3 className="text-white font-bold text-lg">บันทึกที่อยู่นี้?</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">ต้องการบันทึกที่อยู่นี้ไว้ในโปรไฟล์เพื่อใช้ในการสั่งซื้อครั้งถัดไปหรือไม่?</p>

                        <div className="bg-gray-900/60 rounded-lg p-4 mb-5 text-sm">
                            <p className="text-white font-medium">{shippingInfo.name}</p>
                            <p className="text-gray-400">{shippingInfo.phone}</p>
                            <p className="text-gray-400">{shippingInfo.address}</p>
                            {shippingInfo.city && (
                                <p className="text-gray-400">{shippingInfo.city} {shippingInfo.postalCode}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSavePopup(false)}
                                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
                            >
                                ไม่บันทึก
                            </button>
                            <button
                                onClick={saveAndContinue}
                                className="flex-1 py-3 bg-[#5227FF] hover:bg-[#6B3FFF] text-white font-medium rounded-xl transition"
                            >
                                บันทึกและดำเนินการต่อ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                <Stepper
                    initialStep={1}
                    onStepChange={handleStepChange}
                    onFinalStepCompleted={handleFinalStep}
                    backButtonText="ย้อนกลับ"
                    nextButtonText="ถัดไป"
                    disableNext={getDisableNext()}
                    onDisabledNextClick={handleDisabledNextClick}
                    stepLabels={stepLabels}
                    stepDescriptions={stepDescs}
                    className="checkout-stepper"
                >
                    {/* ── Step 1: Cart ── */}
                    <div>
                        <div>
                            {/* Cart */}
                            <div className="w-full">
                                <div className="bg-gray-800/50 rounded-xl border-2 border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white font-semibold text-lg">Cart</h3>
                                        <span className="text-[#5227FF] text-sm"><Counter value={totalItems} fontSize={14} padding={0} gap={0} borderRadius={0} horizontalPadding={0} gradientHeight={0} textColor="inherit" fontWeight="inherit" /> ชิ้น</span>
                                    </div>

                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Package size={40} className="mx-auto text-gray-500 mb-2" />
                                            <p className="text-gray-400 text-sm">Empty Cart</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                            {cartItems.map((item) => {
                                                const id = item._id || item.id;
                                                return (
                                                    <div key={id} className="flex items-start gap-3 bg-gray-900/40 rounded-lg p-3 border border-white/20">
                                                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-gray-900 shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                                                                <button
                                                                    onClick={() => removeFromCart(id)}
                                                                    className="text-red-400 hover:text-red-300 transition shrink-0"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                            <p className="text-gray-400 text-xs">฿{item.price?.toLocaleString()}</p>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <div className="flex items-center gap-1 bg-gray-700 rounded-lg">
                                                                    <button
                                                                        onClick={() => updateQuantity(id, Math.max(1, item.quantity - 1))}
                                                                        className="px-2 py-1 text-gray-200 hover:text-white bg-gray-600 hover:bg-gray-500 rounded-l-lg transition text-xs"
                                                                    >
                                                                        <Minus size={12} />
                                                                    </button>
                                                                    <span className="text-white text-sm w-5 text-center"><Counter value={item.quantity} fontSize={14} padding={0} gap={0} borderRadius={0} horizontalPadding={0} gradientHeight={0} textColor="inherit" fontWeight="inherit" /></span>
                                                                    <button
                                                                        onClick={() => updateQuantity(id, item.quantity + 1)}
                                                                        className="px-2 py-1 text-gray-200 hover:text-white bg-gray-600 hover:bg-gray-500 rounded-r-lg transition text-xs"
                                                                    >
                                                                        <Plus size={12} />
                                                                    </button>
                                                                </div>
                                                                <span className="text-white font-bold text-sm">฿<Counter value={item.price * item.quantity} fontSize={14} padding={0} gap={0} borderRadius={0} horizontalPadding={0} gradientHeight={0} textColor="inherit" fontWeight="inherit" /></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="border-t border-gray-600 mt-4 pt-4 space-y-2">
                                        <div className="flex justify-between text-gray-400 text-sm">
                                            <span>จำนวนทั้งหมด</span>
                                            <span><Counter value={totalItems} fontSize={14} padding={0} gap={0} borderRadius={0} horizontalPadding={0} gradientHeight={0} textColor="inherit" fontWeight="inherit" /> ชิ้น</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400 text-sm">
                                            <span>ค่าจัดส่ง</span>
                                            <span>{shipping === 0 ? 'ฟรี' : `฿${shipping}`}</span>
                                        </div>
                                        <div className="flex justify-between text-white font-bold text-lg pt-2">
                                            <span>ยอดรวม</span>
                                            <span>฿<Counter value={total} fontSize={18} padding={0} gap={0} borderRadius={0} horizontalPadding={0} gradientHeight={0} textColor="inherit" fontWeight="inherit" /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Step 2: Shipping ── */}
                    <div>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left: Address Form */}
                            <div className="flex-1 space-y-5">
                                <h3 className="text-white font-semibold text-lg">ที่อยู่สำหรับจัดส่ง</h3>

                                {/* Saved addresses */}
                                {loadingSaved ? (
                                    <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>กำลังโหลดที่อยู่...</span>
                                    </div>
                                ) : savedAddresses.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-gray-400 text-sm">ที่อยู่ที่บันทึกไว้ในโปรไฟล์</p>
                                        {addressesToShow.map((addr, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-800/50 border border-[#5227FF]/20 rounded-xl p-4 cursor-pointer hover:border-[#5227FF] transition"
                                                onClick={() => useSavedAddress(addr)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-[#5227FF] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                        <MapPin size={14} className="text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">{addr.name} • {addr.phone}</p>
                                                        <p className="text-gray-400 text-sm mt-1">
                                                            {addr.address}
                                                            {addr.city && `, ${addr.city}`}
                                                            {addr.postalCode && ` ${addr.postalCode}`}
                                                        </p>
                                                        <button className="text-[#5227FF] text-sm mt-2 hover:underline">ใช้ที่อยู่นี้</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* See more button */}
                                        {savedAddresses.length > 1 && (
                                            <button
                                                onClick={() => setShowAllAddresses(!showAllAddresses)}
                                                className="flex items-center gap-1 text-[#5227FF] text-sm hover:underline mx-auto"
                                            >
                                                {showAllAddresses ? 'แสดงน้อยลง' : `ดูเพิ่มเติม (${savedAddresses.length - 1})`}
                                                <ChevronDown size={14} className={`transition-transform ${showAllAddresses ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Form */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-gray-400 text-sm block mb-1">ชื่อ-นามสกุล</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.name}
                                                onChange={(e) => handleShippingChange('name', e.target.value)}
                                                placeholder="ชื่อ-นามสกุล"
                                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#5227FF] outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-400 text-sm block mb-1">เบอร์โทร</label>
                                            <input
                                                type="tel"
                                                value={shippingInfo.phone}
                                                onChange={(e) => handleShippingChange('phone', e.target.value)}
                                                placeholder="เบอร์โทร"
                                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#5227FF] outline-none transition"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-sm block mb-1">ที่อยู่</label>
                                        <textarea
                                            value={shippingInfo.address}
                                            onChange={(e) => handleShippingChange('address', e.target.value)}
                                            rows={3}
                                            placeholder="ที่อยู่"
                                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#5227FF] outline-none resize-none transition"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-gray-400 text-sm block mb-1">จังหวัด / เมือง</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.city}
                                                onChange={(e) => handleShippingChange('city', e.target.value)}
                                                placeholder="จังหวัด / เมือง"
                                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#5227FF] outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-400 text-sm block mb-1">รหัสไปรษณีย์</label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={5}
                                                value={shippingInfo.postalCode}
                                                onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                                                placeholder="รหัสไปรษณีย์ (ตัวเลขเท่านั้น)"
                                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#5227FF] outline-none transition"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Right: Order Summary */}
                            <div className="w-full lg:w-80 shrink-0">
                                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 sticky top-28">
                                    <h3 className="text-white font-semibold mb-4">สรุปคำสั่งซื้อ</h3>
                                    <div className="space-y-2 mb-4">
                                        {cartItems.map((item) => (
                                            <div key={item._id || item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-400 truncate mr-2">{item.name} × {item.quantity}</span>
                                                <span className="text-white shrink-0">฿{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-600 pt-3">
                                        <div className="flex justify-between text-white font-bold text-lg">
                                            <span>ยอดรวม</span>
                                            <span>฿{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Step 3: Payment ── */}
                    <div>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left: Payment */}
                            <div className="flex-1 space-y-5">
                                <h3 className="text-white font-semibold text-lg">เลือกวิธีชำระเงิน</h3>

                                {/* Tabs */}
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => setPaymentTab('qr')}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${paymentTab === 'qr'
                                            ? 'bg-[#5227FF] text-white border border-[#5227FF]'
                                            : 'bg-gray-800 text-gray-400 border border-gray-600 hover:border-gray-500'}`}
                                    >
                                        <QrCode size={16} />
                                        QR Code (PromptPay)
                                    </button>
                                    <button
                                        onClick={() => setPaymentTab('bank')}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${paymentTab === 'bank'
                                            ? 'bg-[#5227FF] text-white border border-[#5227FF]'
                                            : 'bg-gray-800 text-gray-400 border border-gray-600 hover:border-gray-500'}`}
                                    >
                                        <CreditCard size={16} />
                                        โอนธนาคาร
                                    </button>
                                </div>

                                {/* QR Code */}
                                {paymentTab === 'qr' && (
                                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <QrCode size={24} className="text-[#5227FF]" />
                                            <div>
                                                <h4 className="text-white font-medium">ชำระผ่าน PromptPay QR Code</h4>
                                                <p className="text-gray-400 text-sm">สแกน QR Code ด้วยแอพธนาคารของคุณเพื่อชำระเงิน</p>
                                            </div>
                                        </div>

                                        {!qrCode ? (
                                            <div className="text-center py-6">
                                                <p className="text-gray-400 text-sm mb-4">กดปุ่มสร้าง QR Code สำหรับชำระเงิน</p>
                                                <button
                                                    onClick={generateQR}
                                                    disabled={loadingQR}
                                                    className="px-6 py-3 bg-[#5227FF] hover:bg-[#6B3FFF] text-white font-medium rounded-xl transition flex items-center gap-2 mx-auto"
                                                >
                                                    {loadingQR ? <Loader2 size={18} className="animate-spin" /> : <QrCode size={18} />}
                                                    {loadingQR ? 'กำลังสร้าง...' : 'สร้าง QR Code'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="bg-white p-5 rounded-xl w-fit mx-auto">
                                                    <img src={qrCode.qrCode} alt="PromptPay QR" className="w-52 h-52" />
                                                </div>
                                                <p className="text-white font-bold text-xl mt-3">฿{total.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Bank Transfer */}
                                {paymentTab === 'bank' && (
                                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <img src={ttbLogo} alt="TTB Bank" className="w-14 h-14 rounded-xl object-contain bg-white p-1" />
                                            <div>
                                                <h4 className="text-white font-medium">ธนาคารทหารไทยธนชาต (TTB)</h4>
                                                <p className="text-gray-400 text-sm">โอนเงินเข้าบัญชีธนาคารโดยตรง</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-900/60 rounded-lg p-4 space-y-3">
                                            <div>
                                                <p className="text-gray-500 text-xs mb-0.5">ชื่อบัญชี</p>
                                                <p className="text-white font-medium">นาย สุคีรินทร์ คคีรินทร์นนท์</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs mb-0.5">เลขบัญชี</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-white font-mono text-xl font-bold">100-2-91730-8</p>
                                                    <button
                                                        onClick={copyAccountNumber}
                                                        className="px-3 py-1.5 bg-[#5227FF] hover:bg-[#6B3FFF] rounded-lg text-white transition flex items-center gap-1.5 text-sm"
                                                    >
                                                        <Copy size={14} />
                                                        {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-700 pt-3">
                                                <p className="text-gray-500 text-xs">ยอดที่ต้องโอน</p>
                                                <p className="text-[#5227FF] font-bold text-2xl">฿{total.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Slip Upload */}
                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                                    <p className="text-white font-medium mb-3">อัพโหลดสลิปการชำระเงิน</p>
                                    <SlipUpload
                                        orderId={order?.orderId}
                                        onVerified={() => setPaymentVerified(true)}
                                        onError={(err) => console.error(err)}
                                    />
                                </div>

                                {paymentVerified && (
                                    <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                        <CheckCircle size={20} />
                                        <span className="font-medium">ยืนยันการชำระเงินเรียบร้อย!</span>
                                    </div>
                                )}
                            </div>

                            {/* Right: Full Summary Sidebar */}
                            <div className="w-full lg:w-80 shrink-0">
                                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 sticky top-28 space-y-4">
                                    <h3 className="text-white font-semibold">สรุปคำสั่งซื้อ</h3>

                                    {/* Shipping info */}
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">ที่อยู่จัดส่ง</p>
                                        <p className="text-white text-sm">{shippingInfo.name} • {shippingInfo.phone}</p>
                                        <p className="text-gray-400 text-sm">{shippingInfo.address}</p>
                                        {shippingInfo.city && (
                                            <p className="text-gray-400 text-sm">{shippingInfo.city} {shippingInfo.postalCode}</p>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-600 pt-3 space-y-2">
                                        {cartItems.map((item) => (
                                            <div key={item._id || item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-400 truncate mr-2">{item.name} × {item.quantity}</span>
                                                <span className="text-white shrink-0">฿{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-600 pt-3">
                                        <div className="flex justify-between text-white font-bold text-lg">
                                            <span>ยอดรวม</span>
                                            <span>฿{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Step 4: Confirmation (shown inside stepper before completion) ── */}
                    <div>
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center max-w-md">
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={48} className="text-green-400" />
                                </div>
                                <h2 className="text-white text-3xl font-bold mb-3">ชำระเงินสำเร็จ!</h2>
                                <p className="text-gray-400 mb-8">ขอบคุณสำหรับการสั่งซื้อ เราจะจัดส่งสินค้าให้เร็วที่สุด</p>
                                {order?.orderId && (
                                    <p className="text-gray-500 text-sm mb-6">หมายเลขคำสั่งซื้อ: <span className="text-[#5227FF] font-mono font-bold">{order.orderId}</span></p>
                                )}
                                <button
                                    onClick={handleGoHome}
                                    className="px-8 py-3 bg-[#5227FF] hover:bg-[#6B3FFF] text-white font-medium rounded-xl transition flex items-center gap-2 mx-auto"
                                >
                                    <Home size={18} />
                                    กลับหน้าหลัก
                                </button>
                            </div>
                        </div>
                    </div>
                </Stepper>
            </div>
        </div>
    );
};

export default CheckoutPage;

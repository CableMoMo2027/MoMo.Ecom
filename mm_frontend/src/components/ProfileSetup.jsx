import React, { useState, useRef } from 'react';
import { Camera, Check, Loader2, ArrowRight, User, Upload } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { userApi } from '../api';
import BlurText from './Blur_Text';
import FloatingLines from './Floating_Lines';

// Preset avatar options
const AVATAR_OPTIONS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Whiskers&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Gamer&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky&backgroundColor=baffc9',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Pro&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Star&backgroundColor=b6e3f4',
];

const ProfileSetup = ({ user, onComplete, onSkip, noBackground = false }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [customUrl, setCustomUrl] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [useCustom, setUseCustom] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 20MB for data URL)
            if (file.size > 20 * 1024 * 1024) {
                setError('Image too large. Please choose an image under 20MB.');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target.result);
                setUseCustom(true);
                setCustomUrl('');
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const getSelectedImage = () => {
        if (useCustom) {
            return uploadedImage || customUrl;
        }
        return selectedAvatar;
    };

    const handleSave = async () => {
        const photoURL = getSelectedImage();

        if (!photoURL) {
            setError('Please select an avatar or upload an image');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Check if it's a base64 image (uploaded from device)
            const isBase64 = photoURL.startsWith('data:');

            if (isBase64) {
                // Save to MongoDB only (Firebase doesn't support large base64)
                await userApi.updatePhoto(user.uid, photoURL);
            } else {
                // For URLs, save to both Firebase and MongoDB
                await updateProfile(auth.currentUser, { photoURL });
                await userApi.updatePhoto(user.uid, photoURL);
            }

            // Force refresh the user object
            await auth.currentUser.reload();
            onComplete(auth.currentUser);
        } catch (err) {
            setError('Failed to update profile picture. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${noBackground ? 'h-full' : 'h-screen bg-gray-900'} flex items-center justify-center px-6 py-8 relative overflow-hidden`}>
            {/* Floating Lines Background - only if not using shared background */}
            {!noBackground && (
                <FloatingLines
                    linesGradient={['#dc2626', '#ef4444', '#f87171', '#fca5a5']}
                    enabledWaves={['top', 'middle', 'bottom']}
                    lineCount={[8, 6, 4]}
                    animationSpeed={0.8}
                    interactive={true}
                    parallax={true}
                    parallaxStrength={0.15}
                    mixBlendMode="normal"
                />
            )}

            <div className="w-full max-w-sm relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-4">
                    <BlurText
                        text="Almost Done!"
                        delay={100}
                        animateBy="letters"
                        direction="top"
                        className="text-2xl font-bold text-red-600 text-center"
                    />
                    <p className="text-gray-400 mt-1 text-sm text-center">
                        Choose a profile picture, <span className="text-white font-medium">{user?.displayName || 'Gamer'}</span>
                    </p>
                </div>

                {/* Card */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-5 border border-gray-700">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-xs mb-3">
                            {error}
                        </div>
                    )}

                    {/* Current Selection Preview */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            {getSelectedImage() ? (
                                <img
                                    src={getSelectedImage()}
                                    alt="Selected avatar"
                                    className="w-20 h-20 rounded-full object-cover border-3 border-red-500"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-3 border-gray-600">
                                    <User size={32} className="text-gray-500" />
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                <Camera size={12} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Upload from device button */}
                    <div className="mb-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-lg border-2 border-dashed transition ${uploadedImage && useCustom
                                ? 'border-red-500 bg-red-500/10 text-red-400'
                                : 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-white'
                                }`}
                        >
                            <Upload size={16} />
                            {uploadedImage && useCustom ? 'Image uploaded ✓' : 'Upload from device'}
                        </button>
                    </div>

                    {/* Avatar Grid */}
                    <div className="mb-3">
                        <p className="text-gray-300 text-xs font-medium mb-2">Or choose an avatar</p>
                        <div className="grid grid-cols-4 gap-2">
                            {AVATAR_OPTIONS.map((avatar, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedAvatar(avatar);
                                        setUseCustom(false);
                                        setUploadedImage(null);
                                    }}
                                    className={`relative w-full aspect-square rounded-full overflow-hidden border-2 transition transform hover:scale-110 ${selectedAvatar === avatar && !useCustom
                                        ? 'border-red-500 ring-2 ring-red-500/50'
                                        : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    <img
                                        src={avatar}
                                        alt={`Avatar ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {selectedAvatar === avatar && !useCustom && (
                                        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                                            <Check size={20} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom URL Input */}
                    <div className="mb-4">
                        <p className="text-gray-300 text-xs font-medium mb-1.5">Or paste image URL</p>
                        <input
                            type="url"
                            value={customUrl}
                            onChange={(e) => {
                                setCustomUrl(e.target.value);
                                if (e.target.value) {
                                    setUseCustom(true);
                                    setUploadedImage(null);
                                }
                            }}
                            onFocus={() => {
                                if (customUrl) setUseCustom(true);
                            }}
                            placeholder="https://example.com/your-image.jpg"
                            className="w-full bg-gray-900 text-white text-xs px-3 py-2.5 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={onSkip}
                            className="flex-1 border border-gray-600 hover:border-gray-500 text-gray-400 hover:text-white py-2.5 rounded-lg text-sm font-medium transition"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || (!selectedAvatar && !customUrl)}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;

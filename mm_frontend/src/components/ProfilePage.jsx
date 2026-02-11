import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Loader2, ArrowLeft, CheckCircle, LogOut } from 'lucide-react';
import { userApi } from '../api';
import BlurText from './Blur_Text';

const ProfilePage = ({ user, onNavigate, onSignOut }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [userData, setUserData] = useState(null);
    const fileInputRef = useRef(null);

    // Form state
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [photoURL, setPhotoURL] = useState('');

    // Fetch user data from MongoDB
    useEffect(() => {
        const fetchUser = async () => {
            if (!user?.uid) return;
            try {
                const data = await userApi.get(user.uid);
                setUserData(data);
                setDisplayName(data?.displayName || user.displayName || '');
                setPhone(data?.profile?.phone || '');
                setAddress(data?.profile?.address || '');
                setPhotoURL(data?.photoURL || user?.photoURL || '');
            } catch (err) {
                console.error('Failed to fetch user:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [user]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                setError('Image too large. Please choose an image under 20MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhotoURL(event.target.result);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            console.log('Saving profile for user:', user.uid);

            // Update profile
            const profileResult = await userApi.updateProfile(user.uid, {
                displayName,
                profile: { phone, address }
            });
            console.log('Profile update result:', profileResult);

            // Update photo if changed
            if (photoURL !== userData?.photoURL) {
                console.log('Updating photo...');
                const photoResult = await userApi.updatePhoto(user.uid, photoURL);
                console.log('Photo update result:', photoResult);
            }

            // Show toast popup
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-gradient-navy flex items-center justify-center">
                <Loader2 className="animate-spin text-navy-light" size={48} />
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-navy pt-24 pb-4 px-4 flex flex-col">
            {/* Toast Popup */}
            {showToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                        <CheckCircle size={20} />
                        <span className="font-medium">Profile updated successfully!</span>
                    </div>
                </div>
            )}

            <div className="max-w-lg mx-auto flex-1 flex flex-col justify-center">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => onNavigate('home')}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <BlurText
                        text="My Profile"
                        delay={100}
                        animateBy="letters"
                        direction="top"
                        className="text-2xl font-bold text-white"
                    />
                </div>

                {/* Profile Card - Compact */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 border border-gray-700">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {/* Photo Section - Smaller */}
                    <div className="flex flex-col items-center mb-5">
                        <div className="relative mb-2">
                            {photoURL ? (
                                <img
                                    src={photoURL}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-3 border-navy-light"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-3 border-gray-600">
                                    <User size={36} className="text-gray-500" />
                                </div>
                            )}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-8 h-8 bg-navy-light hover:bg-navy-accent rounded-full flex items-center justify-center transition"
                            >
                                <Camera size={14} className="text-white" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <p className="text-gray-500 text-xs">Tap to change photo</p>
                    </div>

                    {/* Form Fields - Compact */}
                    <div className="space-y-3">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full bg-gray-900/50 text-gray-400 pl-9 pr-3 py-2 rounded-lg border border-gray-700 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Display Name */}
                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1">Display Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-gray-900 text-white pl-9 pr-3 py-2 rounded-lg border border-gray-600 focus:border-navy-light outline-none text-sm transition"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0XX-XXX-XXXX"
                                    className="w-full bg-gray-900 text-white pl-9 pr-3 py-2 rounded-lg border border-gray-600 focus:border-navy-light outline-none text-sm transition"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Your address..."
                                    rows={2}
                                    className="w-full bg-gray-900 text-white pl-9 pr-3 py-2 rounded-lg border border-gray-600 focus:border-navy-light outline-none text-sm transition resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full mt-5 bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>

                    {/* Logout Button */}
                    {onSignOut && (
                        <button
                            onClick={onSignOut}
                            className="w-full mt-3 bg-red-600/20 hover:bg-red-600 border border-red-600 text-red-400 hover:text-white py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

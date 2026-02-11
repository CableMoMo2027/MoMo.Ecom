import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { userApi } from '../api';
import BlurText from './Blur_Text';
import FloatingLines from './Floating_Lines';

// Sign In Form Component
const SignInForm = ({ onSubmit, loading, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Email */}
            <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:border-navy-light focus:ring-2 focus:ring-navy-light/20 outline-none transition"
                        required
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-900 text-white pl-12 pr-12 py-3 rounded-lg border border-gray-600 focus:border-navy-light focus:ring-2 focus:ring-navy-light/20 outline-none transition"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
                <button type="button" className="text-sm text-navy-light hover:text-navy-accent transition">
                    Forgot password?
                </button>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>
        </form>
    );
};

// Sign Up Form Component
const SignUpForm = ({ onSubmit, loading, error }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setValidationError('Password must be at least 6 characters');
            return;
        }

        onSubmit(name, email, password);
    };

    const displayError = validationError || error;

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {displayError && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-xs">
                    {displayError}
                </div>
            )}

            {/* Name */}
            <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Full Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-gray-900 text-white text-sm pl-10 pr-3 py-2 rounded-lg border border-gray-600 focus:border-navy-light focus:ring-2 focus:ring-navy-light/20 outline-none transition"
                        required
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-gray-900 text-white text-sm pl-10 pr-3 py-2 rounded-lg border border-gray-600 focus:border-navy-light focus:ring-2 focus:ring-navy-light/20 outline-none transition"
                        required
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-900 text-white text-sm pl-10 pr-10 py-2 rounded-lg border border-gray-600 focus:border-navy-light focus:ring-2 focus:ring-navy-light/20 outline-none transition"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-900 text-white text-sm pl-10 pr-10 py-2 rounded-lg border border-gray-600 focus:border-navy-light focus:ring-2 focus:ring-navy-light/20 outline-none transition"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Creating account...
                    </>
                ) : (
                    'Create Account'
                )}
            </button>
        </form>
    );
};

// Main Auth Container Component
const AuthContainer = ({ initialPanel = 'signin', onNavigate, onSignInSuccess, onSignUpSuccess, noBackground = false }) => {
    const [activePanel, setActivePanel] = useState(initialPanel);
    const [loading, setLoading] = useState(false);
    const [signInError, setSignInError] = useState('');
    const [signUpError, setSignUpError] = useState('');

    const handleSignIn = async (email, password) => {
        setSignInError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Sync user to MongoDB
            await userApi.sync({
                firebaseUid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
                photoURL: userCredential.user.photoURL,
            });
            onSignInSuccess(userCredential.user);
        } catch (err) {
            switch (err.code) {
                case 'auth/user-not-found':
                    setSignInError('No account found with this email');
                    break;
                case 'auth/wrong-password':
                    setSignInError('Incorrect password');
                    break;
                case 'auth/invalid-email':
                    setSignInError('Invalid email address');
                    break;
                case 'auth/invalid-credential':
                    setSignInError('Invalid email or password');
                    break;
                default:
                    setSignInError('Failed to sign in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (name, email, password) => {
        setSignUpError('');
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            // Sync new user to MongoDB
            await userApi.sync({
                firebaseUid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: name,
                photoURL: userCredential.user.photoURL,
            });
            onSignUpSuccess(userCredential.user);
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setSignUpError('This email is already registered');
                    break;
                case 'auth/invalid-email':
                    setSignUpError('Invalid email address');
                    break;
                case 'auth/weak-password':
                    setSignUpError('Password is too weak');
                    break;
                default:
                    setSignUpError('Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const switchPanel = (panel) => {
        setActivePanel(panel);
        setSignInError('');
        setSignUpError('');
    };

    // Social Login Handlers
    const handleGoogleSignIn = async () => {
        setSignInError('');
        setSignUpError('');
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Sync user to MongoDB
            await userApi.sync({
                firebaseUid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
            });
            // Social login already has photoURL, use signIn callback (goes home)
            onSignInSuccess(result.user);
        } catch (err) {
            const errorMessage = err.code === 'auth/popup-closed-by-user'
                ? 'Sign in cancelled'
                : 'Failed to sign in with Google';
            if (activePanel === 'signin') {
                setSignInError(errorMessage);
            } else {
                setSignUpError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookSignIn = async () => {
        setSignInError('');
        setSignUpError('');
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            // Sync user to MongoDB
            await userApi.sync({
                firebaseUid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
            });
            // Social login already has photoURL, use signIn callback (goes home)
            onSignInSuccess(result.user);
        } catch (err) {
            const errorMessage = err.code === 'auth/popup-closed-by-user'
                ? 'Sign in cancelled'
                : 'Failed to sign in with Facebook';
            if (activePanel === 'signin') {
                setSignInError(errorMessage);
            } else {
                setSignUpError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${noBackground ? 'h-full' : 'h-screen bg-gray-900'} flex items-center justify-center px-6 py-8 relative overflow-hidden`}>
            {/* Floating Lines Background - only if not using shared background */}
            {!noBackground && (
                <FloatingLines
                    linesGradient={['#141E30', '#3F5E96', '#4A6BA8', '#5C7BB5']}
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
                {/* Logo */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <BlurText
                        text="MoMo Pro"
                        delay={100}
                        animateBy="letters"
                        direction="top"
                        className="text-4xl font-bold text-navy-light text-center"
                    />
                    <p className="text-gray-400 mt-2 transition-all duration-300">
                        {activePanel === 'signin' ? 'Welcome back, gamer!' : 'Join the gaming community!'}
                    </p>
                </div>

                {/* Slide Container - fixed height to prevent background stutter */}
                <div className="overflow-hidden rounded-2xl" style={{ minHeight: '520px' }}>
                    <div
                        className="flex items-start transition-transform duration-500 ease-in-out"
                        style={{
                            width: '200%',
                            transform: activePanel === 'signin' ? 'translateX(0%)' : 'translateX(-50%)'
                        }}
                    >
                        {/* Sign In Panel */}
                        <div className="w-1/2 flex-shrink-0" style={{ minHeight: '520px' }}>
                            <div className="bg-gray-800/50 backdrop-blur-md p-8 border border-gray-700 rounded-2xl mx-1">
                                <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>

                                <SignInForm
                                    onSubmit={handleSignIn}
                                    loading={loading}
                                    error={signInError}
                                />

                                {/* Divider */}
                                <div className="relative my-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-gray-800/50 text-gray-400">or continue with</span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="flex justify-center gap-4 mb-5">
                                    {/* Google */}
                                    <button
                                        type="button"
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="w-12 h-12 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition transform hover:scale-110 disabled:hover:scale-100"
                                        title="Sign in with Google"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                            <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                            <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                            <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                                        </svg>
                                    </button>

                                    {/* Facebook */}
                                    <button
                                        type="button"
                                        onClick={handleFacebookSignIn}
                                        disabled={loading}
                                        className="w-12 h-12 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition transform hover:scale-110 disabled:hover:scale-100"
                                        title="Sign in with Facebook"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Switch to Sign Up */}
                                <p className="text-center text-gray-400 text-sm">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => switchPanel('signup')}
                                        className="text-navy-light hover:text-navy-accent font-medium transition"
                                    >
                                        Create account
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Sign Up Panel */}
                        <div className="w-1/2 flex-shrink-0" style={{ minHeight: '520px' }}>
                            <div className="bg-gray-800/50 backdrop-blur-md p-6 border border-gray-700 rounded-2xl mx-1">
                                <h2 className="text-xl font-bold text-white mb-4 text-center">Create Account</h2>

                                <SignUpForm
                                    onSubmit={handleSignUp}
                                    loading={loading}
                                    error={signUpError}
                                />

                                {/* Divider */}
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-gray-800/50 text-gray-400">or continue with</span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="flex justify-center gap-4 mb-4">
                                    {/* Google */}
                                    <button
                                        type="button"
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition transform hover:scale-110 disabled:hover:scale-100"
                                        title="Sign up with Google"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                            <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                            <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                            <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                                        </svg>
                                    </button>

                                    {/* Facebook */}
                                    <button
                                        type="button"
                                        onClick={handleFacebookSignIn}
                                        disabled={loading}
                                        className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition transform hover:scale-110 disabled:hover:scale-100"
                                        title="Sign up with Facebook"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Switch to Sign In */}
                                <p className="text-center text-gray-400 text-sm">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => switchPanel('signin')}
                                        className="text-navy-light hover:text-navy-accent font-medium transition"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <button
                    onClick={() => onNavigate('home')}
                    className="w-full mt-6 text-gray-400 hover:text-white transition text-center"
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default AuthContainer;

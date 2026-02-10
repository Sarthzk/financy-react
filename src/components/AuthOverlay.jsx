import { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { sanitizeInput } from '../utils/helpers';
import Orb from './ui/Orb';
import Logo from './Logo';

export default function AuthOverlay({ onError, onSuccess, onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      onError('Please fill in all credentials');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      onError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      onError('Password must be at least 6 characters');
      return;
    }

    // Sign up specific validation
    if (isSignUp && username.trim().length === 0) {
      onError('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const cleanUsername = sanitizeInput(username || 'User');
        await updateProfile(result.user, { displayName: cleanUsername });
        await setDoc(doc(db, 'users', result.user.uid), {
          displayName: cleanUsername
        });
        onSuccess('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess('Logged in successfully!');
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'Email already in use' 
        : error.code === 'auth/user-not-found'
        ? 'User not found'
        : error.code === 'auth/wrong-password'
        ? 'Wrong password'
        : error.message;
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          displayName: result.user.displayName
        });
      }
      
      onSuccess('Logged in with Google!');
    } catch (error) {
      console.error('Google login error:', error);
      onError('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAuth(e);
    }
  };

  return (
    <>
      {/* Full-viewport Orb layer so no black patch at bottom */}
      <div className="fixed inset-0 min-h-[100dvh] z-[4999]">
        <Orb hue={210} hoverIntensity={0.2} backgroundColor="#070b14" />
      </div>
      <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden p-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md space-y-8 glass-card p-8 rounded-[2.5rem] relative">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-all text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
            aria-label="Back to landing page"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Logo */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Logo size="xl" showText={false} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Financy</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2 font-medium">
              Master your money, one entry at a time.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-4 rounded-xl outline-none focus:border-primary transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="Your Name"
              />
            )}
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-4 rounded-xl outline-none focus:border-primary transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Email"
              required
              autoComplete="email"
            />
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-4 rounded-xl outline-none focus:border-primary transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Password"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold p-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{isSignUp ? 'Creating Account...' : 'Logging in...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Login'}</span>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <p className="text-center text-sm text-gray-600 dark:text-slate-400 font-medium">
            <span>{isSignUp ? 'Already have an account?' : 'New here?'}</span>{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-bold ml-1"
              type="button"
            >
              {isSignUp ? 'Login instead' : 'Create an account'}
            </button>
          </p>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800 px-2 text-gray-600 dark:text-slate-400 font-bold">OR</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
            type="button"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              width="20"
              alt="Google"
            />
            <span className="font-bold text-gray-900 dark:text-white">Continue with Google</span>
          </button>
        </div>
      </div>
    </>
  );
}

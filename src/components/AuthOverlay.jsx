import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { sanitizeInput } from '../utils/helpers';

export default function AuthOverlay({ onError, onSuccess }) {
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
      onError(error.message);
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
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-midnight p-6">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-[2.5rem]">
        {/* Logo */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Financy Logo">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeDasharray="200 60"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#0B50DA"
                strokeWidth="5"
                strokeDasharray="150 110"
                transform="rotate(-45 50 50)"
                fill="none"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Financy</h1>
          <p className="text-slate-400 mt-2 font-medium">
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
              className="w-full bg-dark border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-white font-medium"
              placeholder="Your Name"
            />
          )}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-dark border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-white font-medium"
            placeholder="Email"
            required
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-dark border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-white font-medium"
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
        <p className="text-center text-sm text-slate-500 font-medium">
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
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-slate-500 font-bold">OR</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-card border border-border p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50"
          type="button"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width="20"
            alt="Google"
          />
          <span className="font-bold text-white">Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

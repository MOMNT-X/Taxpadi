"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: 0,
      baseY: 0,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
    }));

    particles.forEach(p => {
      p.baseX = p.x;
      p.baseY = p.y;
    });

    let animationId = 0 as number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150 && mousePosition.x > 0) {
          const angle = Math.atan2(dy, dx);
          const force = ((150 - distance) / 150) * 0.15;
          particle.vx -= Math.cos(angle) * force;
          particle.vy -= Math.sin(angle) * force;
        }

        const returnForce = 0.02;
        particle.x += (particle.baseX - particle.x) * returnForce;
        particle.y += (particle.baseY - particle.y) * returnForce;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'rgba(59, 130, 246, 0.4)' 
          : 'rgba(59, 130, 246, 0.2)';
        ctx.fill();

        particles.forEach(other => {
          const dx2 = particle.x - other.x;
          const dy2 = particle.y - other.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist < 120 && dist > 0) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      updateSize();
      particles.forEach(p => {
        if (p.x > canvas.width) p.x = canvas.width;
        if (p.y > canvas.height) p.y = canvas.height;
        p.baseX = p.x;
        p.baseY = p.y;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [mousePosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoogleSignup = () => {
    window.location.href = `http://localhost:3000/auth/google`;
  };

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const { signup } = useAuthStore.getState();
      await signup(name, email, password);
      // Redirect to chat on successful signup
      window.location.href = '/chat';
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center p-4 overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              TP
            </div>
            <span className="text-2xl font-semibold">TaxPadi</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Signup Card */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Get started with TaxPadi today</p>
          </div>

          <div className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-white/90 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-white/90 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-white/90 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-sm"
                  placeholder="At least 6 characters"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black/50 px-3 text-sm text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full py-3 bg-white/80 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
             Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, MessageSquare, BookOpen, Shield, TrendingUp, Users, ArrowRight, CheckCircle2, Menu, X} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const TaxPadiLanding: React.FC = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [income, setIncome] = useState<number>(5000000);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [nairaPositions, setNairaPositions] = useState<Array<{ left: number; top: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastMoveTime = useRef<number>(Date.now());
  const formationState = useRef<{ phase: number; timer: number }>({ phase: 0, timer: 0 });

  // Tax calculation logic
  const calculateTax = (annualIncome: number) => {
    const bands = [
      { limit: 300000, rate: 0.07 },
      { limit: 300000, rate: 0.11 },
      { limit: 500000, rate: 0.15 },
      { limit: 500000, rate: 0.19 },
      { limit: 1600000, rate: 0.21 },
      { limit: Infinity, rate: 0.24 }
    ];

    let tax = 0;
    let remaining = annualIncome;
    const breakdown = [];

    for (const band of bands) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, band.limit);
      const bandTax = taxable * band.rate;
      tax += bandTax;
      breakdown.push({ taxable, rate: band.rate, tax: bandTax });
      remaining -= taxable;
    }

    return { tax, breakdown, netIncome: annualIncome - tax };
  };

  const taxData = calculateTax(income);

  // Initialize naira symbol positions (static)
  useEffect(() => {
    const initialPositions = Array.from({ length: 8 }, (_, i) => ({
      left: 5 + (i * 12) + Math.random() * 3,
      top: 15 + ((i % 3) * 25) + Math.random() * 5,
    }));
    setNairaPositions(initialPositions);
  }, []);

  // Particle animation with formations
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

    interface Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
    }

    // Create particles with target positions for formations
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      targetX: 0,
      targetY: 0,
      baseX: 0,
      baseY: 0,
      vx: 0,
      vy: 0,
      radius: Math.random() * 1.5 + 0.8,
    }));

    particles.forEach(p => {
      p.baseX = p.x;
      p.baseY = p.y;
      p.targetX = p.x;
      p.targetY = p.y;
    });

    // Formation patterns
    const createFormation = (type: 'circle' | 'grid' | 'wave') => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (type === 'circle') {
        const radius = Math.min(220, Math.min(canvas.width, canvas.height) / 4);
        particles.forEach((p, i) => {
          const angle = (i / particles.length) * Math.PI * 2;
          p.targetX = centerX + Math.cos(angle) * radius;
          p.targetY = centerY + Math.sin(angle) * radius;
        });
      } else if (type === 'grid') {
        const cols = 8;
        const spacing = Math.max(60, Math.min(120, Math.min(canvas.width, canvas.height) / 10));
        particles.forEach((p, i) => {
          p.targetX = centerX - (cols * spacing) / 2 + (i % cols) * spacing;
          p.targetY = centerY - 200 + Math.floor(i / cols) * spacing;
        });
      } else if (type === 'wave') {
        particles.forEach((p, i) => {
          const t = i / particles.length;
          p.targetX = t * canvas.width;
          p.targetY = centerY + Math.sin(t * Math.PI * 4) * Math.min(120, canvas.height / 6);
        });
      }
    };

    let animationId = 0 as number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      const timeSinceMove = now - lastMoveTime.current;

      // If mouse hasn't moved for 3 seconds, start formation
      if (timeSinceMove > 3000) {
        formationState.current.timer += 16;
        if (formationState.current.timer > 5000) {
          formationState.current.timer = 0;
          formationState.current.phase = (formationState.current.phase + 1) % 3;
          const formations: Array<'circle' | 'grid' | 'wave'> = ['circle', 'grid', 'wave'];
          createFormation(formations[formationState.current.phase]);
        }
      } else {
        // Reset to base positions when mouse moves
        particles.forEach(p => {
          p.targetX = p.baseX;
          p.targetY = p.baseY;
        });
        formationState.current.timer = 0;
      }

      particles.forEach(particle => {
        // Mouse repulsion with smooth easing
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;

        if (distance < 120 && mousePosition.x > 0) {
          const angle = Math.atan2(dy, dx);
          const force = ((120 - distance) / 120) * 0.8;
          particle.vx -= Math.cos(angle) * force;
          particle.vy -= Math.sin(angle) * force;
        }

        // Move towards target (formation or base) with smooth easing
        const toTargetX = particle.targetX - particle.x;
        const toTargetY = particle.targetY - particle.y;
        particle.vx += toTargetX * 0.01;
        particle.vy += toTargetY * 0.01;

        // Apply velocity with damping
        particle.vx *= 0.85;
        particle.vy *= 0.85;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.5;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.5;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.fill();

        // Draw connections
        particles.forEach(other => {
          if (particle === other) return;
          const dx2 = particle.x - other.x;
          const dy2 = particle.y - other.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
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
      lastMoveTime.current = Date.now();
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-scroll carousel for steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Tax Assistant",
      description: "Get instant answers to your Nigerian tax questions with our intelligent chatbot"
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Tax Calculators",
      description: "Accurate PAYE, VAT, and Capital Gains Tax calculations at your fingertips"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Knowledge Base",
      description: "Comprehensive guides and articles on Nigerian tax regulations"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Always Updated",
      description: "Stay current with the latest tax laws and policy changes"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart Insights",
      description: "Data-driven recommendations to optimize your tax strategy"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Support",
      description: "Access to tax professionals when you need human guidance"
    }
  ];

  const steps = [
    { num: "01", title: "Ask Your Question", desc: "Type any tax-related query in plain language", icon: "💬" },
    { num: "02", title: "AI Processing", desc: "Our system analyzes using Nigerian tax laws", icon: "🤖" },
    { num: "03", title: "Get Answers", desc: "Receive accurate, detailed responses instantly", icon: "✨" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Floating money symbols */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {nairaPositions.map((pos, i) => (
          <div
            key={i}
            className="absolute text-blue-600 dark:text-blue-500 text-6xl animate-float-axis"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            ₦
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float-axis {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-25px) rotate(2deg); opacity: 0.2; }
        }
        .animate-float-axis {
          animation: float-axis 6s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation - Sticky Header with Glass Effect */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.push('/homepage')}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                TP
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">TaxPadi</span>
            </button>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</a>
              <a href="#calculators" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Calculators</a>
              <a href="#resources" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Resources</a>
              <ThemeToggle />
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Sign in
              </button>

              <button 
                onClick={() => router.push('/signup')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden text-gray-900 dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-200/50 dark:border-white/10 pt-4">
              <a href="#features" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
              <a href="#how-it-works" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How it Works</a>
              <a href="#calculators" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Calculators</a>
              <a href="#resources" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Resources</a>
              <button
                onClick={() => {
                  router.push('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-5 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium"
              >
                Sign in
              </button>
              <button 
                onClick={() => {
                  router.push('/signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-5 py-2 bg-blue-600 rounded-lg text-sm font-medium"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-xs font-medium text-blue-400 mb-6 backdrop-blur-sm">
            Moment
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Nigerian Tax<br />
            <span className="text-blue-500">Made Simple</span>
          </h1>

          <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl">
            Navigate Nigerian tax regulations with confidence. Get instant answers, 
            calculate taxes accurately, and stay compliant—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => router.push('/signup')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="px-6 py-3 border border-white/20 hover:bg-white/5 rounded-lg font-medium transition-colors backdrop-blur-sm"
            >
              View Demo
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold text-blue-500 mb-1">10K+</div>
              <div className="text-sm text-gray-400">Queries Solved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500 mb-1">99%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500 mb-1">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features with glass effect on hover */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Everything You Need
          </h2>
          <p className="text-gray-400">
            Comprehensive tools for all your tax management needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 hover:border-blue-600/50 transition-all group backdrop-blur-sm hover:backdrop-blur-md"
            >
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4 text-blue-500 group-hover:bg-blue-600/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Auto-scroll carousel for steps */}
      <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Simple Process
          </h2>
          <p className="text-gray-400">
            Get started in minutes
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentStep * 100}%)` }}
            >
              {steps.map((step, idx) => (
                <div key={idx} className="min-w-full p-12 text-center">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="text-5xl font-bold text-white/10 mb-4">{step.num}</div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400 max-w-md mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-blue-500 w-8' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Live Interactive Calculator */}
      <section id="calculators" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Live Tax Calculator
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Calculate your PAYE tax in real-time as you type. See instant breakdowns 
              based on current Nigerian tax bands and rates.
            </p>
            <ul className="space-y-3 mb-8">
              {['Real-time calculations', 'Detailed tax breakdown', 'All Nigerian tax bands', 'Export results as PDF', 'Save calculation history'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
            <div className="space-y-6">
              {/* Income Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Annual Income (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">₦</span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value) || 0)}
                    className="w-full bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/20 rounded-lg pl-12 pr-4 py-3 text-xl font-semibold focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-sm"
                    placeholder="5,000,000"
                  />
                </div>
              </div>

              {/* Tax Result */}
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-gray-400">Annual Tax</span>
                  <span className="text-3xl font-bold text-blue-400">
                    ₦{taxData.tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-400">Net Income</span>
                  <span className="text-xl font-semibold">
                    ₦{taxData.netIncome.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-400">Tax Breakdown by Band</h4>
                {taxData.breakdown.map((band, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                      {(band.rate * 100).toFixed(0)}% on ₦{band.taxable.toLocaleString()}
                    </span>
                    <span className="font-semibold">₦{band.tax.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Monthly breakdown */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Monthly Tax</div>
                  <div className="font-semibold">₦{Math.round(taxData.tax / 12).toLocaleString()}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Effective Rate</div>
                  <div className="font-semibold">{((taxData.tax / income) * 100).toFixed(1)}%</div>
                </div>
              </div>

              <button 
                onClick={() => router.push('/signup')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Save Calculation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="bg-blue-600 rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white text-8xl font-bold"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${10 + (i % 2) * 40}%`,
                  transform: 'rotate(-10deg)',
                }}
              >
                ₦
              </div>
            ))}
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands who trust TaxPadi for accurate tax guidance and calculations.
            </p>
            <button 
              onClick={() => router.push('/signup')}
              className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
            >
              Start Free Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                  TP
                </div>
                <span className="font-semibold">TaxPadi</span>
              </div>
              <p className="text-sm text-gray-400">
                Making Nigerian tax simple and accessible.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Calculators</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 TaxPadi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TaxPadiLanding;
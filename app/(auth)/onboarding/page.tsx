"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, User, Briefcase, GraduationCap, FileText, Calculator, HelpCircle, Sparkles } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const steps = [
    {
      title: "Welcome to TaxPadi",
      description: "Your intelligent Nigerian tax assistant",
      icon: <Sparkles className="w-12 h-12 text-blue-500" />,
      content: (
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-blue-500" />
          </div>
          <p className="text-lg text-gray-300 leading-relaxed max-w-md mx-auto">
            We'll help you navigate Nigerian tax laws, make accurate calculations, and stay compliant—all powered by AI.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">10K+</div>
              <div className="text-xs text-gray-400 mt-1">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">99%</div>
              <div className="text-xs text-gray-400 mt-1">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">24/7</div>
              <div className="text-xs text-gray-400 mt-1">Available</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "What brings you here?",
      description: "Help us personalize your experience",
      content: (
        <div className="space-y-3">
          {[
            { label: 'Individual taxpayer', icon: <User className="w-5 h-5" /> },
            { label: 'Business owner', icon: <Briefcase className="w-5 h-5" /> },
            { label: 'Tax professional', icon: <FileText className="w-5 h-5" /> },
            { label: 'Student/Researcher', icon: <GraduationCap className="w-5 h-5" /> },
          ].map((option) => {
            const isSelected = selectedRoles.includes(option.label);
            return (
              <button
                key={option.label}
                onClick={() => {
                  if (isSelected) {
                    setSelectedRoles(selectedRoles.filter(r => r !== option.label));
                  } else {
                    setSelectedRoles([...selectedRoles, option.label]);
                  }
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-blue-600' : 'bg-white/5'
                }`}>
                  {option.icon}
                </div>
                <span className="flex-1 text-left font-medium">{option.label}</span>
                {isSelected && <Check className="w-5 h-5 text-blue-500" />}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "What interests you most?",
      description: "Choose your primary focus",
      content: (
        <div className="space-y-3">
          {[
            { label: 'Understanding tax laws', icon: <FileText className="w-5 h-5" />, desc: 'Learn about Nigerian tax regulations' },
            { label: 'Calculating taxes', icon: <Calculator className="w-5 h-5" />, desc: 'Use our smart calculators' },
            { label: 'Filing assistance', icon: <HelpCircle className="w-5 h-5" />, desc: 'Get help with tax filing' },
            { label: 'General tax questions', icon: <Sparkles className="w-5 h-5" />, desc: 'Ask anything about taxes' },
          ].map((option) => {
            const isSelected = selectedInterest === option.label;
            return (
              <button
                key={option.label}
                onClick={() => setSelectedInterest(option.label)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-blue-600' : 'bg-white/5'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.desc}</div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      ),
    },
  ];

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
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Onboarding complete:', { selectedRoles, selectedInterest });
      // Navigate to signup
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Navigate to homepage
      console.log('Back to homepage');
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1) return selectedRoles.length > 0;
    if (currentStep === 2) return selectedInterest !== '';
    return true;
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            TP
          </div>
          <span className="text-2xl font-semibold">TaxPadi</span>
        </div>

        {/* Onboarding Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-3">
                    <div className="h-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          index < currentStep ? 'bg-blue-600 w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-400 mb-6">
              {steps[currentStep].description}
            </p>
            <div className="min-h-[300px]">
              {steps[currentStep].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-white/10">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 0 ? 'Back to Home' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

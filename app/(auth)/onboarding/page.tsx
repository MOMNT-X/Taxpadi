"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const steps = [
  {
    title: "Welcome to TaxPadi",
    description: "Let's get you started with a few quick questions.",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          We'll help you understand Nigerian tax laws and make calculations
          easier.
        </p>
      </div>
    ),
  },
  {
    title: "What brings you here?",
    description: "Help us personalize your experience",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground mb-4">
          Select all that apply:
        </p>
        <div className="space-y-2">
          {[
            "Individual taxpayer",
            "Business owner",
            "Tax professional",
            "Student/Researcher",
          ].map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent"
            >
              <input type="checkbox" className="rounded" />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "What are you most interested in?",
    description: "Choose your primary focus",
    content: (
      <div className="space-y-2">
        {[
          "Understanding tax laws",
          "Calculating taxes",
          "Filing assistance",
          "General tax questions",
        ].map((option) => (
          <button
            key={option}
            className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/signup");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/homepage");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? "bg-primary-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? "bg-primary-600" : "bg-muted"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground mb-6">
              {steps[currentStep].description}
            </p>
            {steps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? "Back to Home" : "Back"}
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


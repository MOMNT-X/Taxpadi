"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calculator, MessageSquare, Book, Shield } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            TaxPadi
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your intelligent assistant for Nigerian tax laws and calculations
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/onboarding")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary-600 mb-2" />
              <CardTitle>AI Chat Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ask questions about Nigerian tax laws and get instant, accurate
                answers powered by AI.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calculator className="h-10 w-10 text-primary-600 mb-2" />
              <CardTitle>Tax Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Calculate VAT, PAYE, CIT, PIT, and CGT with our comprehensive
                tax calculator.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Book className="h-10 w-10 text-primary-600 mb-2" />
              <CardTitle>Tax Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access a library of tax articles and guides to stay informed
                about Nigerian tax regulations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary-600 mb-2" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your data is encrypted and secure. We prioritize your privacy and
                confidentiality.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                Ready to simplify your tax journey?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who trust TaxPadi for their tax
                questions and calculations.
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/onboarding")}
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


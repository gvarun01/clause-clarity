
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, FileText, Shield, User } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-legal-action/20 to-background z-0"></div>
        <div className="relative z-10 container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-legal-action via-teal-300 to-legal-action bg-clip-text text-transparent mb-6">
            ClearClause: Decode Legal Complexity
          </h1>
          
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-foreground/90">
            Instantly understand complex legal contracts and terms without a law degree. 
            Our AI simplifies legal language and identifies risky clauses in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              size="lg"
              className="bg-legal-action hover:bg-legal-action/80 text-white gap-2 px-8"
              asChild
            >
              <Link to="/auth">
                <User size={18} />
                Sign Up Free
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8"
              asChild
            >
              <Link to="/">
                <FileText size={18} />
                Try Demo
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How ClearClause Helps You</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-legal-action/10 w-12 h-12 flex items-center justify-center mb-4">
                <FileText size={24} className="text-legal-action" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plain Language Explanations</h3>
              <p className="text-muted-foreground">
                We translate dense legal jargon into simple language anyone can understand.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-legal-moderate/10 w-12 h-12 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-legal-moderate" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Quickly identify risky terms and understand their potential impact.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-green-500/10 w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Follow-up Questions</h3>
              <p className="text-muted-foreground">
                Ask specific questions about clauses to get detailed AI answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
          
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-lg bg-card/50 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold">Entrepreneurs</h3>
            </div>
            <div className="p-4 rounded-lg bg-card/50 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold">Freelancers</h3>
            </div>
            <div className="p-4 rounded-lg bg-card/50 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold">Small Businesses</h3>
            </div>
            <div className="p-4 rounded-lg bg-card/50 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold">Non-Lawyers</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Decode Legal Complexity?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-muted-foreground">
            Join thousands of users who are making informed decisions with ClearClause. No legal expertise required.
          </p>
          <Button
            size="lg"
            className="bg-legal-action hover:bg-legal-action/80 text-white gap-2 px-10"
            asChild
          >
            <Link to="/auth">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2025 ClearClause. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-2">
            Not a substitute for legal advice. Always consult a qualified attorney for legal matters.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

"use client";
import React, { useState } from "react";
import {
  Palette,
  Users,
  Sparkles,
  Share2,
  Play,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Bot,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScribbleDrawLandingProfessional() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description:
        "Instantly create secure rooms and invite team members to collaborate on your canvas in real-time.",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI-Powered Drawing",
      description:
        "Generate precise shapes, align diagrams, and enhance your designs with our advanced AI assistant.",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Instant Sharing",
      description:
        "Share your canvas boards with a simple, secure link. No downloads or complex setups required.",
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Infinite Canvas",
      description:
        "Never run out of space with our infinite, zoomable canvas that scales with your team's ideas.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Lead UX Designer",
      company: "Innovate Inc.",
      content:
        "ScribbleDraw has become an indispensable tool for our design sprints. The AI features save us hours of tedious work.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Mike Chen",
      role: "Product Manager",
      company: "Solutions Corp",
      content:
        "The real-time collaboration is the best we've ever used. It's stable, fast, and has made our remote team feel more connected.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      company: "Visionary Studios",
      content:
        "The infinite canvas combined with the AI-enhanced shapes allows our creative team to brainstorm without limits. It's a game-changer.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const handleCtaClick = () => {
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* CHANGE: Cleaner nav with a border instead of a shadow */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-9 h-9 bg-sky-600 rounded-lg flex items-center justify-center mr-3">
                <Palette className="w-5 h-5 text-white" />
              </div>
              {/* CHANGE: Removed gradient from text for a cleaner look */}
              <span className="text-2xl font-bold text-slate-900">
                ScribbleDraw
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-600 hover:text-sky-600 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-slate-600 hover:text-sky-600 transition-colors"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-slate-600 hover:text-sky-600 transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={handleCtaClick}
                className="bg-sky-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-sky-700 transition-colors duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="space-y-2 px-2 pt-2 pb-3">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block w-full text-left text-slate-600 hover:text-sky-600 py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block w-full text-left text-slate-600 hover:text-sky-600 py-2"
                >
                  Use Cases
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="block w-full text-left text-slate-600 hover:text-sky-600 py-2"
                >
                  Testimonials
                </button>
              </div>
              <div className="px-2">
                <button
                  onClick={handleCtaClick}
                  className="w-full bg-sky-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* CHANGE: Hero Section refactored to a 2-column, left-aligned layout */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Accelerate Team Creativity with an
                <span className="text-sky-600"> AI-Powered Whiteboard</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto md:mx-0">
                The intelligent, collaborative canvas that helps your team
                clarify complex ideas, align on strategy, and build the next
                big thing, faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={handleCtaClick}
                  className="bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-sky-700 transition-colors duration-300 flex items-center justify-center"
                >
                  Start your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="flex items-center justify-center text-slate-700 hover:text-sky-600 transition-colors font-medium">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
            </div>
            {/* CHANGE: Placeholder for a product visual */}
            <div className="hidden md:block">
              <div className="bg-white rounded-lg shadow-2xl p-4 border border-slate-200">

                <img
                  src="https://placehold.co/1200x800/e2e8f0/64748b?text=ScribbleDraw+App+UI"
                  alt="ScribbleDraw App Interface"
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              A Platform Built for Modern Collaboration
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              ScribbleDraw provides the features your team needs to move from
              idea to execution with speed and clarity.
            </p>
          </div>
          {/* CHANGE: Cleaner feature cards with accent-colored icons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-sky-600 mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-slate-600">
              Go from signup to seamless collaboration in three simple steps.
            </p>
          </div>
          {/* CHANGE: Cleaner, outlined step indicators */}
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="border-2 border-sky-600 text-sky-600 rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Create a Canvas
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Start a new project with an infinite canvas. No setup or
                configuration needed.
              </p>
            </div>
            <div className="text-center">
              <div className="border-2 border-sky-600 text-sky-600 rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Invite Your Team
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Share a secure link to invite colleagues or clients into your
                collaborative space instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="border-2 border-sky-600 text-sky-600 rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Create with AI
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Use AI-powered tools to perfect diagrams, generate ideas, and
                bring your vision to life faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by High-Performing Teams
            </h2>
            <div className="flex justify-center items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                />
              ))}
              <span className="ml-3 text-slate-600">
                <strong>4.9/5</strong> from over 2,000 reviews
              </span>
            </div>
          </div>
          {/* CHANGE: Cleaner testimonial cards with borders */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-8 border border-slate-100"
              >
                <p className="text-slate-700 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* CHANGE: Solid accent color for a strong, branded CTA */}
      <section className="py-20 bg-sky-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Unlock Your Team's Potential?
          </h2>
          <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
            Join thousands of teams using ScribbleDraw to collaborate,
            innovate, and achieve their goals. Start your free 14-day trial
            today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-sky-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors duration-300 flex items-center">
              Start Free Trial
              <Zap className="w-5 h-5 ml-2" />
            </button>
            <button className="border-2 border-sky-200 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-sky-600 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>

          <div className="mt-8 flex justify-center items-center space-x-6 text-sky-100 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* CHANGE: Dark slate background for a softer, more modern dark theme */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-9 h-9 bg-sky-600 rounded-lg flex items-center justify-center mr-3">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">ScribbleDraw</span>
              </div>
              <p className="text-slate-400">
                The AI-powered collaborative platform for modern teams.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} ScribbleDraw. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { Moon, Sun, Pencil, Sparkles, Share2, Download } from "lucide-react";
import Image from "next/image";
import { Input } from "@repo/ui/input";
import Link from "next/link";
import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Pencil className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Scribble
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Unleash Your Creativity with Scribble
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create stunning digital artwork with our intuitive drawing app.
              Perfect for artists, designers, and creative minds.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button
                  varient="primary"
                  size="lg"
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  SignUp
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  varient="outlined"
                  size="lg"
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
                >
                  SignIn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-purple-50">
              <Sparkles className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Effects
              </h3>
              <p className="text-gray-600">
                Enhance your artwork with intelligent filters and effects
                powered by AI.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-purple-50">
              <Share2 className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Sharing
              </h3>
              <p className="text-gray-600">
                Share your creations instantly with friends and the community.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-purple-50">
              <Download className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Export Anywhere
              </h3>
              <p className="text-gray-600">
                Export your artwork in multiple formats for any use case.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Art Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Created with Scribble
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
              alt="Digital Art Example 1"
              className="rounded-lg shadow-lg hover:opacity-90 transition-opacity"
            />
            <img
              src="https://images.unsplash.com/photo-1633186710895-309db2eca9e4?auto=format&fit=crop&w=800&q=80"
              alt="Digital Art Example 2"
              className="rounded-lg shadow-lg hover:opacity-90 transition-opacity"
            />
            <img
              src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=800&q=80"
              alt="Digital Art Example 3"
              className="rounded-lg shadow-lg hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

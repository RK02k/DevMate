import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserButton } from '@stackframe/stack'
import { Brain, Rocket, Lock, MessageSquareHeart, Languages, ClipboardList } from 'lucide-react'
import React from 'react'

export default function Home() {
  
  return (
    <main className="bg-white text-gray-800 min-h-screen flex flex-col items-center">
      
      {/* Top Nav with User Button */}
      <div className="w-full px-6 py-4 flex justify-end items-center bg-white shadow-sm">
        <UserButton />
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gray-50 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Image 
            src="/hero-illustration.svg" 
            alt="Hero Illustration" 
            width={300} 
            height={200} 
            className="mx-auto mb-6" 
          />
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Ace Every Interview with DevMate
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Personalized practice. Real simulations. Instant feedback. All in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Button className="px-6 py-3 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
            <Button variant="outline" className="px-6 py-3 text-lg rounded-full">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Why DevMate */}
      <section className="bg-white py-16 px-6 w-full">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-12">Why DevMate?</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left text-lg">
            <Feature icon={<ClipboardList />} text="Topic-Based Lectures tailored to your skill level" />
            <Feature icon={<MessageSquareHeart />} text="Mock Interviews with AI or real mentors" />
            <Feature icon={<Brain />} text="Q&A Practice with instant feedback" />
            <Feature icon={<Languages />} text="Language Learning to expand your career reach" />
            <Feature icon={<Rocket />} text="Mindfulness Sessions to ease your interview anxiety" />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-100 py-16 px-6 w-full">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-12">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left text-lg">
            <Feature icon={<Rocket />} text="Personalized dashboard with learning & feedback history" color="green" />
            <Feature icon={<Brain />} text="Smarter practice with contextual recommendations" color="green" />
            <Feature icon={<Rocket />} text="Faster improvement with tracked progress" color="green" />
            <Feature icon={<Lock />} text="Privacy-first design to keep your sessions secure" color="green" />
          </div>
        </div>
      </section>

      {/* CTA Button */}
      <div className="my-12">
        <a
          href="http://localhost:3000/dashboard"
          className="inline-block px-8 py-3 text-white bg-blue-600 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  )
}
const Feature = ({ icon, text, color = 'blue' }) => (
  <div className="flex items-start space-x-4">
    <div className={`mt-1 text-${color}-600`}>{icon}</div>
    <p>{text}</p>
  </div>
)


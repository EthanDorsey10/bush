import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage("You're in!")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col px-6 py-8">
      {/* Header - pinned to top */}
      <p className="text-[#6B8E6B] text-xs tracking-widest uppercase text-center">
        Powered by Il Bosco
      </p>

      {/* Main content - centered */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <img
          src="/images/flyer.png"
          alt="The Bush Comedy Show"
          className="w-full max-w-sm mb-8"
        />
        <a
          href="https://eventbrite.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#6B8E6B] hover:bg-[#4A6B4A] text-[#F5F5F0] py-3 px-6 rounded-full text-center transition-colors w-full max-w-xs"
          style={{ fontFamily: "'Caveat', cursive", fontSize: '1.5rem' }}
        >
          Buy Tickets
        </a>
      </div>

      {/* Bottom section - mailing list */}
      <form onSubmit={handleSubscribe} className="w-full max-w-xs mx-auto">
        <p
          className="text-[#6B8E6B] mb-3 text-center"
          style={{ fontFamily: "'Caveat', cursive", fontSize: '1.25rem' }}
        >
          Join the mailing list
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-2 border-2 border-[#6B8E6B] rounded-full bg-transparent text-[#4A6B4A] placeholder-[#8FB08F] focus:outline-none focus:border-[#4A6B4A]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#6B8E6B] hover:bg-[#4A6B4A] disabled:opacity-50 text-[#F5F5F0] px-4 py-2 rounded-full transition-colors"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem' }}
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </div>
        {message && (
          <p
            className={`mt-2 text-sm text-center ${status === 'success' ? 'text-[#4A6B4A]' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

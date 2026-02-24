import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/db'
import { subscribers } from '@/db/schema'

async function handler({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await db.insert(subscribers).values({ email: email.toLowerCase().trim() })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes('UNIQUE constraint failed')
    ) {
      return new Response(JSON.stringify({ error: 'Already subscribed' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.error('Subscribe error:', error)
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const Route = createFileRoute('/api/subscribe')({
  server: {
    handlers: {
      POST: handler,
    },
  },
})

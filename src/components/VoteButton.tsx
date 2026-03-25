'use client'
import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'

export default function VoteButton({ channelId, initialVotes }: { channelId: string, initialVotes: number }) {
  const [votes, setVotes] = useState(initialVotes)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault() // prevent Link wrapper navigation
    if (voted || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/vote', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }) 
      })
      if (res.ok) {
        setVoted(true)
        setVotes(v => v + 1)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleVote} 
      title="Oy Ver"
      className={`flex flex-shrink-0 z-10 relative items-center gap-1 font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${voted ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600'}`}
    >
      <ThumbsUp className={`w-3 h-3 ${voted ? 'text-blue-600' : 'text-slate-400'}`} />
      {votes}
    </button>
  )
}

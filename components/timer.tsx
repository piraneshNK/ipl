"use client"

import { useState, useEffect, useRef } from "react"
import { Progress } from "@/components/ui/progress"

interface TimerProps {
  seconds: number
  onTimerEnd: () => void
  isRunning: boolean
}

export default function Timer({ seconds, onTimerEnd, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [progress, setProgress] = useState(100)
  const timerEndCalled = useRef(false)

  useEffect(() => {
    // Reset when timer is restarted
    if (isRunning) {
      setTimeLeft(seconds)
      setProgress(100)
      timerEndCalled.current = false
    }

    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1

          // Check if timer has ended and callback hasn't been called yet
          if (newTime <= 0 && !timerEndCalled.current) {
            timerEndCalled.current = true
            // Use setTimeout to ensure this happens after the current render cycle
            setTimeout(() => {
              onTimerEnd()
            }, 0)
            return 0
          }

          return newTime < 0 ? 0 : newTime
        })

        setProgress((prevProgress) => {
          const newProgress = prevProgress - 100 / seconds
          return newProgress < 0 ? 0 : newProgress
        })
      }, 1000)
    }

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [seconds, onTimerEnd, isRunning])

  return (
    <div className="w-full max-w-xs">
      <div className="text-center mb-2">
        <span className="text-2xl font-bold">{timeLeft}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}


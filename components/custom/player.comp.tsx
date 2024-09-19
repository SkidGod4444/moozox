"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronUp, ChevronDown, Play, Pause, SkipBack, SkipForward, Volume2, Plus, Mic, Shuffle, Repeat } from "lucide-react"

export default function PlayerComp() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: off, 1: repeat all, 2: repeat one

  const toggleExpand = () => setIsExpanded(!isExpanded)
  const togglePlayPause = () => setIsPlaying(!isPlaying)
  const toggleShuffle = () => setIsShuffle(!isShuffle)
  const toggleRepeat = () => setRepeatMode((repeatMode + 1) % 3)

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isExpanded])

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-background transition-all duration-300 ease-in-out ${isExpanded ? 'top-0' : 'h-20'}`}>
      {isExpanded && (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0" style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920')"}} />
      )}
      <div className="container mx-auto px-4 h-full flex flex-col relative z-10">
        <div className={`flex items-center justify-between h-20 ${isExpanded ? 'h-full flex-col justify-start' : ''}`}>
          <div className={`flex items-center space-x-4 ${isExpanded ? 'flex-col items-start space-x-0 space-y-4 mt-8 w-full' : ''}`}>
            <img 
              src="/placeholder.svg?height=300&width=300" 
              alt="Album cover" 
              className={`rounded ${isExpanded ? 'w-64 h-64 rounded-lg shadow-lg' : 'w-12 h-12'}`} 
            />
            <div className={`flex items-center space-x-2 ${isExpanded ? 'flex-col items-start space-x-0 w-full' : ''}`}>
              <div className={isExpanded ? 'text-center w-full' : ''}>
                <h3 className={`font-semibold ${isExpanded ? 'text-2xl mt-4' : 'text-sm'}`}>Song Title</h3>
                <p className={`text-muted-foreground ${isExpanded ? 'text-lg' : 'text-xs'}`}>Artist Name</p>
              </div>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={`flex-1 max-w-xl mx-auto ${isExpanded ? 'max-w-2xl w-full mt-auto mb-8' : ''}`}>
            <div className="flex items-center justify-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleShuffle} className={isShuffle ? "text-primary" : ""}>
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button size="icon" onClick={togglePlayPause} className={isExpanded ? 'scale-150' : ''}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleRepeat} className={repeatMode > 0 ? "text-primary" : ""}>
                <Repeat className="h-4 w-4" />
                {repeatMode === 2 && <span className="absolute text-[10px] font-bold">1</span>}
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-muted-foreground">1:23</span>
              <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
              <span className="text-xs text-muted-foreground">3:45</span>
            </div>
          </div>
          <div className={`flex items-center space-x-4 ${isExpanded ? 'w-full justify-between mt-4' : ''}`}>
            <Button variant="ghost" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Slider defaultValue={[50]} max={100} step={1} className="w-20" />
            </div>
            <Button variant="ghost" size="icon" onClick={toggleExpand}>
              {isExpanded ? <ChevronDown className="h-6 w-6" /> : <ChevronUp className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {isExpanded && (
          <div className="flex-grow flex flex-col items-center justify-center space-y-8 overflow-y-auto">
            <div className="w-full max-w-2xl space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <h4 className="text-lg font-semibold mb-2">Lyrics</h4>
                <p>Here&apos;s where the song lyrics would appear...</p>
                <p>Verse 1</p>
                <p>Chorus</p>
                <p>Verse 2</p>
                <p>Chorus</p>
                <p>Bridge</p>
                <p>Chorus</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
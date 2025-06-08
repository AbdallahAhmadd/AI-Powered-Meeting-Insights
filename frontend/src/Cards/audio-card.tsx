"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, FileAudio, Clock, Trash2, Brain } from "lucide-react"
import { getTranscription } from "@/api"
import ReactMarkdown from 'react-markdown'

interface AudioFile {
  id: string
  name: string
  url: string
  duration: number
  size: number
  timestamp: Date
}

interface AnalysisResult {
  transcription: string;
  analysis: string;
}

export default function AudioUploader() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<string>("")
  const [analysisStatus, setAnalysisStatus] = useState<string>("")
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Format file size helper
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress)
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      const audioUrl = URL.createObjectURL(file)

      // Get audio duration
      const audio = new Audio(audioUrl)
      await new Promise((resolve) => {
        audio.onloadedmetadata = () => resolve(null)
      })

      const newFile: AudioFile = {
        id: Date.now().toString() + i,
        name: file.name,
        url: audioUrl,
        duration: Math.floor(audio.duration),
        size: file.size,
        timestamp: new Date(),
      }

      setAudioFiles((prev) => [newFile, ...prev])
    }

    setIsUploading(false)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Play/Pause audio
  const togglePlayAudio = (id: string) => {
    if (playingId === id) {
      setPlayingId(null)
    } else {
      setPlayingId(id)
    }
  }

  // Delete audio file
  const deleteAudioFile = (id: string) => {
    setAudioFiles((prev) => prev.filter((file) => file.id !== id))
    if (playingId === id) {
      setPlayingId(null)
    }
  }

  // Download audio file
  const downloadAudioFile = (file: AudioFile) => {
    const a = document.createElement("a")
    a.href = file.url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Analyze audio file
  const analyzeAudioFile = async (file: AudioFile) => {
    try {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      setAnalysisStatus("Starting analysis...");

      // Convert the audio URL to a File object
      const response = await fetch(file.url);
      const blob = await response.blob();
      const audioFile = new File([blob], file.name, { type: 'audio/wav' });

      setAnalysisProgress(20);
      setAnalysisStatus("Transcribing audio...");

      // Start progress simulation
      progressIntervalRef.current = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 55) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
            }
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // Call the transcription API
      const result = await getTranscription(audioFile);
      
      // Clear the progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }

      setAnalysisProgress(60);
      setAnalysisStatus("Analyzing content...");

      setAnalysisResults(result.analysis);
      
      setAnalysisProgress(100);
      setAnalysisStatus("Analysis complete!");
    } catch (error) {
      console.error('Error analyzing audio:', error);
      setAnalysisStatus("Analysis failed");
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      alert('Failed to analyze audio file');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="h-5 w-5" />
            Audio Files
          </CardTitle>
          <CardDescription>Upload audio files for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="audio-upload">Audio Files</Label>
            <Input
              ref={fileInputRef}
              id="audio-upload"
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {audioFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="h-5 w-5" />
              Audio Files ({audioFiles.length})
            </CardTitle>
            <CardDescription>Manage your uploaded audio files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audioFiles.map((file, index) => (
                <div key={file.id}>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <FileAudio className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{file.name}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(file.duration)}
                          </span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePlayAudio(file.id)}
                        className="flex items-center gap-1"
                      >
                        {playingId === file.id ? "Pause" : "Play"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadAudioFile(file)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => analyzeAudioFile(file)}
                        className="flex items-center gap-1"
                        disabled={isAnalyzing}
                      >
                        <Brain className="h-3 w-3" />
                        Analyze
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteAudioFile(file.id)}
                        className="flex items-center gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {playingId === file.id && (
                    <div className="mt-2 px-4">
                      <audio controls src={file.url} className="w-full" onEnded={() => setPlayingId(null)} autoPlay />
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="mt-2 px-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Brain className="h-4 w-4 animate-pulse" />
                          {analysisStatus}
                        </span>
                        <span>{Math.round(analysisProgress)}%</span>
                      </div>
                      <Progress value={analysisProgress} className="w-full" />
                    </div>
                  )}

                  {analysisResults && !isAnalyzing && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted">
                      <h3 className="font-medium mb-2">Meeting Insights</h3>
                      <div className="text-sm prose prose-sm max-w-none">
                        <ReactMarkdown>{analysisResults}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  

                  {index < audioFiles.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

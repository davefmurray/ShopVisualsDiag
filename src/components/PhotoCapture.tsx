'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface PhotoCaptureProps {
  onCapture: (blob: Blob) => void
  onClose: () => void
}

export default function PhotoCapture({ onCapture, onClose }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  // Start camera on mount
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  async function startCamera() {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Rear camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (err) {
      console.error('Camera error:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera access in your browser settings.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.')
        } else {
          setError(`Failed to access camera: ${err.message}`)
        }
      } else {
        setError('Failed to access camera')
      }
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0)

    // Get image data URL for preview
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedImage(dataUrl)

    setIsCapturing(false)
  }, [])

  function handleRetake() {
    setCapturedImage(null)
  }

  function handleConfirm() {
    if (!canvasRef.current) return

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob)
          onClose()
        }
      },
      'image/jpeg',
      0.92
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 absolute top-0 left-0 right-0 z-10 safe-area-top">
        <button
          onClick={onClose}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors touch-target"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-white font-medium">Take Photo</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Camera View or Preview */}
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="bg-red-900/80 rounded-lg p-6 text-center max-w-sm">
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-white text-red-900 rounded-lg font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/50 safe-area-bottom">
        {capturedImage ? (
          <div className="flex justify-center gap-6">
            <button
              onClick={handleRetake}
              className="px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors touch-target"
            >
              Retake
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors touch-target"
            >
              Use Photo
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={capturePhoto}
              disabled={!stream || isCapturing}
              className="w-20 h-20 rounded-full bg-white border-4 border-white/50 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            >
              <span className="sr-only">Capture</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

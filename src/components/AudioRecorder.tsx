'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioRecorderProps {
  maxDuration: number; // in seconds
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
  onError?: (error: string) => void;
  autoStart?: boolean;
  label?: string;
}

export default function AudioRecorder({ 
  maxDuration, 
  onRecordingComplete, 
  onError,
  autoStart = false,
  label = 'Record Answer'
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording, state:', mediaRecorderRef.current.state, 'chunks so far:', chunksRef.current.length);
      
      // Only stop if actually recording
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Note: Don't stop stream tracks here, wait for onstop to complete first
    }
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    console.log('startRecording called');
    setButtonClicked(true);
    
    try {
      chunksRef.current = [];
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        }
      });
      console.log('Microphone access granted, tracks:', stream.getAudioTracks().length);
      streamRef.current = stream;
      
      // Verify audio track is active
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks in stream');
      }
      console.log('Audio track state:', audioTracks[0].readyState, 'enabled:', audioTracks[0].enabled);

      // Try different audio formats for better compatibility with Whisper API
      // WebM with Opus is most reliable across browsers for MediaRecorder
      let mimeType = '';
      const preferredFormats = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mpeg'
      ];
      
      for (const format of preferredFormats) {
        if (MediaRecorder.isTypeSupported(format)) {
          mimeType = format;
          console.log('Selected mime type:', mimeType);
          break;
        }
      }
      
      if (!mimeType) {
        console.log('No preferred format supported, using default');
      }
      
      // Create MediaRecorder with explicit options
      const options: MediaRecorderOptions = {
        mimeType: mimeType || undefined,
        audioBitsPerSecond: 128000 // 128 kbps
      };
      
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Data chunk received:', event.data.size, 'bytes');
          chunksRef.current.push(event.data);
        } else {
          console.warn('Received empty data chunk');
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setHasFailed(true);
        setErrorMessage('Recording error occurred. Please try again.');
        setIsProcessing(false);
        setIsRecording(false);
      };

      mediaRecorder.onstop = async () => {
        console.log('MediaRecorder onstop fired');
        setIsProcessing(true);
        
        // Stop and clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            console.log('Stopping track:', track.kind, track.label);
            track.stop();
          });
          streamRef.current = null;
        }
        
        // Check minimum recording duration (at least 0.5 seconds)
        const recordingDuration = Date.now() - recordingStartTimeRef.current;
        if (recordingDuration < 500) {
          console.warn('Recording too short:', recordingDuration, 'ms');
          setHasFailed(true);
          setErrorMessage('Recording too short. Please speak for at least 1 second.');
          setIsProcessing(false);
          return;
        }
        
        // Create blob with actual mime type
        const actualMimeType = mimeType || mediaRecorder.mimeType;
        const audioBlob = new Blob(chunksRef.current, { type: actualMimeType });
        
        console.log('Audio blob created:', {
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: chunksRef.current.length,
          duration: recordingDuration,
          chunkSizes: chunksRef.current.map(c => c.size)
        });
        
        // Validate blob size
        if (audioBlob.size < 100) {
          console.error('Audio blob too small:', audioBlob.size, 'bytes');
          console.error('Chunks detail:', chunksRef.current);
          setHasFailed(true);
          setErrorMessage('Recording failed - no audio captured. This may be a browser compatibility issue. Try using Chrome or Firefox.');
          setIsProcessing(false);
          return;
        }
        
        // Upload to transcribe API
        try {
          const formData = new FormData();
          // Determine file extension based on mime type
          let extension = 'webm';
          if (actualMimeType.includes('mp4') || actualMimeType.includes('m4a')) {
            extension = 'm4a';
          } else if (actualMimeType.includes('mpeg') || actualMimeType.includes('mp3')) {
            extension = 'mp3';
          } else if (actualMimeType.includes('ogg')) {
            extension = 'ogg';
          } else if (actualMimeType.includes('wav')) {
            extension = 'wav';
          }
          
          console.log('Uploading audio as:', `recording.${extension}`, 'mime:', actualMimeType);
          formData.append('audio', audioBlob, `recording.${extension}`);

          const response = await fetch('/api/game/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const { transcript } = await response.json();
          onRecordingComplete(audioBlob, transcript);
          setRecordingStarted(false);
          setTimeLeft(maxDuration);
        } catch (error) {
          console.error('Transcription error:', error);
          setHasFailed(true);
          setErrorMessage('Failed to transcribe audio. The audio format may not be supported.');
          onError?.('Failed to transcribe audio. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };

      // Start recording with timeslice to ensure ondataavailable fires
      // Use 1000ms to get more substantial chunks
      try {
        mediaRecorder.start(1000); // Capture data every 1 second
      } catch (startError) {
        console.error('Failed to start MediaRecorder:', startError);
        throw new Error('Failed to start recording: ' + (startError instanceof Error ? startError.message : 'Unknown error'));
      }
      
      recordingStartTimeRef.current = Date.now();
      setIsRecording(true);
      setRecordingStarted(true);
      setTimeLeft(maxDuration);
      setButtonClicked(false);
      setHasFailed(false);
      setErrorMessage('');
      console.log('Recording started successfully with format:', mimeType || 'default', 'state:', mediaRecorder.state);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setButtonClicked(false);
      onError?.('Failed to access microphone. Please check permissions.');
    }
  }, [maxDuration, onRecordingComplete, onError, stopRecording]);

  useEffect(() => {
    if (autoStart && !recordingStarted && !hasFailed) {
      startRecording();
    }
  }, [autoStart, recordingStarted, hasFailed, startRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {hasFailed && (
        <div className="text-center space-y-3">
          <p className="text-red-600 text-sm">{errorMessage || 'Recording failed. Please try again.'}</p>
          <button
            onClick={() => {
              setHasFailed(false);
              setErrorMessage('');
              setRecordingStarted(false);
              setTimeLeft(maxDuration);
              startRecording();
            }}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 px-8 py-3 text-sm rounded-lg shadow-md"
          >
            Retry Recording
          </button>
        </div>
      )}
      
      {!recordingStarted && !isProcessing && !hasFailed && (
        <button
          onClick={() => {
            console.log('AudioRecorder button clicked!');
            startRecording();
          }}
          disabled={buttonClicked && !isRecording}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait transition-colors duration-200 px-8 py-3 text-sm rounded-lg shadow-md"
        >
          {buttonClicked && !isRecording ? 'Starting...' : label}
        </button>
      )}

      {isRecording && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-gray-800 text-sm">Recording...</span>
          </div>
          
          <div className="text-gray-800 text-3xl font-mono font-medium">
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={stopRecording}
            className="border border-gray-400 text-gray-700 hover:border-gray-600 hover:bg-gray-100 transition-colors duration-200 px-6 py-2 text-sm rounded-lg"
          >
            Stop Recording
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-800 text-sm">Processing audio...</p>
        </div>
      )}
    </div>
  );
}


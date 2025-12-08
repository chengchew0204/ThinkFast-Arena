'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  RemoteParticipant,
  LocalParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  ConnectionState,
} from 'livekit-client';
import { useGameState } from '@/hooks/useGameState';
import GameUI from './GameUI';
import GameControlPanel from './GameControlPanel';

interface LiveKitRoomProps {
  roomName: string;
  identity: string;
  onDisconnected?: () => void;
}

export default function LiveKitRoom({ roomName, identity, onDisconnected }: LiveKitRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<RemoteTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] = useState<RemoteTrack | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);
  const [error, setError] = useState<string | null>(null);

  // Game state management
  const {
    gameState,
    startGame,
    setContent,
    generateQuestion,
    buzzIn,
    submitAnswer,
    nextRound,
    resetGame,
    addPlayer,
  } = useGameState(room, identity);

  const connectToRoom = useCallback(async () => {
    try {
      setError(null);
      
      // Get token from API with publish permissions for game mode
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity,
          roomName,
          canPublish: true,
          canSubscribe: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const { token } = await response.json();

      // Connect to LiveKit room
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: {
            width: 1280,
            height: 720,
          },
          facingMode: 'user',
        },
      });

      // Set up event listeners
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to room:', roomName);
        setIsConnected(true);
        setConnectionState(ConnectionState.Connected);
        setError(null);
      });

      newRoom.on(RoomEvent.Reconnecting, () => {
        console.log('Reconnecting to room:', roomName);
        setConnectionState(ConnectionState.Reconnecting);
      });

      newRoom.on(RoomEvent.Reconnected, () => {
        console.log('Reconnected to room:', roomName);
        setIsConnected(true);
        setConnectionState(ConnectionState.Connected);
        setError(null);
      });

      newRoom.on(RoomEvent.Disconnected, (reason) => {
        console.log('Disconnected from room:', reason);
        setIsConnected(false);
        setConnectionState(ConnectionState.Disconnected);
        setRemoteVideoTrack(null);
        setRemoteAudioTrack(null);
        onDisconnected?.();
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        console.log('Track subscribed:', track.kind, 'from', participant.identity);
        if (track.kind === Track.Kind.Video) {
          setRemoteVideoTrack(track);
        } else if (track.kind === Track.Kind.Audio) {
          setRemoteAudioTrack(track);
        }
      });

      newRoom.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        console.log('Track unsubscribed:', track.kind, 'from', participant.identity);
        if (track.kind === Track.Kind.Video) {
          setRemoteVideoTrack(null);
        } else if (track.kind === Track.Kind.Audio) {
          setRemoteAudioTrack(null);
        }
      });

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log('Participant disconnected:', participant.identity);
        // If the broadcaster disconnected, clear the video and audio
        if (participant.identity !== identity) {
          setRemoteVideoTrack(null);
          setRemoteAudioTrack(null);
        }
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log('Participant connected:', participant.identity);
        // Auto-register new participant as a player
        addPlayer(participant.identity);
      });

      // Connect to the room
      const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
      if (!livekitUrl) {
        throw new Error('NEXT_PUBLIC_LIVEKIT_URL environment variable is not set');
      }
      console.log('Connecting to LiveKit URL:', livekitUrl);
      await newRoom.connect(livekitUrl, token);

      // Register current user as a player
      addPlayer(identity);

      // Register all existing participants as players
      newRoom.remoteParticipants.forEach((participant) => {
        console.log('Registering existing participant:', participant.identity);
        addPlayer(participant.identity);
      });

      // Camera/microphone will be controlled by game mode
      console.log('Connected to room. Camera/microphone will be controlled by game mode.');

      setRoom(newRoom);
    } catch (err) {
      console.error('Failed to connect to room:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to room');
    }
  }, [identity, roomName, onDisconnected, addPlayer]);


  const enableAnswererCamera = useCallback(async () => {
    if (!room) {
      console.error('Cannot enable answerer camera: room not initialized');
      return false;
    }

    try {
      console.log('Enabling camera for answerer...');
      
      // Check if we already have camera enabled
      const existingCameraTrack = room.localParticipant.getTrackPublication(Track.Source.Camera);
      if (existingCameraTrack && existingCameraTrack.track) {
        console.log('Camera already enabled');
        return true;
      }

      // Enable camera (we have publish permissions from connection)
      await room.localParticipant.setCameraEnabled(true);
      console.log('Answerer camera enabled and published');
      return true;
    } catch (error) {
      console.error('Failed to enable answerer camera:', error);
      setError('Unable to enable camera for answering. Please check camera permissions.');
      return false;
    }
  }, [room]);

  const disableAnswererCamera = useCallback(async () => {
    if (!room) return;

    try {
      console.log('Disabling answerer camera...');
      await room.localParticipant.setCameraEnabled(false);
      console.log('Answerer camera disabled');
    } catch (error) {
      console.error('Failed to disable answerer camera:', error);
    }
  }, [room]);

  const disconnect = useCallback(async () => {
    if (room) {
      await room.disconnect();
      setRoom(null);
    }
  }, [room]);

  // Connect with publish permissions on component mount
  useEffect(() => {
    let mounted = true;
    
    const initConnection = async () => {
      if (mounted) {
        await connectToRoom();
      }
    };
    
    initConnection();
    
    return () => {
      mounted = false;
      if (room) {
        room.disconnect();
      }
    };
  }, [roomName, identity]); // Only depend on roomName and identity

  // Attach video track to element when available
  useEffect(() => {
    const videoElement = document.getElementById('remote-video') as HTMLVideoElement;
    if (videoElement && remoteVideoTrack) {
      remoteVideoTrack.attach(videoElement);
      return () => {
        remoteVideoTrack.detach();
      };
    }
  }, [remoteVideoTrack]);

  // Attach audio track to element when available
  useEffect(() => {
    const audioElement = document.getElementById('remote-audio') as HTMLAudioElement;
    if (audioElement && remoteAudioTrack) {
      remoteAudioTrack.attach(audioElement);
      return () => {
        remoteAudioTrack.detach();
      };
    }
  }, [remoteAudioTrack]);


  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Audio element for remote audio track */}
      <audio
        id="remote-audio"
        autoPlay
        playsInline
      />
      
      {/* Video Container */}
      <div className="video-container">
        {/* Remote Video (when someone else is in game) */}
        {remoteVideoTrack && (
          <video
            id="remote-video"
            autoPlay
            playsInline
            muted={false}
            className="w-full h-full object-cover scale-x-[-1]"
          />
        )}
        
        {/* Waiting State */}
        {!remoteVideoTrack && (
          <div className="flex flex-col items-center justify-center h-full text-gray-800">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
              <h1 className="text-2xl font-light mb-4 tracking-wide text-gray-900">ThinkFast Arena</h1>
              {connectionState === ConnectionState.Connected ? (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">Ready to play</p>
                  <p className="text-xs text-gray-500">
                    {room && room.numParticipants > 1 
                      ? `${room.numParticipants} players online` 
                      : 'You are the first player'}
                  </p>
                  <p className="text-xs text-gray-700 mt-4">Use the game controls to start</p>
                </div>
              ) : connectionState === ConnectionState.Reconnecting ? (
                <p className="text-gray-600 text-sm">Reconnecting...</p>
              ) : (
                <p className="text-gray-600 text-sm">Connecting...</p>
              )}
            </div>
          </div>
        )}
        
        {/* Connection Status */}
        <div className="absolute top-4 right-4">
          <div className={`inline-flex items-center px-3 py-1 text-xs rounded-lg shadow-md ${
            connectionState === ConnectionState.Connected 
              ? 'bg-green-50 border border-green-400 text-green-700' 
              : connectionState === ConnectionState.Connecting
              ? 'bg-yellow-50 border border-yellow-400 text-yellow-700'
              : 'bg-gray-50 border border-gray-400 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connectionState === ConnectionState.Connected ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            {connectionState === ConnectionState.Connected ? 'Connected' : 
             connectionState === ConnectionState.Connecting ? 'Connecting' : 'Disconnected'}
          </div>
        </div>
        
        {/* Participant Count */}
        {room && (
          <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 px-3 py-1 rounded-lg shadow-md text-gray-700 text-xs border border-gray-200">
            {room.numParticipants} online
          </div>
        )}
      </div>

      {/* Game UI - Always Active */}
      <GameControlPanel
        gameState={gameState}
        identity={identity}
        onStartGame={startGame}
        onSetContent={setContent}
        onGenerateQuestion={generateQuestion}
        onNextRound={nextRound}
        onResetGame={resetGame}
      />
      
      <GameUI
        gameState={gameState}
        identity={identity}
        room={room}
        onBuzzIn={buzzIn}
        onAnswerSubmit={submitAnswer}
        onEnableCamera={enableAnswererCamera}
        onDisableCamera={disableAnswererCamera}
      />
      
      {/* Error/Info Display */}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border border-red-300 p-6 max-w-md">
          <h3 className="font-medium mb-3 text-sm text-red-700">Error</h3>
          <p className="text-sm text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 text-xs transition-colors duration-200 rounded-lg"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

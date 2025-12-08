'use client';

import { useState, useEffect } from 'react';
import LiveKitRoom from '@/components/LiveKitRoom';

type ViewState = 'select' | 'in-room';

export default function Home() {
  const [identity, setIdentity] = useState<string>('');
  const [viewState, setViewState] = useState<ViewState>('select');
  const [roomCode, setRoomCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const storedIdentity = localStorage.getItem('user-identity');
    if (storedIdentity) {
      setIdentity(storedIdentity);
    } else {
      const newIdentity = `user-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user-identity', newIdentity);
      setIdentity(newIdentity);
    }
  }, []);

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createRoom = () => {
    const newCode = generateRoomCode();
    setRoomCode(newCode);
    setViewState('in-room');
    setError('');
  };

  const joinRoom = () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter a room code');
      return;
    }
    if (code.length !== 6) {
      setError('Room code must be 6 characters');
      return;
    }
    setRoomCode(code);
    setViewState('in-room');
    setError('');
  };

  const leaveRoom = () => {
    setViewState('select');
    setRoomCode('');
    setInputCode('');
    setError('');
  };

  const handleDisconnected = () => {
    console.log('Room disconnected, but staying in room UI for reconnection attempts');
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  if (viewState === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center text-gray-800 max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-8 tracking-wide text-gray-900">ThinkFast Arena</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              Real-time quiz game platform with private rooms.<br/>
              Create a room or join with a code.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white">
                <h2 className="text-lg font-medium mb-4 text-gray-800">Create New Room</h2>
                <p className="text-gray-500 text-xs mb-4">
                  Start a new session and receive a unique code to share with others
                </p>
                <button
                  onClick={createRoom}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 py-3 px-6 text-sm font-medium rounded-lg shadow-md hover:shadow-lg"
                >
                  Create Room
                </button>
              </div>

              <div className="text-gray-400 text-xs">OR</div>

              <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-indigo-50 to-white">
                <h2 className="text-lg font-medium mb-4 text-gray-800">Join Existing Room</h2>
                <p className="text-gray-500 text-xs mb-4">
                  Enter the 6-character code shared by the room creator
                </p>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="Enter room code"
                  maxLength={6}
                  className="w-full bg-white border border-gray-300 text-gray-800 text-center text-lg font-mono py-2 px-4 mb-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors uppercase rounded-lg"
                />
                {error && (
                  <p className="text-red-600 text-xs mb-3">{error}</p>
                )}
                <button
                  onClick={joinRoom}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 py-3 px-6 text-sm font-medium rounded-lg shadow-md hover:shadow-lg"
                >
                  Join Room
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Your Identity</span>
                <span className="font-mono text-gray-700">{identity}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <a
                href="/instructions"
                className="border border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200 py-2 px-4 text-xs text-center rounded-lg font-medium"
              >
                How to Play
              </a>
              <a
                href="/test-media"
                className="border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200 py-2 px-4 text-xs text-center rounded-lg"
              >
                Test Devices
              </a>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>Powered by LiveKit Cloud</p>
            <p>WebRTC Real-time Communication</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <LiveKitRoom
        roomName={`arena-${roomCode}`}
        identity={identity}
        onDisconnected={handleDisconnected}
      />
      
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <button
          onClick={leaveRoom}
          className="border border-gray-300 bg-white bg-opacity-95 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 text-sm transition-colors duration-200 rounded-lg shadow-md"
        >
          Leave Room
        </button>
        <div className="border border-gray-300 bg-white bg-opacity-95 px-4 py-2 flex items-center gap-2 rounded-lg shadow-md">
          <span className="text-gray-600 text-xs">Room Code:</span>
          <span className="font-mono text-gray-800 text-sm font-medium">{roomCode}</span>
          <button
            onClick={copyRoomCode}
            className="text-gray-600 hover:text-blue-600 text-xs border border-gray-300 hover:border-blue-400 hover:bg-blue-50 px-2 py-1 transition-colors rounded"
            title="Copy code"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

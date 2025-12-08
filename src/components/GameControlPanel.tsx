'use client';

import { useState } from 'react';
import { GameState, GameStage } from '@/types/game';
import ContentUpload from './ContentUpload';

interface GameControlPanelProps {
  gameState: GameState;
  identity: string;
  onStartGame: (totalRounds: number) => void;
  onSetContent: (contentId: string) => void;
  onGenerateQuestion: () => void;
  onNextRound: () => void;
  onResetGame: () => void;
}

export default function GameControlPanel({
  gameState,
  identity,
  onStartGame,
  onSetContent,
  onGenerateQuestion,
  onNextRound,
  onResetGame,
}: GameControlPanelProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [contentInfo, setContentInfo] = useState<{ title: string; questionCount: number } | null>(null);
  const [totalRounds, setTotalRounds] = useState(5);
  
  // Check if current user is the host
  // Before game starts: anyone can start (no host assigned yet)
  // After game starts: only the designated host can control
  const isHost = !gameState.hostIdentity || gameState.hostIdentity === identity;

  const handleStartGame = () => {
    onStartGame(totalRounds);
    // Auto-generate first question after starting
    setTimeout(() => {
      onGenerateQuestion();
    }, 500);
  };

  const handleUploadComplete = (contentId: string, title: string, questionCount: number) => {
    setContentInfo({ title, questionCount });
    onSetContent(contentId);
    setShowUpload(false);
  };

  return (
    <>
      {showUpload && (
        <ContentUpload
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUpload(false)}
        />
      )}

      <div className="absolute top-20 left-4 z-20 border border-gray-300 bg-white bg-opacity-95 rounded-lg shadow-lg p-4 space-y-3 min-w-[200px]">
        <div className="text-gray-800 text-xs font-medium mb-2 border-b border-gray-200 pb-2">
          {isHost ? 'Game Controls (Host)' : 'Game Info (Spectator)'}
        </div>

        {!gameState.isGameActive ? (
          <div className="space-y-2">
            <button
              onClick={() => setShowUpload(true)}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 px-4 py-2 text-xs font-medium rounded-lg shadow-sm"
            >
              Upload Content
            </button>

            {contentInfo ? (
              <div className="bg-green-50 border border-green-400 rounded-lg p-2 space-y-1">
                <div className="text-green-700 text-xs font-medium">Content Ready</div>
                <div className="text-gray-700 text-xs truncate" title={contentInfo.title}>
                  {contentInfo.title}
                </div>
                <div className="text-gray-600 text-xs">
                  {contentInfo.questionCount} questions generated
                </div>
              </div>
            ) : gameState.currentContentId ? (
              <div className="bg-blue-50 border border-blue-400 rounded-lg p-2">
                <div className="text-blue-700 text-xs">Custom content loaded</div>
              </div>
            ) : (
              <div className="text-gray-500 text-xs text-center p-2">
                Upload custom content or use default questions
              </div>
            )}

            <div className="space-y-2">
              <label className="text-gray-600 text-xs">Number of Rounds:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={totalRounds}
                onChange={(e) => setTotalRounds(parseInt(e.target.value) || 5)}
                className="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-lg"
              />
            </div>

            <button
              onClick={handleStartGame}
              className="w-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 px-4 py-2 text-xs font-medium rounded-lg shadow-sm"
            >
              Start Game & Generate Question
            </button>
          </div>
      ) : (
        <>
          {isHost ? (
            <>
              {gameState.stage === GameStage.WAITING && (
                <button
                  onClick={onGenerateQuestion}
                  className="w-full bg-gray-700 text-white hover:bg-gray-800 transition-colors duration-200 px-4 py-2 text-xs rounded-lg shadow-sm"
                >
                  Generate New Question
                </button>
              )}

              {gameState.stage === GameStage.SCORING && (
                <button
                  onClick={onNextRound}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 px-4 py-2 text-xs rounded-lg shadow-sm"
                >
                  Next Round
                </button>
              )}

              {gameState.stage === GameStage.GAME_OVER && (
                <button
                  onClick={onResetGame}
                  className="w-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 px-4 py-2 text-xs font-medium rounded-lg shadow-sm"
                >
                  Start New Game
                </button>
              )}
            </>
          ) : (
            <div className="text-gray-500 text-xs text-center p-2">
              Only the host can control the game flow
            </div>
          )}

          <div className="text-gray-600 text-xs mt-4">
            <div className="mb-1">Stage: <span className="text-gray-800 font-medium">{gameState.stage}</span></div>
            <div className="mb-1">Players: <span className="text-gray-800 font-medium">{gameState.players.size}</span></div>
            {gameState.isGameActive && gameState.currentRound > 0 && (
              <div>Round: <span className="text-gray-800 font-medium">{gameState.currentRound} / {gameState.totalRounds}</span></div>
            )}
          </div>
        </>
      )}
      </div>
    </>
  );
}


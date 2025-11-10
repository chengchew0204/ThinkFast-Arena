'use client';

import { useState } from 'react';
import { GameState, GameStage } from '@/types/game';
import ContentUpload from './ContentUpload';

interface GameControlPanelProps {
  gameState: GameState;
  onStartGame: (totalRounds: number) => void;
  onSetContent: (contentId: string) => void;
  onGenerateQuestion: () => void;
  onNextRound: () => void;
  onResetGame: () => void;
}

export default function GameControlPanel({
  gameState,
  onStartGame,
  onSetContent,
  onGenerateQuestion,
  onNextRound,
  onResetGame,
}: GameControlPanelProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [contentInfo, setContentInfo] = useState<{ title: string; questionCount: number } | null>(null);
  const [totalRounds, setTotalRounds] = useState(5);

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

      <div className="absolute top-20 left-4 z-20 border border-gray-700 bg-black bg-opacity-80 p-4 space-y-3 min-w-[200px]">
        <div className="text-white text-xs font-medium mb-2 border-b border-gray-700 pb-2">
          Game Controls
        </div>

        {!gameState.isGameActive ? (
          <div className="space-y-2">
            <button
              onClick={() => setShowUpload(true)}
              className="w-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black transition-colors duration-200 px-4 py-2 text-xs font-medium"
            >
              Upload Content
            </button>

            {contentInfo ? (
              <div className="bg-green-900 bg-opacity-20 border border-green-500 p-2 space-y-1">
                <div className="text-green-500 text-xs font-medium">Content Ready</div>
                <div className="text-gray-300 text-xs truncate" title={contentInfo.title}>
                  {contentInfo.title}
                </div>
                <div className="text-gray-400 text-xs">
                  {contentInfo.questionCount} questions generated
                </div>
              </div>
            ) : gameState.currentContentId ? (
              <div className="bg-blue-900 bg-opacity-20 border border-blue-500 p-2">
                <div className="text-blue-400 text-xs">Custom content loaded</div>
              </div>
            ) : (
              <div className="text-gray-500 text-xs text-center p-2">
                Upload custom content or use default questions
              </div>
            )}

            <div className="space-y-2">
              <label className="text-gray-400 text-xs">Number of Rounds:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={totalRounds}
                onChange={(e) => setTotalRounds(parseInt(e.target.value) || 5)}
                className="w-full bg-black border border-gray-600 text-white px-3 py-2 text-xs focus:border-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleStartGame}
              className="w-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors duration-200 px-4 py-2 text-xs font-medium"
            >
              Start Game & Generate Question
            </button>
          </div>
      ) : (
        <>
          {gameState.stage === GameStage.WAITING && (
            <button
              onClick={onGenerateQuestion}
              className="w-full border border-white text-white hover:bg-white hover:text-black transition-colors duration-200 px-4 py-2 text-xs"
            >
              Generate New Question
            </button>
          )}

          {gameState.stage === GameStage.SCORING && (
            <button
              onClick={onNextRound}
              className="w-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black transition-colors duration-200 px-4 py-2 text-xs"
            >
              Next Round
            </button>
          )}

          {gameState.stage === GameStage.GAME_OVER && (
            <button
              onClick={onResetGame}
              className="w-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors duration-200 px-4 py-2 text-xs font-medium"
            >
              Start New Game
            </button>
          )}

          <div className="text-gray-400 text-xs mt-4">
            <div className="mb-1">Stage: <span className="text-white">{gameState.stage}</span></div>
            <div className="mb-1">Players: <span className="text-white">{gameState.players.size}</span></div>
            {gameState.isGameActive && gameState.currentRound > 0 && (
              <div>Round: <span className="text-white">{gameState.currentRound} / {gameState.totalRounds}</span></div>
            )}
          </div>
        </>
      )}
      </div>
    </>
  );
}


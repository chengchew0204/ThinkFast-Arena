'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Room } from 'livekit-client';
import {
  GameState,
  GameStage,
  GameMessageType,
  GameMessage,
  Question,
  Player,
  BuzzAttempt,
  Answer,
  FollowUpQuestion,
  FinalScore,
} from '@/types/game';

const BUZZ_COLLECTION_WINDOW = 200; // ms

export function useGameState(room: Room | null, identity: string) {
  const [gameState, setGameState] = useState<GameState>({
    stage: GameStage.WAITING,
    currentQuestion: null,
    currentAnswerer: null,
    buzzAttempts: [],
    players: new Map(),
    answer: null,
    followUpQuestions: [],
    followUpAnswers: [],
    finalScore: null,
    countdown: 0,
    isGameActive: false,
    currentContentId: null,
    currentRound: 0,
    totalRounds: 5,
    hostIdentity: null,
  });

  const buzzCollectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const encoder = new TextEncoder();
  const scoreUpdateExecutedRef = useRef<Set<number>>(new Set());
  const processedScoreMessagesRef = useRef<Set<string>>(new Set());
  const isProcessingNextRoundRef = useRef(false);

  // Add player to game state
  const addPlayer = useCallback((playerIdentity: string) => {
    setGameState(prev => {
      if (prev.players.has(playerIdentity)) {
        return prev;
      }
      const newPlayers = new Map(prev.players);
      newPlayers.set(playerIdentity, {
        identity: playerIdentity,
        score: 0,
        isAnswering: false,
        hasAnswered: false,
      });
      console.log(`Player added: ${playerIdentity}, total players: ${newPlayers.size}`);
      return { ...prev, players: newPlayers };
    });
  }, []);

  // Send game message via Data Channel
  const sendGameMessage = useCallback((type: GameMessageType, payload?: any) => {
    if (!room) {
      console.warn('Cannot send game message: room is not initialized');
      return;
    }

    try {
      const message: GameMessage = {
        type,
        timestamp: Date.now(),
        sender: identity,
        payload,
      };

      const data = encoder.encode(JSON.stringify(message));
      
      console.log(`Sending game message: ${type}`, { 
        roomState: room.state,
        numParticipants: room.numParticipants,
        sender: identity 
      });
      
      // Send message via Data Channel
      room.localParticipant.publishData(data, { reliable: true })
        .then(() => {
          console.log(`Game message sent successfully: ${type}`);
        })
        .catch((error) => {
          console.error('Failed to send game message via Data Channel:', error);
          // Don't fail silently - this is important for multiplayer sync
        });
    } catch (error) {
      console.error('Error preparing game message:', error);
    }
  }, [room, identity, encoder]);

  // Start new game
  const startGame = useCallback((totalRounds: number = 5) => {
    sendGameMessage(GameMessageType.START_GAME, { hostIdentity: identity });
    sendGameMessage(GameMessageType.CONFIGURE_ROUNDS, { totalRounds });
    
    // Player is already registered when joining room, no need to add again
    
    setGameState(prev => ({
      ...prev,
      isGameActive: true,
      stage: GameStage.WAITING,
      currentRound: 1,
      totalRounds,
      hostIdentity: identity, // The person who starts the game is the host
    }));
  }, [sendGameMessage, identity]);

  // Set content ID
  const setContent = useCallback((contentId: string) => {
    sendGameMessage(GameMessageType.SET_CONTENT, { contentId });
    setGameState(prev => ({
      ...prev,
      currentContentId: contentId,
    }));
  }, [sendGameMessage]);

  // Generate and broadcast new question
  const generateQuestion = useCallback(async () => {
    console.log('[generateQuestion] Called by:', identity);
    
    try {
      console.log('Generating question with contentId:', gameState.currentContentId);
      const response = await fetch('/api/game/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          difficulty: 'medium',
          contentId: gameState.currentContentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate question`);
      }

      const question: Question = await response.json();
      
      // Try to broadcast, but don't fail if it doesn't work (single player mode)
      sendGameMessage(GameMessageType.NEW_QUESTION, { question });
      
      // Update local state regardless of broadcast success
      setGameState(prev => ({
        ...prev,
        stage: GameStage.QUESTION_DISPLAY,
        currentQuestion: question,
        currentAnswerer: null,
        buzzAttempts: [],
        answer: null,
        followUpQuestions: [],
        followUpAnswers: [],
        finalScore: null, // Clear previous score
        countdown: 10,
      }));

      // Countdown from 10 to 0
      const countdownInterval = setInterval(() => {
        setGameState(prev => {
          const newCountdown = prev.countdown - 1;
          if (newCountdown <= 0) {
            clearInterval(countdownInterval);
            return { ...prev, stage: GameStage.BUZZING, countdown: 0 };
          }
          return { ...prev, countdown: newCountdown };
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to generate question:', error);
      alert(`Failed to generate question: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check:\n1. OPENAI_API_KEY is set in .env.local\n2. Your OpenAI API key is valid and has credits\n3. Check browser console for details`);
    }
  }, [sendGameMessage, gameState.currentContentId, identity]);

  // Player buzzes in
  const buzzIn = useCallback(() => {
    if (gameState.stage !== GameStage.BUZZING) return;

    sendGameMessage(GameMessageType.BUZZ_IN, { timestamp: Date.now() });
    
    setGameState(prev => ({
      ...prev,
      buzzAttempts: [...prev.buzzAttempts, { identity, timestamp: Date.now() }],
    }));

    // Start collection window if not already started
    if (!buzzCollectionTimerRef.current) {
      buzzCollectionTimerRef.current = setTimeout(() => {
        // Determine winner
        setGameState(prev => {
          if (prev.buzzAttempts.length === 0) return prev;

          const winner = prev.buzzAttempts.reduce((min, attempt) => 
            attempt.timestamp < min.timestamp ? attempt : min
          );

          sendGameMessage(GameMessageType.BUZZ_WINNER, { winner: winner.identity });

          // If I'm the winner, I need to enable camera
          // This will be handled in GameUI component to avoid timing issues
          if (winner.identity === identity) {
            console.log('I won the buzz-in, will enable camera in GameUI');
          }

          return {
            ...prev,
            stage: GameStage.ANSWERING,
            currentAnswerer: winner.identity,
            countdown: 90,
          };
        });

        buzzCollectionTimerRef.current = null;
      }, BUZZ_COLLECTION_WINDOW);
    }
  }, [gameState.stage, identity, room, sendGameMessage]);

  // Submit answer
  const submitAnswer = useCallback(async (audioBlob: Blob, transcript: string) => {
    console.log('[submitAnswer] Called by:', identity);
    
    // Prevent double execution with a ref
    const executionId = Date.now();
    console.log('[submitAnswer] Execution ID:', executionId);
    
    const answer: Answer = { transcript, audioBlob };
    
    // Get current question from state
    let currentQuestion: Question | null = null;
    setGameState(prev => {
      currentQuestion = prev.currentQuestion;
      return {
        ...prev,
        answer,
        stage: GameStage.SCORING,
      };
    });

    sendGameMessage(GameMessageType.ANSWER_SUBMITTED, { 
      transcript,
      answerer: identity 
    });

    // Calculate final score immediately without follow-up questions
    try {
      if (!currentQuestion) {
        console.error('[submitAnswer] No current question!');
        return;
      }

      console.log('[submitAnswer] Fetching score...');
      const response = await fetch('/api/game/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.content,
          answer: transcript,
          topicName: currentQuestion.topicName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to calculate score');
      }

      const finalScore = await response.json();
      console.log('[submitAnswer] Score received:', finalScore.totalScore, 'Execution ID:', executionId);
      
      sendGameMessage(GameMessageType.SCORE_READY, { 
        finalScore,
        answerer: identity 
      });

      // Update local player score immediately - SINGLE state update
      console.log('[submitAnswer] Updating score. Execution ID:', executionId);
      setGameState(prev => {
        console.log('[submitAnswer] Inside setGameState. Execution ID:', executionId);
        
        // Prevent double execution due to React Strict Mode
        if (scoreUpdateExecutedRef.current.has(executionId)) {
          console.warn('[submitAnswer] Score already updated for this execution, skipping. Exec:', executionId);
          return { 
            ...prev, 
            stage: GameStage.SCORING,
            finalScore,
          };
        }
        
        // Mark this execution as processed
        scoreUpdateExecutedRef.current.add(executionId);
        
        const newPlayers = new Map(prev.players);
        const player = newPlayers.get(identity);
        if (player) {
          const oldScore = player.score;
          player.score += finalScore.totalScore;
          player.hasAnswered = true;
          player.isAnswering = false;
          console.log(`[LOCAL SCORE UPDATE] ${identity}: ${oldScore} + ${finalScore.totalScore} = ${player.score} (Exec: ${executionId})`);
        } else {
          console.error(`[LOCAL SCORE UPDATE] Player ${identity} not found in players map!`);
        }
        
        // Clean up old execution IDs (keep only last 10)
        if (scoreUpdateExecutedRef.current.size > 10) {
          const entries = Array.from(scoreUpdateExecutedRef.current);
          scoreUpdateExecutedRef.current = new Set(entries.slice(-10));
        }
        
        return { 
          ...prev, 
          stage: GameStage.SCORING,
          finalScore,
          players: newPlayers 
        };
      });
      console.log('[submitAnswer] setGameState completed. Execution ID:', executionId);

    } catch (error) {
      console.error('Failed to calculate final score:', error);
      alert(`Failed to calculate score: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your OpenAI API configuration.`);
    }
  }, [identity, sendGameMessage]);

  // Next round
  const nextRound = useCallback(() => {
    console.log('[nextRound] Called by:', identity);
    
    // Prevent rapid double-clicks
    if (isProcessingNextRoundRef.current) {
      console.warn('[nextRound] Already processing, ignoring duplicate call');
      return;
    }
    
    isProcessingNextRoundRef.current = true;
    
    // Use a local variable to track what to do
    let nextRoundNumber = 0;
    let isGameOver = false;
    
    setGameState(prev => {
      // Only host should call this
      if (prev.hostIdentity && prev.hostIdentity !== identity) {
        console.warn('[nextRound] Non-host tried to call nextRound! Ignoring.');
        return prev;
      }
      
      nextRoundNumber = prev.currentRound + 1;
      console.log('[nextRound] Incrementing round:', prev.currentRound, '→', nextRoundNumber);
      
      if (nextRoundNumber > prev.totalRounds) {
        isGameOver = true;
        return {
          ...prev,
          stage: GameStage.GAME_OVER,
        };
      } else {
        return {
          ...prev,
          currentRound: nextRoundNumber,
          stage: GameStage.WAITING,
        };
      }
    });
    
    // Execute side effects after state update
    setTimeout(() => {
      if (isGameOver) {
        console.log('[nextRound] Game over, sending END_GAME message');
        sendGameMessage(GameMessageType.END_GAME);
      } else {
        console.log('[nextRound] Sending NEXT_ROUND message and generating question');
        sendGameMessage(GameMessageType.NEXT_ROUND);
        generateQuestion();
      }
      isProcessingNextRoundRef.current = false;
    }, 0);
    
    console.log('[nextRound] Completed');
  }, [sendGameMessage, generateQuestion, identity]);

  // Reset game
  const resetGame = useCallback(() => {
    // Clear processed messages when resetting game
    processedScoreMessagesRef.current.clear();
    scoreUpdateExecutedRef.current.clear();
    
    setGameState(prev => ({
      ...prev,
      stage: GameStage.WAITING,
      isGameActive: false,
      currentRound: 0,
      totalRounds: 5,
      currentQuestion: null,
      currentAnswerer: null,
      buzzAttempts: [],
      answer: null,
      followUpQuestions: [],
      followUpAnswers: [],
      finalScore: null,
      countdown: 0,
      hostIdentity: null, // Reset host so anyone can start new game
      players: new Map(Array.from(prev.players.entries()).map(([id, player]) => [
        id,
        { ...player, score: 0, isAnswering: false, hasAnswered: false }
      ])),
    }));
  }, []);

  // Handle incoming game messages
  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array) => {
      try {
        const decoder = new TextDecoder();
        const message: GameMessage = JSON.parse(decoder.decode(payload));

        console.log('[DATA RECEIVED]', {
          type: message.type,
          sender: message.sender,
          myIdentity: identity,
          isFromSelf: message.sender === identity
        });

        // Skip messages from self (already handled locally)
        if (message.sender === identity) {
          console.log('[SKIP] Message from self:', message.type);
          return;
        }

        console.log('[PROCESS] Message from other player:', message.type);

        // Auto-register any player who sends a message
        addPlayer(message.sender);

        switch (message.type) {
          case GameMessageType.START_GAME:
            console.log('Starting game (from remote), sender:', message.sender);
            // Don't set currentRound here if we're the sender, as it's already set in startGame
            if (message.sender === identity) {
              console.log('Skipping START_GAME - I am the sender');
              break;
            }
            setGameState(prev => ({ 
              ...prev, 
              isGameActive: true, 
              currentRound: 1,
              hostIdentity: message.payload?.hostIdentity || message.sender // Set host
            }));
            break;

          case GameMessageType.CONFIGURE_ROUNDS:
            console.log('Received round configuration from host:', message.payload.totalRounds);
            setGameState(prev => ({ 
              ...prev, 
              totalRounds: message.payload.totalRounds 
            }));
            break;

          case GameMessageType.END_GAME:
            console.log('Game over received from host, sender:', message.sender);
            // Skip if I'm the one who ended the game (already updated locally)
            if (message.sender === identity) {
              console.log('Skipping END_GAME - I am the sender');
              break;
            }
            setGameState(prev => ({ 
              ...prev, 
              stage: GameStage.GAME_OVER 
            }));
            break;

          case GameMessageType.SET_CONTENT:
            console.log('Received content ID from host:', message.payload.contentId);
            setGameState(prev => ({ 
              ...prev, 
              currentContentId: message.payload.contentId 
            }));
            break;

          case GameMessageType.NEW_QUESTION:
            console.log('Received new question from remote, sender:', message.sender);
            
            // Skip if I'm the one who sent the question (already updated locally)
            if (message.sender === identity) {
              console.log('Skipping NEW_QUESTION - I am the sender');
              break;
            }
            
            setGameState(prev => ({
              ...prev,
              stage: GameStage.QUESTION_DISPLAY,
              currentQuestion: message.payload.question,
              currentAnswerer: null,
              buzzAttempts: [],
              answer: null,
              followUpQuestions: [],
              followUpAnswers: [],
              finalScore: null, // Clear previous score
              countdown: 10,
            }));
            
            // Countdown from 10 to 0
            const remoteCountdownInterval = setInterval(() => {
              setGameState(prev => {
                const newCountdown = prev.countdown - 1;
                if (newCountdown <= 0) {
                  clearInterval(remoteCountdownInterval);
                  return { ...prev, stage: GameStage.BUZZING, countdown: 0 };
                }
                return { ...prev, countdown: newCountdown };
              });
            }, 1000);
            break;

          case GameMessageType.BUZZ_IN:
            setGameState(prev => ({
              ...prev,
              buzzAttempts: [...prev.buzzAttempts, {
                identity: message.sender,
                timestamp: message.payload.timestamp,
              }],
            }));
            break;

          case GameMessageType.BUZZ_WINNER:
            console.log('Received BUZZ_WINNER:', message.payload.winner);
            
            setGameState(prev => ({
              ...prev,
              stage: GameStage.ANSWERING,
              currentAnswerer: message.payload.winner,
              countdown: 90,
            }));
            break;

          case GameMessageType.ANSWER_SUBMITTED:
            setGameState(prev => ({
              ...prev,
              stage: GameStage.SCORING,
              answer: { transcript: message.payload.transcript },
            }));
            break;

          case GameMessageType.SCORE_READY:
            console.log('[SCORE_READY] Received:', {
              answerer: message.payload.answerer,
              score: message.payload.finalScore?.totalScore,
              sender: message.sender,
              myIdentity: identity,
              amIAnswerer: message.payload.answerer === identity,
              timestamp: message.timestamp
            });
            
            // If I'm the answerer, I already updated my score locally, so skip
            if (message.payload.answerer === identity) {
              console.log('[SCORE_READY] Skipping score update - I am the answerer and already updated locally');
              setGameState(prev => ({
                ...prev,
                stage: GameStage.SCORING,
                finalScore: message.payload.finalScore,
              }));
              break;
            }
            
            // For other players, update the answerer's score
            // Deduplication happens INSIDE the state updater to handle React Strict Mode
            console.log('[SCORE_READY] Updating answerer score (I am NOT the answerer)');
            setGameState(prev => {
              // Create unique message ID for deduplication
              const scoreMessageId = `${message.payload.answerer}-${message.timestamp}`;
              
              // Check if we've already processed this score update
              if (processedScoreMessagesRef.current.has(scoreMessageId)) {
                console.warn('[SCORE_READY] Duplicate execution detected (React Strict Mode), skipping:', scoreMessageId);
                return {
                  ...prev,
                  stage: GameStage.SCORING,
                  finalScore: message.payload.finalScore,
                };
              }
              
              // Mark this message as processed
              processedScoreMessagesRef.current.add(scoreMessageId);
              
              // Clean up old message IDs (keep only last 50)
              if (processedScoreMessagesRef.current.size > 50) {
                const entries = Array.from(processedScoreMessagesRef.current);
                processedScoreMessagesRef.current = new Set(entries.slice(-50));
              }
              
              const newPlayers = new Map(prev.players);
              const answerer = newPlayers.get(message.payload.answerer);
              if (answerer && message.payload.finalScore) {
                const oldScore = answerer.score;
                answerer.score += message.payload.finalScore.totalScore;
                answerer.hasAnswered = true;
                answerer.isAnswering = false;
                console.log(`[REMOTE SCORE UPDATE] ${message.payload.answerer}: ${oldScore} + ${message.payload.finalScore.totalScore} = ${answerer.score}`);
              } else {
                console.error(`[REMOTE SCORE UPDATE] Answerer ${message.payload.answerer} not found!`);
              }
              
              return {
                ...prev,
                stage: GameStage.SCORING,
                finalScore: message.payload.finalScore,
                players: newPlayers,
              };
            });
            break;

          case GameMessageType.NEXT_ROUND:
            console.log('Received NEXT_ROUND from remote, sender:', message.sender);
            
            // Skip if this is from me (I already incremented locally)
            // This is a backup check in case the main check at line 347 doesn't work
            if (message.sender === identity) {
              console.log('Skipping NEXT_ROUND - I am the sender and already incremented locally');
              break;
            }
            
            setGameState(prev => {
              const nextRoundNumber = prev.currentRound + 1;
              console.log('Incrementing round from', prev.currentRound, 'to', nextRoundNumber);
              return {
                ...prev,
                currentRound: nextRoundNumber,
                stage: GameStage.WAITING,
              };
            });
            break;
        }
      } catch (error) {
        console.error('Failed to parse game message:', error);
      }
    };

    room.on('dataReceived', handleData);

    return () => {
      room.off('dataReceived', handleData);
    };
  }, [room, identity]);

  return {
    gameState,
    startGame,
    setContent,
    generateQuestion,
    buzzIn,
    submitAnswer,
    nextRound,
    resetGame,
    addPlayer,
  };
}


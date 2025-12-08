# ThinkFast Arena  

A real-time multiplayer AI-powered quiz game platform with private room support, built to demonstrate full-stack development capabilities with WebRTC, real-time communication, and AI integration.

## Overview

ThinkFast Arena is a web-based multiplayer quiz game where players compete in private rooms to answer AI-generated questions through voice responses. The platform leverages OpenAI's GPT-4 and Whisper APIs to generate questions, transcribe spoken answers, and provide multi-dimensional evaluations. Players can create or join rooms using unique 6-character codes, with a host-based control system for game management. The platform uses WebRTC for low-latency video/audio communication and real-time game state synchronization.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [What's New in v5](#whats-new-in-v5)
- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [Technical Highlights](#technical-highlights)
- [Setup Instructions](#setup-instructions)
- [Game Concept](#game-concept)
- [Project Structure](#project-structure)
- [Room System](#room-system)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd ThinkFastArena-v5

# 2. Install dependencies
npm install

# 3. Create .env.local with your API keys
cat > .env.local << EOF
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-your_openai_key
EOF

# 4. Run the development server
npm run dev

# 5. Open http://localhost:3000
# - Create a room or join with a code
# - Grant camera and microphone permissions
# - Start playing!
```

**Prerequisites:** Node.js 18+, LiveKit Cloud account, OpenAI API key with GPT-4 and Whisper access

## Tech Stack

### Frontend
- **Next.js 14.2** - React framework with App Router
- **React 18** - UI component library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3.3** - Utility-first styling
- **LiveKit Components React 2.0** - Pre-built WebRTC UI components
- **LiveKit Client 2.0** - WebRTC client SDK

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **LiveKit Server SDK 2.0** - WebRTC signaling and room management
- **OpenAI API 6.3** - GPT-4 for question generation and evaluation, Whisper for speech-to-text
- **Cheerio 1.1** - HTML parsing for URL content processing

### Real-time Communication
- **LiveKit Cloud** - Managed WebRTC infrastructure (SFU architecture)
- **WebRTC** - Media streaming and data channels
- **LiveKit Data Channels** - Real-time game state synchronization

### Deployment & Build
- **Netlify** - Serverless hosting and continuous deployment
- **@netlify/plugin-nextjs** - Next.js optimization for Netlify
- **Node.js 20** - Runtime environment
- **esbuild** - Function bundler

## Key Features

### Room-Based Multiplayer System
- Private rooms with unique 6-character codes
- Create or join rooms with a simple code-sharing system
- Host/Player role management for game control
- Persistent user identity across sessions
- Sub-second latency video/audio streaming using WebRTC SFU architecture
- Real-time game state synchronization across all players via LiveKit Data Channels
- Support for multiple concurrent players

### AI-Powered Quiz Game
- GPT-4 generated open-ended questions across multiple knowledge domains
- Voice-based answer submission with Whisper speech-to-text transcription (90 seconds)
- Real-time AI evaluation with comprehensive feedback
- Multi-dimensional scoring system (100 points max per question):
  - Concept Accuracy: 30 points
  - Structural Coherence: 25 points
  - Practical Examples: 25 points
  - Response Quality: 20 points
- Buzzer system with race condition handling (200ms collection window)
- Configurable game rounds (1-20 rounds)

### Content Upload & Customization
- Custom content ingestion: text paste (500+ characters) or URL
- Automated question generation from uploaded content (5-30 questions)
- Content analysis and processing pipeline with Cheerio web scraping
- Default question database when no custom content is provided
- Host-controlled content selection

## What's New in v5

### Room-Based System
- Private rooms with 6-character codes for organized multiplayer sessions
- Host/Player role system for better game control
- Room code sharing with copy functionality

### Enhanced Game Control
- Configurable rounds (1-20)
- Host-controlled game flow (generate questions, next round, reset)
- Instructions page with comprehensive game guide

### Improved State Management
- Deduplication logic for React Strict Mode compatibility
- Ref-based execution tracking to prevent double-scoring
- Enhanced message handling with sender verification

### Content Customization
- Text paste support (500+ characters)
- URL content fetching and processing
- Configurable question count (5-30)

### User Experience
- Persistent user identity across sessions
- Cleaner UI with modern gradients and styling
- Better error handling and user feedback

## System Architecture

### WebRTC Infrastructure
The platform uses LiveKit's SFU (Selective Forwarding Unit) architecture for efficient real-time streaming:
- Participants connect to a central SFU server (LiveKit Cloud)
- Video/audio tracks are selectively forwarded to subscribers
- Data channels handle game state synchronization using custom message protocol
- JWT-based authentication for secure room access
- Room naming pattern: `arena-{ROOMCODE}` for private sessions

### API Design

All API routes are serverless Next.js API routes deployed on Netlify.

#### Authentication & Access
- `POST /api/token` - Generate LiveKit JWT tokens with room access permissions

#### Game Logic
- `POST /api/game/generate-question` - Generate questions from database or custom content
- `POST /api/game/transcribe` - Convert audio to text using Whisper API
- `POST /api/game/final-score` - Calculate comprehensive scores across 4 dimensions
- `GET /api/game/check-config` - Verify OpenAI and LiveKit API configuration

#### Content Processing
- `POST /api/content/process` - Fetch and parse web content from URLs using Cheerio
- `POST /api/content/analyze` - Generate custom questions from uploaded content using GPT-4
- `GET /api/content/debug` - Debug endpoint for content processing

#### Health Check
- `GET /api/health` - API health check endpoint

## Technical Highlights

### Real-time State Management
- Client-side game state synchronized via LiveKit Data Channels
- Custom React hooks (`useGameState`) for managing complex game flow
- Message deduplication to handle React Strict Mode double-execution
- Ref-based execution tracking prevents double-scoring
- Host identity management for authorization

### Audio Pipeline
- Browser MediaRecorder API for audio capture
- Binary blob transmission to backend API
- OpenAI Whisper API for high-accuracy transcription
- Average transcription time: 2-3 seconds
- 90-second recording window with real-time countdown

### Race Condition Handling
- 200ms buzzer collection window to handle network latency
- Timestamp-based priority for simultaneous buzz-ins
- Client-authoritative game state with P2P synchronization
- Message sender verification to prevent self-processing

### Video Track Management
- Dynamic camera enable/disable based on answering state
- Automatic video element attachment and cleanup
- WebRTC track lifecycle management via LiveKit client
- Video feed only active during answering stage

### Room Management
- Unique 6-character room codes for private sessions
- LiveKit room naming pattern: `arena-{ROOMCODE}`
- Persistent user identity in localStorage
- Automatic participant registration via data messages

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- LiveKit Cloud account (or self-hosted LiveKit server)
- OpenAI API key with GPT-4 and Whisper access

### Environment Variables
Create a `.env.local` file in the root directory:

```bash
# LiveKit Configuration (get from LiveKit Cloud dashboard)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# OpenAI Configuration (requires GPT-4 and Whisper API access)
OPENAI_API_KEY=sk-your_openai_key

# Optional: For client-side (make sure it's in NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

**Important Notes:**
- LiveKit URL must start with `wss://`
- OpenAI API key must have access to GPT-4 and Whisper models
- Environment variables are loaded from `.env.local` in development
- In production (Netlify), set these in the dashboard under Site Settings > Environment Variables

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

### Testing & Usage

```bash
# Development (http://localhost:3000)
npm run dev

# Access the application
# - Main page: http://localhost:3000
# - Instructions: http://localhost:3000/instructions
# - Test devices: http://localhost:3000/test-media
```

**Important Pages:**
- `/` - Landing page for room creation/joining
- `/instructions` - Comprehensive game instructions and rules
- `/test-media` - Camera and microphone testing utility

## Game Concept

### The Arena
ThinkFast Arena creates a competitive environment where players engage in real-time knowledge battles within private rooms. The platform emphasizes quick thinking, deep knowledge, and articulate communication as key determinants of success. This mechanic fosters attention, critical thinking, and collaborative learning in a fast-paced digital space.

### Quiz Game Flow
The quiz game provides a structured knowledge competition with 7 distinct stages per round:

1. **WAITING** - Host prepares to generate a new question
2. **QUESTION_DISPLAY** - Question appears with 10-second countdown for reading
3. **BUZZING** - Players compete to buzz in (200ms collection window for fairness)
4. **ANSWERING** - Winner records a 90-second voice answer with video enabled
5. **SCORING** - AI transcribes speech and evaluates across 4 dimensions
6. **Next Round** - Host proceeds to next round or ends game
7. **GAME_OVER** - Final leaderboard displays with rankings

### Host-Player System
- **Host**: Player who starts the game, controls game flow (generate questions, next round)
- **Players**: All participants (including host) can buzz in and answer questions
- Game state synchronized in real-time across all participants via WebRTC data channels

The game demonstrates advanced full-stack integration: room-based multiplayer, real-time communication, AI processing, audio/video handling, and complex state management all working in harmony.

## Project Structure

```
src/
├── app/
│   ├── api/                      # Next.js API routes (serverless functions)
│   │   ├── token/                # LiveKit JWT generation
│   │   ├── game/                 # Quiz game endpoints
│   │   │   ├── generate-question/
│   │   │   ├── transcribe/
│   │   │   ├── final-score/
│   │   │   └── check-config/
│   │   ├── content/              # Content processing
│   │   │   ├── process/          # URL fetching and parsing
│   │   │   ├── analyze/          # Question generation
│   │   │   └── debug/            # Debug endpoint
│   │   └── health/               # Health check
│   ├── page.tsx                  # Main landing page (room creation/joining)
│   ├── instructions/             # Game instructions page
│   │   └── page.tsx
│   ├── test-media/               # Device testing page
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── LiveKitRoom.tsx           # Main WebRTC room component
│   ├── GameUI.tsx                # Quiz game interface and stage rendering
│   ├── GameControlPanel.tsx      # Host controls and game info display
│   ├── AudioRecorder.tsx         # Voice recording with MediaRecorder API
│   └── ContentUpload.tsx         # Content ingestion modal
├── hooks/                        # Custom React hooks
│   └── useGameState.ts           # Game state management with WebRTC sync
├── types/                        # TypeScript definitions
│   ├── game.ts                   # Game types, stages, and messages
│   └── content.ts                # Content processing types
├── utils/                        # Helper functions
│   └── contentStore.ts           # In-memory content storage
└── data/                         # Static data
    └── questions-database.json   # Default question database
```

## Room System

### Creating a Room
1. Click "Create Room" on the landing page
2. Receive a unique 6-character alphanumeric code (e.g., "A3X9K2")
3. Share the code with other players
4. You become the host with control over game flow

### Joining a Room
1. Click "Join Existing Room"
2. Enter the 6-character code
3. Join as a player (can participate but cannot control game flow)

### Room Features
- Room code displayed at top-left with copy functionality
- Leave room button to return to landing page
- Automatic participant registration when joining
- Room persists as long as at least one participant remains connected

## Game Instructions

For detailed game instructions, player roles, game flow, scoring system, and tips for success, visit:
- **In-app**: Navigate to `/instructions`
- **Documentation**: See `Instruction.md` in the repository root

## Deployment

The application is configured for deployment on Netlify:
- `netlify.toml` - Deployment configuration with Next.js plugin
- Environment variables configured in Netlify dashboard
- Serverless functions for all API routes
- Static asset optimization and caching

## Development Features

### State Management
- Custom `useGameState` hook manages complex game flow
- WebRTC Data Channels for real-time state synchronization
- Deduplication logic to prevent double-scoring in React Strict Mode
- Ref-based execution tracking for idempotent operations

### Audio Pipeline
- Browser MediaRecorder API for audio capture
- Blob transmission to backend
- OpenAI Whisper API for transcription (average 2-3 seconds)

### Video Management
- Dynamic camera enable/disable based on answering state
- Automatic video element attachment and cleanup
- WebRTC track lifecycle management via LiveKit

## Troubleshooting

### Common Issues

#### Camera/Microphone Not Working
- Ensure browser permissions are granted for camera and microphone
- Visit `/test-media` to verify device access
- Check that devices are not in use by other applications
- Try using HTTPS (required for WebRTC in production)

#### Question Generation Fails
- Verify `OPENAI_API_KEY` is set correctly in `.env.local`
- Ensure your OpenAI account has credits
- Check that your API key has access to GPT-4 model
- Review browser console and server logs for detailed error messages

#### Transcription Fails
- Ensure your OpenAI API key has access to Whisper API
- Check that audio recording is working (browser console for errors)
- Verify audio blob is being created and transmitted

#### Room Connection Issues
- Verify `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` are correct
- Check LiveKit Cloud dashboard for connection status
- Ensure room code matches exactly (case-sensitive, 6 characters)
- Try refreshing the page and rejoining

#### Score Updates Not Syncing
- Check browser console for data channel errors
- Ensure all players are in the same room
- Verify network connection is stable
- React Strict Mode may cause double-logs in development, but scoring logic has deduplication

#### Content Upload Not Working
- For text: Ensure at least 500 characters
- For URL: Verify the URL is accessible and returns HTML
- Check browser console for processing errors
- Try with a different URL or text content

### Debug Endpoints

- `GET /api/health` - Check API health
- `GET /api/game/check-config` - Verify OpenAI and LiveKit configuration
- `GET /api/content/debug` - Debug content processing

### Getting Help

If you encounter issues not covered here:
1. Check browser console for client-side errors
2. Check Netlify function logs for server-side errors
3. Review the `Instruction.md` file for game flow details
4. Verify all environment variables are set correctly

## License

This project is a portfolio demonstration of full-stack development capabilities.

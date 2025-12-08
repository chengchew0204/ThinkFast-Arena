# ThinkFast Arena - Game Instructions

## Overview

ThinkFast Arena is a real-time multiplayer AI-powered quiz game where players compete to answer open-ended questions through voice responses. The game uses OpenAI's GPT-4 to generate questions and evaluate answers, and Whisper API for speech-to-text transcription. Players compete in a buzzer-style format, with AI providing comprehensive scoring based on multiple dimensions.

## Getting Started

### Creating or Joining a Room

1. **Create a New Room**
   - Click "Create Room" on the landing page
   - You will receive a unique 6-character room code
   - Share this code with other players who want to join
   - You become the **Host** of this room

2. **Join an Existing Room**
   - Click "Join Existing Room"
   - Enter the 6-character room code shared by the host
   - Click "Join Room"
   - You will join as a **Player** (non-host)

3. **Test Your Devices**
   - Before playing, click "Test Camera & Microphone" to ensure your devices work properly
   - The game requires both microphone access (for answering) and camera access (for video display during answers)

## Game Setup

Once inside a room, the **Host** has access to game controls:

### Host Controls

1. **Upload Custom Content (Optional)**
   - Click "Upload Content" to add your own learning material
   - You can either:
     - **Paste Text**: Provide at least 500 characters of text content
     - **Enter URL**: Provide a URL to an article or webpage
   - Choose how many questions to generate (5-30, default is 15)
   - The AI will process your content and generate questions from it
   - If you don't upload content, the game will use default questions from a pre-defined database

2. **Configure Rounds**
   - Set the number of rounds (1-20, default is 5)
   - Each round consists of one question

3. **Start the Game**
   - Click "Start Game & Generate Question"
   - This begins the game and automatically generates the first question
   - You are now designated as the **Host** for this game session

### Player Roles

- **Host**: The player who starts the game
  - Controls game flow (generate questions, next round, reset game)
  - Can participate as a player and answer questions
  - Appears as "Game Controls (Host)" in the control panel

- **Other Players**: Everyone else in the room
  - Can see game info but cannot control the game flow
  - Appears as "Game Info (Spectator)" in the control panel
  - Can fully participate by buzzing in and answering questions

## Game Flow

The game progresses through several stages for each round:

### Stage 1: WAITING
- The game is waiting for the host to generate a new question
- Players can see the current round number and total rounds
- **Host Action**: Click "Generate New Question" to proceed

### Stage 2: QUESTION DISPLAY
- A question appears on screen with its topic
- A countdown timer displays (10 seconds)
- Players should read and think about the question
- When the countdown reaches 0, the buzzer becomes active
- **All Players**: Read and prepare your answer

### Stage 3: BUZZING
- The "BUZZ IN" button appears for all players
- First player to buzz in gets to answer
- The system collects buzz attempts for 200ms to handle network latency
- The player with the earliest timestamp wins
- **All Players**: Click "BUZZ IN" if you know the answer

### Stage 4: ANSWERING
- The winner's video feed appears on screen
- The winner has 90 seconds to record their voice answer
- Camera automatically enables for the answering player
- Audio recording starts automatically
- Other players watch the answering player's video feed
- **Answering Player**: Speak your answer clearly for up to 90 seconds
- **Other Players**: Watch and listen to the answer

### Stage 5: SCORING
- The AI transcribes the audio using Whisper API
- GPT-4 evaluates the answer across multiple dimensions:
  - **Concept Accuracy**: Correctness of core concepts (0-30 points)
  - **Structural Coherence**: Logical organization and clarity (0-25 points)
  - **Practical Examples**: Use of real-world examples (0-25 points)
  - **Response Quality**: Overall communication effectiveness (0-20 points)
- Total possible score per question: **100 points**
- The score is added to the answering player's total score
- Detailed feedback is provided for each dimension
- **All Players**: View the scoring results and feedback

### Stage 6: NEXT ROUND or GAME OVER
- After scoring, the host can proceed to the next round
- **Host Action**: Click "Next Round" to generate the next question
- If all rounds are complete, the game enters GAME OVER stage

### Stage 7: GAME OVER
- Final leaderboard displays all players ranked by total score
- Players are ranked from 1st to last place
- Your position is highlighted
- **Host Action**: Click "Start New Game" to reset and play again

## Scoring System

### AI Evaluation Dimensions

The AI evaluates each answer across four key dimensions:

1. **Concept Accuracy (30 points max)**
   - Correctness of the core concepts
   - Factual accuracy
   - Depth of understanding

2. **Structural Coherence (25 points max)**
   - Logical organization of ideas
   - Clear structure and flow
   - Coherent presentation

3. **Practical Examples (25 points max)**
   - Use of real-world examples
   - Relevance of examples to the topic
   - Quality of illustrations

4. **Response Quality (20 points max)**
   - Overall communication effectiveness
   - Clarity and articulation
   - Engagement and presentation

### Scoring Process

1. Your voice answer is recorded (up to 90 seconds)
2. Whisper API transcribes your speech to text
3. GPT-4 evaluates the transcript against the question
4. Scores are calculated for each dimension
5. Total score (0-100) is added to your cumulative score
6. Detailed feedback is provided for improvement

## Key Features

### Real-time Synchronization
- All players see the same game state simultaneously
- Buzzer system handles network latency with a 200ms collection window
- Game state is synchronized via WebRTC data channels

### Video & Audio
- Camera automatically enables only when you're answering
- Video feed is shared with other players during your answer
- Audio is recorded locally and processed by the server
- Camera automatically disables after answering

### Custom Content
- Upload your own learning materials (articles, study notes, etc.)
- AI generates questions specifically from your content
- Minimum 500 characters required for text upload
- URL content is automatically fetched and processed

### Fair Buzzer System
- Race condition handling with 200ms collection window
- Timestamp-based priority for simultaneous buzzes
- Network latency compensation

## Tips for Success

1. **Read Carefully**: Use the 10-second question display time to fully understand the question

2. **Buzz Strategically**: Only buzz in if you have a solid answer - partial credit is better than no answer

3. **Structure Your Answer**: Organize your thoughts before speaking
   - Start with the core concept
   - Provide supporting details
   - Use examples to illustrate
   - Conclude clearly

4. **Speak Clearly**: The Whisper API is highly accurate, but clear speech helps
   - Speak at a moderate pace
   - Enunciate clearly
   - Avoid long pauses

5. **Use Examples**: Practical examples significantly boost your score
   - Real-world applications
   - Specific cases or scenarios
   - Relevant analogies

6. **Time Management**: You have 90 seconds - use them wisely
   - Don't rush through in 20 seconds
   - Don't ramble to fill time
   - Aim for comprehensive but concise answers

7. **Practice Active Learning**: Use custom content feature to study specific topics
   - Upload your study materials
   - Generate questions from your coursework
   - Learn while playing

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection (for WebRTC streaming)
- Working microphone (for voice answers)
- Working camera (for video during answering)
- Microphone and camera permissions must be granted


## Game Philosophy

ThinkFast Arena is designed to:
- Encourage deep knowledge and critical thinking
- Foster articulate communication skills
- Create competitive yet educational experiences
- Demonstrate the power of AI in education and assessment
- Provide real-time collaborative learning experiences

The name "ThinkFast Arena" emphasizes quick thinking and competitive knowledge battles in a real-time environment.

---

**Ready to Play?** Create or join a room and start your knowledge battle in ThinkFast Arena!

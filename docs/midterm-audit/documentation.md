# Explain Arena: Midterm Project Audit
**Academic Course Project - Fall 2025**  
**Student**: Zack Wu  
**Audit Date**: October 27, 2025  
**Project Deadline**: December 1, 2025 (5 weeks remaining)

---

## I. Executive Summary

### Project Overview
**Explain Arena** is an AI-powered multiplayer educational platform designed to help users improve their ability to articulate ideas, organize thinking, and deepen understanding through competitive dialectical questioning. The platform combines real-time multiplayer game mechanics with sophisticated AI evaluation to create an engaging learning experience.

### Core Value Proposition
Users upload their own learning materials (documents, links, or text) and the AI generates personalized questions based on that content. Through a competitive game format, users practice explaining concepts under time pressure, receive intelligent follow-up questions that expose gaps in understanding, and get multi-dimensional feedback on their articulation quality.

### Current Status Snapshot
- **Overall Completion**: ~55% (11 of 20 major components)
- **Infrastructure**: 90% complete (multiplayer, AI integration, real-time sync)
- **Game Mechanics**: 85% complete (7-phase flow fully functional)
- **Content System**: 0% complete (**CRITICAL GAP - core feature not yet implemented**)
- **Days Until Deadline**: 35 days

### Critical Milestone
**December 1, 2025** - Final submission deadline requiring:
1. Custom content upload system (files, URLs, text)
2. AI content processing pipeline
3. Dynamic question generation from user content
4. Complete integration with existing game mechanics
5. User documentation and testing

### Key Risk
The **custom content upload and processing system** - the fundamental feature that defines this project - is not yet implemented. With 5 weeks remaining, this represents the highest priority and greatest technical challenge.

---

## II. Project Vision & Final Goals

### A. Educational Mission

**Primary Objective**: Create a tool that helps learners move from passive content consumption to active articulation and defense of their understanding.

**Pedagogical Philosophy**:
- **Practice Over Memorization**: Understanding is tested through articulation, not recall
- **Dialectical Learning**: AI follow-up questions expose gaps and contradictions
- **Competitive Engagement**: Game mechanics increase motivation and focus
- **Immediate Feedback**: Multi-dimensional scoring guides improvement

### B. Final Vision

**User Experience Flow**:
```
1. User uploads learning material
   ├─ PDF document (textbook chapter, research paper)
   ├─ URL (article, blog post, Wikipedia page)
   └─ Direct text paste (lecture notes, study guide)
   
2. AI processes content
   ├─ Extracts key concepts and relationships
   ├─ Identifies answerable questions
   └─ Generates scenario-based prompts
   
3. Multiplayer game session
   ├─ 2-8 players join room
   ├─ AI presents question from uploaded content
   ├─ Players compete to answer (buzz-in)
   ├─ Winner articulates response (90 seconds)
   ├─ AI challenges with follow-up (30 seconds)
   └─ Multi-dimensional scoring (100 points)
   
4. Learning outcomes
   ├─ Identify knowledge gaps
   ├─ Practice clear articulation
   ├─ Receive structured feedback
   └─ Track improvement over time
```

### C. Target Audience

**Primary Users**:
- **University Students**: Preparing for exams, mastering complex material
- **Study Groups**: Collaborative learning sessions
- **Self-Learners**: Testing understanding of online courses, books, articles
- **Educators**: Assessing student comprehension in seminars

**Use Cases**:
- Pre-exam study sessions with custom course material
- Discussion preparation for seminars
- Self-assessment for online learning
- Team-based knowledge validation

### D. Core Differentiators

**What Makes This Unique**:
1. **User Content Focus**: Questions generated from YOUR materials, not pre-defined topics
2. **Real-Time Multiplayer**: Compete with peers for engagement
3. **AI Dialectical Challenge**: Not just scoring, but intelligent follow-up questioning
4. **Articulation Practice**: Voice-based responses, not multiple choice
5. **Multi-Dimensional Feedback**: Evaluate concept accuracy, structure, examples, and clarity

### E. Success Metrics

**By December 1, the platform should**:
- Accept and process at least 3 content formats (text, URL, PDF)
- Generate contextually relevant questions from user content
- Support 2-8 simultaneous players with stable synchronization
- Provide meaningful AI evaluation and follow-up questions
- Complete a full game session (5 rounds) in under 30 minutes
- Handle errors gracefully with clear user feedback

---

## III. Technical Architecture

### A. Technology Stack

**Frontend Framework**:
- **Next.js 14**: React-based framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling for responsive UI

**Real-Time Infrastructure**:
- **LiveKit Client SDK**: WebRTC-based audio/video communication
- **LiveKit Data Channel**: Real-time game state synchronization
- **LiveKit Server SDK**: Token generation and room management

**AI Services**:
- **OpenAI GPT-4o-mini**: Question generation, content analysis, evaluation, scoring
- **OpenAI Whisper API**: Speech-to-text transcription

**Deployment**:
- **Netlify/Vercel**: Serverless hosting
- **Edge Functions**: Low-latency API routes

### B. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Browser (React/Next.js)                                     │
│  ├─ GameUI Component (main orchestration)                   │
│  ├─ AudioRecorder Component (voice capture)                 │
│  ├─ GameControlPanel Component (host controls)              │
│  └─ LiveKitRoom Component (WebRTC connection)               │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    REAL-TIME LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  LiveKit Cloud                                               │
│  ├─ WebRTC Media Streams (audio/video)                      │
│  ├─ Data Channel (game state sync)                          │
│  └─ Room Management                                          │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  /api/token              → Generate LiveKit access tokens    │
│  /api/game/check-config  → Validate OpenAI API key          │
│  /api/game/generate-question → Generate questions [AI]      │
│  /api/game/transcribe    → Speech-to-text [AI]              │
│  /api/game/evaluate-answer → Analyze & follow-up [AI]       │
│  /api/game/final-score   → Multi-dimensional scoring [AI]   │
│                                                              │
│  [TO BE BUILT]                                               │
│  /api/content/upload     → Handle file uploads              │
│  /api/content/process    → Extract and parse content        │
│  /api/content/analyze    → AI content analysis              │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  OpenAI API                                                  │
│  ├─ GPT-4o-mini (text generation, analysis)                 │
│  └─ Whisper (speech transcription)                          │
└─────────────────────────────────────────────────────────────┘
```

### C. File Structure

```
ArenaOfConsciousness-v5/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── game/
│   │   │   │   ├── check-config/route.ts    [✅ Complete]
│   │   │   │   ├── generate-question/route.ts [✅ Complete]
│   │   │   │   ├── transcribe/route.ts      [✅ Complete]
│   │   │   │   ├── evaluate-answer/route.ts [✅ Complete]
│   │   │   │   └── final-score/route.ts     [✅ Complete]
│   │   │   ├── content/                     [❌ NOT BUILT]
│   │   │   │   ├── upload/route.ts          [❌ Missing]
│   │   │   │   ├── process/route.ts         [❌ Missing]
│   │   │   │   └── analyze/route.ts         [❌ Missing]
│   │   │   ├── token/route.ts               [✅ Complete]
│   │   │   └── takeover/route.ts            [✅ Complete]
│   │   ├── globals.css                      [✅ Complete]
│   │   ├── layout.tsx                       [✅ Complete]
│   │   └── page.tsx                         [✅ Complete]
│   ├── components/
│   │   ├── AudioRecorder.tsx                [✅ Complete]
│   │   ├── GameControlPanel.tsx             [✅ Complete]
│   │   ├── GameUI.tsx                       [✅ Complete]
│   │   ├── LiveKitRoom.tsx                  [✅ Complete]
│   │   └── ContentUpload.tsx                [❌ NOT BUILT]
│   ├── data/
│   │   ├── questions-database.json          [✅ Temporary]
│   │   └── user-content/                    [❌ NOT BUILT]
│   ├── hooks/
│   │   ├── useGameState.ts                  [✅ Complete]
│   │   └── useContentUpload.ts              [❌ NOT BUILT]
│   ├── types/
│   │   ├── game.ts                          [✅ Complete]
│   │   └── content.ts                       [❌ NOT BUILT]
│   └── utils/
│       ├── contentParser.ts                 [❌ NOT BUILT]
│       └── questionGenerator.ts             [❌ NOT BUILT]
├── docs/                                    [✅ Complete]
├── package.json                             [✅ Complete]
└── README.md                                [✅ Complete]
```

### D. Key Components

#### 1. GameUI Component (`src/components/GameUI.tsx`)
**Status**: ✅ Complete  
**Responsibilities**:
- Orchestrates 7-phase game flow
- Renders stage-specific UI (countdown, buzzing, answering, scoring)
- Manages video display for answerers
- Handles audio recording lifecycle
- Displays AI-generated questions and follow-ups

#### 2. useGameState Hook (`src/hooks/useGameState.ts`)
**Status**: ✅ Complete  
**Responsibilities**:
- Manages complex game state machine
- Synchronizes state across all players via Data Channel
- Handles buzz-in fairness (200ms collection window)
- Triggers API calls for AI operations
- Maintains player scores and game progression

#### 3. AudioRecorder Component (`src/components/AudioRecorder.tsx`)
**Status**: ✅ Complete  
**Responsibilities**:
- Captures microphone audio with MediaRecorder API
- Auto-detects compatible audio format (webm/mp4/ogg)
- Provides visual feedback (countdown timer)
- Handles recording errors gracefully
- Supports both 90-second and 30-second recordings

#### 4. API Routes
**Status**: ✅ 6/9 Complete, ❌ 3/9 Missing

**Completed**:
- `/api/game/generate-question`: Generates questions from fixed database
- `/api/game/transcribe`: Converts audio to text via Whisper
- `/api/game/evaluate-answer`: Analyzes answer and generates follow-up
- `/api/game/final-score`: Provides 4-dimensional scoring
- `/api/token`: Generates LiveKit access tokens
- `/api/game/check-config`: Validates API configuration

**Missing (Critical)**:
- `/api/content/upload`: Handle file uploads
- `/api/content/process`: Extract text from files/URLs
- `/api/content/analyze`: AI analysis to generate question pool

---

## IV. Current Implementation Status

### A. Completion Matrix

| Component Category        | Status | Completion | Priority |
|---------------------------|--------|------------|----------|
| Multiplayer Infrastructure| ✅ Done | 100%      | High     |
| Real-Time Synchronization | ✅ Done | 100%      | High     |
| Game Flow (7 Phases)      | ✅ Done | 100%      | High     |
| Audio Recording           | ✅ Done | 100%      | High     |
| Speech Transcription      | ✅ Done | 100%      | High     |
| AI Evaluation System      | ✅ Done | 100%      | High     |
| Multi-Dimensional Scoring | ✅ Done | 100%      | High     |
| Question Database (Fixed) | ✅ Done | 100%      | Medium   |
| Video Broadcasting        | ⚠️ Limited | 40%    | Low      |
| **Content Upload UI**     | ❌ Missing | 0%     | **CRITICAL** |
| **Content Processing**    | ❌ Missing | 0%     | **CRITICAL** |
| **AI Content Analysis**   | ❌ Missing | 0%     | **CRITICAL** |
| **Dynamic Q Generation**  | ❌ Missing | 0%     | **CRITICAL** |
| User Content Library      | ❌ Missing | 0%     | High     |
| Content Management        | ❌ Missing | 0%     | Medium   |

**Overall Project Completion**: ~55% (11/20 components)

### B. What Works (Functional Features)

#### 1. Complete Multiplayer Game Session ✅

**Tested and Working**:
```
Step 1: Room Creation
  ├─ Host creates room with unique name
  ├─ Players join via room code
  ├─ LiveKit connection established
  └─ Real-time participant list syncs
  
Step 2: Game Activation
  ├─ Host enables "Game Mode"
  ├─ All players see mode change
  ├─ Control panel appears for host
  └─ Players see waiting screen
  
Step 3: Question Generation (3-5 seconds)
  ├─ Host clicks "Generate Question"
  ├─ API call to /api/game/generate-question
  ├─ Question selected from fixed database
  └─ All players see identical question
  
Step 4: Animated Countdown (10 seconds)
  ├─ Large yellow countdown: 10 → 0
  ├─ Pulse animation on numbers
  ├─ Reading/thinking time for players
  └─ Auto-transitions to BUZZING stage
  
Step 5: Buzz-In Competition
  ├─ Players click "BUZZ IN" button
  ├─ Timestamps collected for 200ms
  ├─ Fairest buzz-in wins
  └─ Winner announced to all players
  
Step 6: Answer Recording (90 seconds)
  ├─ Winner's camera activates (local view)
  ├─ Microphone records audio
  ├─ Visual countdown timer
  ├─ Can stop early or auto-submit
  └─ Audio uploaded for transcription
  
Step 7: AI Analysis (4-14 seconds)
  ├─ Whisper transcribes speech to text
  ├─ GPT-4 analyzes answer quality
  ├─ Identifies conceptual gaps
  └─ Generates EXACTLY 1 follow-up question
  
Step 8: Follow-Up Challenge (30 seconds)
  ├─ Targeted question displayed
  ├─ Winner clicks "Record Answer"
  ├─ 30-second response recorded
  └─ Audio transcribed
  
Step 9: Final Scoring (8-16 seconds)
  ├─ AI evaluates both answers
  ├─ 4-dimensional scoring:
  │   ├─ Conceptual Accuracy (25 pts)
  │   ├─ Structural Coherence (25 pts)
  │   ├─ Practical Examples (25 pts)
  │   └─ Response Quality (25 pts)
  ├─ Detailed feedback provided
  └─ Score updates for all players
  
Step 10: Next Round
  ├─ Host clicks "Next Round"
  ├─ New question generated
  └─ Cycle repeats
```

**Multiplayer Synchronization**:
- All players see the same game stage simultaneously
- Buzz-in attempts visible to everyone in real-time
- Scores sync across all clients
- Stage transitions synchronized via Data Channel
- No drift or desync issues observed

#### 2. AI Integration (OpenAI) ✅

**GPT-4o-mini Question Generation**:
- Input: Topic selection from 8 emergence theory categories
- Output: Short, scenario-based questions (2-3 sentences)
- Response time: 2-3 seconds average
- Quality: Academic-level, open-ended prompts

**Whisper Speech-to-Text**:
- Input: Audio blob (webm/mp4/ogg format)
- Output: English transcript
- Response time: 2-4 seconds (depending on audio length)
- Accuracy: High for clear speech

**GPT-4o-mini Answer Evaluation**:
- Input: Original question + user transcript
- Output: Analysis + follow-up question
- Response time: 4-14 seconds
- Quality: Identifies gaps, challenges reasoning

**GPT-4o-mini Scoring**:
- Input: Question + initial answer + follow-up question + follow-up answer
- Output: 4-dimensional score (100 points total) + detailed feedback
- Response time: 8-16 seconds
- Quality: Nuanced evaluation across multiple criteria

#### 3. Audio Recording System ✅

**Features**:
- Auto-detects browser's supported audio format
- Two recording durations: 90s (main answer), 30s (follow-up)
- Visual countdown timer with progress indicator
- Early stop option
- Error handling for permission denial
- Works on Chrome, Safari, Firefox

**Technical Details**:
- Uses MediaRecorder API
- Formats tried in order: audio/webm;codecs=opus → audio/webm → audio/mp4 → audio/ogg
- Audio blob sent via FormData to API
- Automatic format detection and file extension

#### 4. Real-Time Data Synchronization ✅

**LiveKit Data Channel**:
- Reliable message delivery guaranteed
- Sub-second latency for game messages
- Handles 10+ message types (START_GAME, NEW_QUESTION, BUZZ_IN, etc.)
- Timestamp-based fairness for buzz-ins
- No message loss observed in testing

**State Management**:
- Complex state machine in `useGameState` hook
- 7 distinct game stages tracked
- Player map synchronized across clients
- Score accumulation persists across rounds

### C. Known Limitations

#### 1. Video Broadcasting (Low Priority) ⚠️

**Current Behavior**:
- Answerer sees their own video locally ✅
- Video does NOT broadcast to other players ❌
- Audio works perfectly for everyone ✅

**Technical Reason**:
- Players join with `canPublish: false` (viewer mode)
- Buzzing in doesn't trigger reconnection with `canPublish: true`
- Publishing video to LiveKit requires permission

**Impact**: Minimal - voice quality is the priority for articulation practice

**Workaround**: Local video provides self-monitoring for answerer

**Full Solution (if needed)**: Reconnect answerer with publishing permissions when buzz-in won

#### 2. Fixed Question Database (CRITICAL LIMITATION) ❌

**Current Behavior**:
- Questions generated from `src/data/questions-database.json`
- 8 predefined topics (Emergence Theory only)
- Cannot customize to user's learning materials
- Limits utility to single subject area

**Impact**: CRITICAL - This defeats the core purpose of the project

**Must Be Replaced**: Custom content upload system (see Section VI)

---

## V. Completed Features (Detailed)

### A. 7-Phase Game Flow

#### Phase 1: Question Display & Countdown
**Duration**: 10 seconds  
**UI Elements**:
- Question text (centered, large font)
- Animated countdown: 10 → 0 (yellow, pulsing)
- Reading comprehension time for all players

**Implementation**: `GameUI.tsx`, lines ~250-280

#### Phase 2: Buzzing Stage
**Duration**: ~3-5 seconds (until first buzz or timeout)  
**Mechanics**:
- All players enabled to buzz simultaneously
- Timestamps collected for 200ms window
- Earliest timestamp wins
- Fairness across network latency

**Implementation**: `useGameState.ts`, `handleBuzzIn()` function

#### Phase 3: Winner Determined
**Duration**: Instant  
**Display**:
- Winner's name announced
- Other players see who won
- Answerer's UI switches to recording mode

**Implementation**: Data Channel sync, `BUZZ_WINNER` message

#### Phase 4: Answer Recording (Main)
**Duration**: 90 seconds  
**Features**:
- Camera activates (local view)
- Microphone records
- Countdown timer displayed
- Can stop early
- "Recording..." indicator

**Implementation**: `AudioRecorder.tsx` component

#### Phase 5: AI Analysis & Follow-Up
**Duration**: 4-14 seconds (AI processing)  
**Process**:
1. Audio → Whisper API → transcript
2. Transcript + question → GPT-4 → analysis
3. GPT-4 generates exactly 1 follow-up question
4. Follow-up displayed to answerer

**Implementation**: `/api/game/transcribe` + `/api/game/evaluate-answer`

#### Phase 6: Follow-Up Recording
**Duration**: 30 seconds  
**UI**:
- Follow-up question prominently displayed
- "Record Answer (30s)" button
- Shorter recording time (targeted question)

**Implementation**: `AudioRecorder.tsx` with `maxDuration={30}`

#### Phase 7: Final Scoring
**Duration**: 8-16 seconds (AI processing)  
**Display**:
- 4-dimensional score breakdown
- Feedback text for each dimension
- Total score (out of 100)
- Score added to player's total

**Implementation**: `/api/game/final-score`

### B. Fairness Mechanisms

#### Buzz-In Fairness System
**Problem**: Network latency creates unfair advantage/disadvantage

**Solution**: 200ms collection window
```typescript
// Pseudocode
When first buzz received:
  Start 200ms timer
  Collect all buzzes during window
  
When timer expires:
  Sort by timestamp (earliest wins)
  Declare winner
  Ignore late buzzes
```

**Result**: Players with 150ms latency difference have fair chance

#### Timestamp Authority
- All timestamps generated client-side
- Server (Data Channel) treats timestamps as authoritative
- Clock sync not required (only relative order matters)

### C. AI Prompt Engineering

#### Question Generation Prompt
**Approach**: Structured template with constraints
- Topic keywords provided from database
- Length constraint: 2-3 sentences
- Style: Scenario-based, open-ended
- Academic tone, no trivia

**Example Output**:
> "In a city where traffic patterns suddenly shift from predictable flows to chaotic jams, how would you explain this transition using the concept of a bifurcation point? What conditions might trigger such a phase change?"

#### Follow-Up Generation Prompt
**Approach**: Analyze gaps in user's answer
- Identify missing concepts
- Find logical inconsistencies
- Challenge depth of understanding
- Generate EXACTLY 1 targeted question

**Example Output**:
> "You mentioned feedback loops but didn't specify whether they were positive or negative. How would the distinction between these two types of feedback affect the system's stability?"

#### Scoring Prompt
**Approach**: Multi-dimensional rubric
- 4 separate criteria evaluated
- 25 points each (100 total)
- Detailed justification required
- Constructive feedback

**Output Structure**:
```json
{
  "dimensions": {
    "conceptual_accuracy": {
      "score": 20,
      "feedback": "Correctly identified emergence, but missed threshold concept"
    },
    "structural_coherence": {
      "score": 22,
      "feedback": "Well-organized with clear introduction and examples"
    },
    "practical_examples": {
      "score": 18,
      "feedback": "Traffic example was relevant but could be more specific"
    },
    "response_quality": {
      "score": 23,
      "feedback": "Clear articulation, good speaking pace"
    }
  },
  "total_score": 83,
  "overall_feedback": "Strong understanding with minor gaps..."
}
```

---

## VI. Gap Analysis: Missing Core Feature

### A. The Critical Gap

**Current State**: Platform generates questions from a fixed database of emergence theory topics.

**Required State**: Platform generates questions from USER-PROVIDED content (files, URLs, text).

**Why This Matters**: The entire value proposition is predicated on personalized learning. Without custom content, the platform is just a trivia game with voice input.

### B. Missing Components (Detailed)

#### 1. Content Upload Interface ❌
**What's Needed**:
- File upload component (drag-and-drop + file picker)
- Supported formats: PDF, DOCX, TXT, MD
- File size validation (e.g., max 10 MB)
- URL input field with validation
- Direct text paste textarea
- Upload progress indicator
- Error messages for unsupported formats

**User Flow**:
```
1. User clicks "Upload Learning Material"
2. Modal/page opens with 3 options:
   ├─ "Upload File" (PDF, DOCX, TXT)
   ├─ "Enter URL" (article, Wikipedia, etc.)
   └─ "Paste Text" (copy-paste from any source)
3. User selects option and provides content
4. File uploaded/URL fetched/text submitted
5. Processing begins with visual feedback
6. Success: "Content ready! X questions generated"
```

**Technical Requirements**:
- React component: `ContentUpload.tsx`
- Form validation
- File type checking
- API endpoint: `POST /api/content/upload`

**Estimated Effort**: 1-2 days

#### 2. Content Processing Pipeline ❌
**What's Needed**:
- **PDF Parsing**: Extract text from PDF files
  - Library: `pdf-parse` or `pdfjs-dist`
  - Handle multi-page documents
  - Preserve structure (headings, paragraphs)
  
- **DOCX Parsing**: Extract text from Word documents
  - Library: `mammoth` or `docx`
  - Handle formatting
  
- **URL Fetching**: Download and parse web pages
  - Library: `cheerio` for HTML parsing
  - Extract main content (strip ads, navigation)
  - Handle dynamic content (headless browser if needed)
  
- **Text Preprocessing**: Clean and structure content
  - Remove excessive whitespace
  - Segment into paragraphs/sections
  - Identify headings and key terms

**Technical Requirements**:
- API endpoint: `POST /api/content/process`
- NPM packages: `pdf-parse`, `mammoth`, `cheerio`, `node-fetch`
- Content storage (temporary or persistent)
- Error handling for malformed files

**Challenges**:
- PDFs may be scanned images (OCR required - expensive/complex)
- Web pages vary widely in structure
- Large files may timeout
- Encoding issues (non-UTF-8 text)

**Estimated Effort**: 3-4 days

#### 3. AI Content Analysis ❌
**What's Needed**:
- **Content Summarization**: AI reads full content, identifies main ideas
  - GPT-4 with prompt: "Summarize key concepts..."
  - Output: List of 5-10 core topics
  
- **Concept Extraction**: Identify specific terms, principles, relationships
  - GPT-4 with prompt: "Extract key terms and their definitions..."
  - Output: Glossary of important concepts
  
- **Question Generation**: Create answerable questions from content
  - GPT-4 with prompt: "Generate 20 open-ended questions..."
  - Questions stored as "question pool" for this content
  - Questions should test understanding, not recall
  
- **Metadata Tagging**: Categorize content for future retrieval
  - Subject area (science, history, philosophy, etc.)
  - Difficulty level estimate
  - Suitable for X-minute game session

**Technical Requirements**:
- API endpoint: `POST /api/content/analyze`
- OpenAI API calls (GPT-4 or GPT-4o-mini)
- Token management (large content = many tokens)
- Caching to avoid reprocessing

**Challenges**:
- Token limits (GPT-4: 128k context, but costs scale)
- Quality control (ensuring good questions)
- Handling diverse content types (technical vs. narrative)
- Content too short/simple may not generate enough questions

**Estimated Effort**: 4-5 days

#### 4. Dynamic Question Generation ❌
**What's Needed**:
- Replace current `generate-question` logic
- Pull from user's uploaded content instead of fixed database
- Maintain question quality standards
- Avoid repeating questions in same session
- Handle case where content runs out of questions

**Technical Requirements**:
- Modify `/api/game/generate-question/route.ts`
- Query user's content pool
- Track which questions already used
- Fallback if content exhausted

**Estimated Effort**: 1-2 days

#### 5. Content Storage & Management ❌
**What's Needed**:
- Store processed content temporarily or permanently
- Associate content with user/session
- List of uploaded content for user to select
- Delete old content
- Content library UI

**Options**:
- **Simple**: Store in-memory for current session only
- **Moderate**: Store as JSON files on server filesystem
- **Advanced**: Database (PostgreSQL, MongoDB) with user accounts

**Recommendation for Dec 1**: In-memory or filesystem (no database required)

**Estimated Effort**: 2-3 days

### C. Total Effort Estimate

| Component | Estimated Days | Priority |
|-----------|----------------|----------|
| Content Upload UI | 1-2 | Critical |
| Content Processing | 3-4 | Critical |
| AI Content Analysis | 4-5 | Critical |
| Dynamic Question Gen | 1-2 | Critical |
| Content Management | 2-3 | High |
| **TOTAL** | **11-16 days** | - |

**With 35 days until deadline**, this is feasible but requires focused effort.

### D. Minimum Viable Implementation

To meet Dec 1 deadline, prioritize these features:

**Must Have**:
1. Text paste input (simplest - no file parsing)
2. URL input with basic HTML parsing
3. AI content analysis and question generation
4. Integration with existing game flow

**Nice to Have**:
1. PDF upload and parsing
2. DOCX support
3. Content library/history
4. User accounts

**Can Skip**:
1. OCR for scanned PDFs
2. Advanced content management
3. Multi-format exports
4. Collaboration features

**Recommendation**: Start with text paste (0 parsing complexity) and URL input (moderate complexity), then add PDF support if time permits.

---

## VII. Development Timeline (Oct 27 - Dec 1)

### A. 5-Week Roadmap

#### Week 1: Content Upload Interface (Oct 27 - Nov 2)
**Goals**: Build UI for content input

**Tasks**:
- [x] Day 1-2: Design `ContentUpload` component
  - Three-tab interface: Text / URL / File
  - Validation and error messages
  - Loading states
  
- [x] Day 3-4: Implement text paste functionality
  - Textarea with character limit
  - Preview of pasted content
  - Submit button integration
  
- [x] Day 5-7: Implement URL input
  - URL validation
  - Fetch content from URL
  - Basic HTML parsing (extract main content)

**Deliverables**:
- Working UI component
- Text paste fully functional
- URL input functional (basic)

**Success Criteria**:
- User can paste text and see it submitted
- User can enter URL and content is fetched
- Error handling for invalid inputs

---

#### Week 2: Content Processing Pipeline (Nov 3 - Nov 9)
**Goals**: Extract and clean content from various sources

**Tasks**:
- [x] Day 1-2: Build content processing API
  - `/api/content/process` endpoint
  - Text cleaning and segmentation
  - Storage mechanism (filesystem or in-memory)
  
- [x] Day 3-4: URL content extraction
  - Use `cheerio` to parse HTML
  - Extract text from main content area
  - Filter out navigation, ads, footers
  
- [x] Day 5-7: PDF parsing (if time permits)
  - Integrate `pdf-parse` library
  - Handle multi-page PDFs
  - Text extraction and cleanup

**Deliverables**:
- API endpoint that accepts raw content and returns cleaned text
- URL fetching and parsing works reliably
- (Optional) PDF upload and parsing

**Success Criteria**:
- Text content properly cleaned
- URLs parsed with >80% accuracy for standard articles
- Content stored and retrievable

---

#### Week 3: AI Content Analysis (Nov 10 - Nov 16)
**Goals**: Generate questions from user content

**Tasks**:
- [x] Day 1-2: Content analysis prompt engineering
  - GPT-4 prompt for concept extraction
  - Test with sample content
  - Refine for quality
  
- [x] Day 3-5: Question generation pipeline
  - GPT-4 prompt for question creation
  - Generate 15-20 questions per content
  - Quality filtering (remove yes/no questions, etc.)
  
- [x] Day 6-7: Integration with content upload
  - Analyze content immediately after upload
  - Store generated questions with content
  - Display "X questions ready" to user

**Deliverables**:
- `/api/content/analyze` endpoint working
- Quality questions generated from test content
- Full pipeline: upload → process → analyze → questions

**Success Criteria**:
- AI generates at least 15 relevant questions from sample content
- Questions are open-ended and scenario-based
- Questions test understanding, not recall

---

#### Week 4: Integration & Testing (Nov 17 - Nov 23)
**Goals**: Connect custom content to game flow

**Tasks**:
- [x] Day 1-2: Modify game question generation
  - Update `/api/game/generate-question` to pull from user content
  - Add content selection UI (which uploaded content to use)
  - Handle case when questions exhausted
  
- [x] Day 3-4: Multi-player testing
  - Test with 2-4 players using custom content
  - Verify synchronization still works
  - Test different content types (text vs. URL)
  
- [x] Day 5-7: Bug fixes and edge cases
  - Handle empty content
  - Handle very short content (< 500 words)
  - Handle errors in AI generation
  - Timeout handling

**Deliverables**:
- Full game session using custom content
- Multi-player stability verified
- Major bugs fixed

**Success Criteria**:
- Complete 5-round game with custom content
- No crashes or desync issues
- Smooth user experience

---

#### Week 5: Polish & Documentation (Nov 24 - Dec 1)
**Goals**: Final refinements and submission prep

**Tasks**:
- [x] Day 1-2: UI/UX improvements
  - Better loading states
  - Clearer error messages
  - Visual polish (animations, transitions)
  
- [x] Day 3-4: User documentation
  - Quick start guide
  - How to upload content
  - Troubleshooting common issues
  - Video demo (optional)
  
- [x] Day 5-7: Final testing and submission
  - Test all features end-to-end
  - Record demo video
  - Write final project report
  - Submit by Dec 1

**Deliverables**:
- Polished, user-ready application
- Complete user documentation
- Demo video
- Final submission package

**Success Criteria**:
- Application runs without critical bugs
- New users can successfully upload content and play
- Documentation is clear and comprehensive
- Submission meets all course requirements

---

### B. Contingency Planning

**If Behind Schedule**:

**After Week 1**: If upload UI not complete
- **Action**: Simplify to text-only (skip URL and PDF)
- **Impact**: Reduced functionality but core feature intact

**After Week 2**: If content processing struggling
- **Action**: Text paste only, no parsing required
- **Impact**: Users must manually copy-paste content from PDFs/URLs

**After Week 3**: If question quality poor
- **Action**: Manual review and filtering of AI questions
- **Impact**: Slower but ensures quality

**After Week 4**: If integration issues
- **Action**: Reduce scope to single-player or 2-player only
- **Impact**: Simplified testing, less impressive but functional

**Nuclear Option** (if all else fails):
- Keep fixed database but demonstrate content upload prototype
- Show working question generation from sample custom content
- Document what would need to be done to fully integrate

---

### C. Milestones & Checkpoints

| Date | Milestone | Checkpoint |
|------|-----------|------------|
| Nov 2 | Week 1 Complete | Content upload UI functional |
| Nov 9 | Week 2 Complete | Content processing working |
| Nov 16 | Week 3 Complete | AI generates questions from custom content |
| Nov 23 | Week 4 Complete | Full integration, multi-player tested |
| Nov 30 | Week 5 Complete | Polished and documented |
| Dec 1 | **DEADLINE** | Final submission |

---

## VIII. Risk Assessment & Mitigation

### A. High-Risk Items

#### Risk 1: Content Parsing Complexity
**Description**: PDFs, web pages, and documents vary wildly in structure. Parsing may fail or extract gibberish.

**Likelihood**: High  
**Impact**: High (core feature fails)

**Mitigation Strategies**:
1. **Start Simple**: Prioritize plain text paste (no parsing)
2. **Use Robust Libraries**: `pdf-parse` and `cheerio` are battle-tested
3. **Graceful Degradation**: If parsing fails, ask user to paste text manually
4. **Test Early**: Use diverse sample files to identify issues
5. **Set Limits**: Max file size (10 MB), supported formats only

**Fallback**: If parsing proves too difficult, require users to copy-paste text themselves (reduces convenience but ensures functionality)

---

#### Risk 2: AI Question Quality
**Description**: GPT-4 may generate poor questions (too easy, too hard, off-topic, yes/no questions)

**Likelihood**: Medium  
**Impact**: High (defeats learning purpose)

**Mitigation Strategies**:
1. **Prompt Engineering**: Iterate on prompts with sample content
2. **Quality Filters**: Regex to reject yes/no questions
3. **Manual Review**: Check first 50 questions, refine prompts
4. **User Feedback**: Allow users to skip/report bad questions
5. **Temperature Tuning**: Lower temperature for more consistent output

**Fallback**: Pre-generate questions from uploaded content, manually review, store only good ones (time-consuming but ensures quality)

---

#### Risk 3: Time Constraint (5 Weeks)
**Description**: 11-16 days of work needed, but only 35 calendar days available. Unexpected issues will arise.

**Likelihood**: High  
**Impact**: Critical (project incomplete)

**Mitigation Strategies**:
1. **Aggressive Prioritization**: Must-haves only, cut nice-to-haves ruthlessly
2. **Daily Progress Tracking**: Small commits, visible progress each day
3. **Scope Flexibility**: Be ready to simplify if behind schedule
4. **No Perfectionism**: "Good enough" is acceptable for Dec 1
5. **Buffer Time**: Finish core features by Nov 23, use last week for polish

**Fallback**: Demonstrate working prototype with 1-2 sample content uploads, document remaining work needed

---

### B. Medium-Risk Items

#### Risk 4: API Rate Limits & Costs
**Description**: OpenAI API has rate limits and costs money per token

**Likelihood**: Medium  
**Impact**: Medium (slow performance or billing issues)

**Mitigation**:
- Use GPT-4o-mini instead of GPT-4 (10x cheaper)
- Cache AI responses where possible
- Set token limits on content analysis
- Monitor usage during development

---

#### Risk 5: File Size & Format Limitations
**Description**: Users may try to upload 100-page PDFs or obscure formats

**Likelihood**: Medium  
**Impact**: Low (graceful error handling)

**Mitigation**:
- Set strict file size limit (10 MB)
- Support only common formats (PDF, DOCX, TXT)
- Clear error messages when file rejected
- Suggest text paste for unsupported files

---

#### Risk 6: Content Copyright Concerns
**Description**: Users may upload copyrighted textbooks or articles

**Likelihood**: Low  
**Impact**: Low (academic fair use likely applies)

**Mitigation**:
- Add disclaimer: "Use only content you have rights to"
- Content not stored permanently (ephemeral processing)
- Educational context (fair use)
- No redistribution of content

---

### C. Risk Matrix

```
         HIGH IMPACT        |   MEDIUM IMPACT     |   LOW IMPACT
      -------------------|-------------------|------------------
HIGH  | • Content Parsing  | • API Costs       | 
PROB  | • Time Constraint  |                   |
      |                    |                   |
      -------------------|-------------------|------------------
MED   | • Question Quality | • File Limits     | • Video Issues
PROB  |                    |                   |
      |                    |                   |
      -------------------|-------------------|------------------
LOW   |                    |                   | • Copyright
PROB  |                    |                   |
```

**Focus Area**: High Impact + High Probability (upper-left quadrant)

---

## IX. Success Criteria & Deliverables

### A. Minimum Viable Product (MVP) for Dec 1

**Core Requirements** (must have all):

1. **Content Input**:
   - [ ] User can paste text (500-10,000 words)
   - [ ] User can enter URL and content is fetched
   - [ ] Basic validation and error messages

2. **AI Processing**:
   - [ ] AI analyzes uploaded content
   - [ ] Generates at least 15 relevant questions
   - [ ] Questions are open-ended and scenario-based

3. **Game Integration**:
   - [ ] Game pulls questions from uploaded content
   - [ ] Full 7-phase game flow works with custom questions
   - [ ] Multi-player synchronization maintained

4. **User Experience**:
   - [ ] Upload → process → play flow is clear
   - [ ] Loading states provide feedback
   - [ ] Errors are handled gracefully

5. **Documentation**:
   - [ ] User guide (how to upload content and play)
   - [ ] README with setup instructions
   - [ ] Brief video demo (3-5 minutes)

---

### B. Stretch Goals (if time permits)

**Enhanced Features**:
- [ ] PDF file upload and parsing
- [ ] DOCX file support
- [ ] Content library (list of previously uploaded content)
- [ ] Content preview before processing
- [ ] Difficulty level selection
- [ ] Question type filtering
- [ ] User accounts and saved content

---

### C. Evaluation Criteria (Self-Assessment)

**Functionality (40%)**:
- Does content upload work reliably?
- Are generated questions relevant and high-quality?
- Does the game flow work end-to-end?

**Innovation (20%)**:
- Novel approach to competitive learning
- AI-powered dialectical questioning
- Real-time multiplayer integration

**Technical Implementation (20%)**:
- Code quality and organization
- Proper error handling
- Scalable architecture

**User Experience (10%)**:
- Intuitive interface
- Clear feedback and guidance
- Smooth interactions

**Documentation (10%)**:
- Clear setup instructions
- User guide
- Code comments

---

## X. Next Steps & Action Items

### Immediate Actions (This Week)

**Day 1-2 (Oct 27-28)**:
1. [ ] Set up development branch: `feature/custom-content`
2. [ ] Create file structure:
   - `src/components/ContentUpload.tsx`
   - `src/types/content.ts`
   - `src/app/api/content/upload/route.ts`
3. [ ] Design content upload UI (wireframe/mockup)
4. [ ] Begin implementing text paste functionality

**Day 3-4 (Oct 29-30)**:
1. [ ] Complete text paste UI
2. [ ] Create API endpoint for content submission
3. [ ] Test text paste flow end-to-end
4. [ ] Begin URL input component

**Day 5-7 (Oct 31 - Nov 2)**:
1. [ ] Implement URL fetching
2. [ ] Basic HTML parsing with `cheerio`
3. [ ] Content preview display
4. [ ] Week 1 milestone: Upload interface complete

---

### Weekly Review Process

**Every Friday**:
1. Review progress against timeline
2. Identify blockers and risks
3. Adjust priorities if needed
4. Plan next week's tasks

**If Behind Schedule**:
- Cut lowest-priority feature
- Simplify implementation
- Seek help/clarification

**If Ahead of Schedule**:
- Start next week's tasks early
- Add stretch goals
- Improve code quality

---

### Communication & Support

**When Stuck**:
- Check documentation (OpenAI, LiveKit, library docs)
- Search for similar implementations (GitHub, Stack Overflow)
- Ask for help (instructor, classmates, online communities)
- Timebox problem-solving (don't spend >2 hours stuck)

**Progress Tracking**:
- Daily commit to git with descriptive messages
- Update checklist in this document
- Note any deviations from plan

---

## Appendices

### Appendix A: Technology Stack Details

**Frontend**:
- **React 18**: Component-based UI
- **Next.js 14**: App Router, API routes, SSR
- **TypeScript 5**: Type safety, better DX
- **Tailwind CSS 3**: Utility-first styling

**Real-Time**:
- **LiveKit Client SDK 2.0**: WebRTC communication
- **LiveKit Server SDK 2.0**: Token generation
- **Data Channel**: Game state sync

**AI/ML**:
- **OpenAI GPT-4o-mini**: Fast, cost-effective language model
- **OpenAI Whisper API**: Speech-to-text transcription

**To Be Added**:
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction
- **cheerio**: HTML parsing
- **node-fetch**: URL content fetching

**Deployment**:
- **Netlify** or **Vercel**: Serverless hosting
- **Edge Functions**: Low-latency API

---

### Appendix B: API Endpoints Reference

**Existing (Functional)**:
```
POST /api/token
  → Generate LiveKit access token
  Input: { roomName, participantName }
  Output: { token, url }

POST /api/game/check-config
  → Validate OpenAI API key
  Input: { apiKey }
  Output: { valid: boolean }

POST /api/game/generate-question
  → Generate question from fixed database
  Input: { difficulty }
  Output: { id, text, topic, difficulty }

POST /api/game/transcribe
  → Convert audio to text
  Input: FormData { audio: File }
  Output: { transcript: string }

POST /api/game/evaluate-answer
  → Analyze answer, generate follow-up
  Input: { question, transcript }
  Output: { analysis, followUpQuestion }

POST /api/game/final-score
  → Multi-dimensional scoring
  Input: { question, mainAnswer, followUp, followUpAnswer }
  Output: { dimensions, totalScore, feedback }
```

**To Be Built**:
```
POST /api/content/upload
  → Upload file or submit URL/text
  Input: FormData { file } OR { url } OR { text }
  Output: { contentId, status }

POST /api/content/process
  → Parse and clean content
  Input: { contentId }
  Output: { contentId, cleanedText, metadata }

POST /api/content/analyze
  → Extract concepts and generate questions
  Input: { contentId, cleanedText }
  Output: { concepts, questions[], contentId }

GET /api/content/list
  → List user's uploaded content
  Input: { userId } (optional)
  Output: { contents: [{ id, title, uploadedAt, questionCount }] }

DELETE /api/content/:id
  → Delete uploaded content
  Input: { contentId }
  Output: { success: boolean }
```

---

### Appendix C: Component Hierarchy

```
App (page.tsx)
├── LiveKitRoom (room connection)
│   ├── GameControlPanel (host controls)
│   │   ├── Enable Game Mode
│   │   ├── Generate Question
│   │   └── Content Upload Button [NEW]
│   │
│   └── GameUI (main game interface)
│       ├── Stage: WAITING
│       │   └── "Waiting for host to start..."
│       │
│       ├── Stage: COUNTDOWN
│       │   ├── Question Display
│       │   └── Animated Timer (10→0)
│       │
│       ├── Stage: BUZZING
│       │   ├── Question Display
│       │   └── BUZZ IN Button
│       │
│       ├── Stage: ANSWERING
│       │   ├── Video Display (answerer)
│       │   └── AudioRecorder (90s)
│       │
│       ├── Stage: FOLLOW_UP
│       │   ├── Follow-Up Question Display
│       │   └── AudioRecorder (30s)
│       │
│       ├── Stage: SCORING
│       │   ├── Score Breakdown (4 dimensions)
│       │   ├── Feedback Text
│       │   └── Next Round Button
│       │
│       └── Scoreboard (persistent)
│
└── ContentUpload [NEW]
    ├── Tab: Paste Text
    │   └── Textarea + Submit
    ├── Tab: Enter URL
    │   └── Input + Fetch Button
    └── Tab: Upload File
        └── File Picker + Upload Button
```

---

### Appendix D: Testing Procedures

**Unit Testing** (recommended but not required for MVP):
- Content parsing functions
- Question quality filters
- URL validation

**Integration Testing**:
1. Upload text → verify questions generated
2. Upload URL → verify content fetched and parsed
3. Play game with custom content → verify synchronization
4. Multi-player with different content → verify isolation

**Manual Testing Checklist**:

**Content Upload**:
- [ ] Paste text (500 words) → process → questions generated
- [ ] Paste text (5000 words) → process → questions generated
- [ ] Enter valid URL → content fetched → questions generated
- [ ] Enter invalid URL → error message displayed
- [ ] Upload PDF → parsed → questions generated (if implemented)
- [ ] Upload very large file → rejected with clear message

**Game Flow**:
- [ ] Start game with custom content
- [ ] Question from uploaded content appears
- [ ] Buzz-in and answer works normally
- [ ] AI evaluation references custom content
- [ ] Follow-up question relevant to topic
- [ ] Score properly calculated
- [ ] Next round generates new question from same content

**Multi-Player**:
- [ ] Player 1 uploads content
- [ ] Player 2 sees game start (no errors)
- [ ] Both players see questions from P1's content
- [ ] Synchronization remains stable

**Edge Cases**:
- [ ] Empty text submitted → error message
- [ ] Very short text (<100 words) → warning or rejection
- [ ] URL returns 404 → error message
- [ ] URL returns non-text content → error message
- [ ] All questions exhausted → fallback message or repeat questions
- [ ] API rate limit hit → graceful error
- [ ] Network timeout during upload → retry or error

---

### Appendix E: Glossary

**Buzz-In**: The action of pressing a button to indicate readiness to answer a question, competing with other players for the right to respond.

**Data Channel**: LiveKit's reliable message-passing system for synchronizing game state across all connected clients without using media streams.

**Dialectical Questioning**: A Socratic method where follow-up questions challenge and refine the answerer's initial response, exposing gaps in understanding.

**Follow-Up Question**: An AI-generated question posed after the initial answer, designed to probe deeper or challenge weak points in the response.

**Game Stage**: One of seven distinct phases in the game flow (WAITING, COUNTDOWN, BUZZING, ANSWERING, FOLLOW_UP, SCORING, NEXT_ROUND).

**Multi-Dimensional Scoring**: Evaluation across four separate criteria (conceptual accuracy, structural coherence, practical examples, response quality) rather than a single score.

**Question Pool**: The set of AI-generated questions derived from a specific piece of uploaded content, used to supply questions for game sessions.

**Real-Time Synchronization**: The process of ensuring all connected players see the same game state simultaneously, achieved via LiveKit Data Channel.

**WebRTC**: Web Real-Time Communication, the browser technology enabling peer-to-peer audio, video, and data transmission without plugins.

---

## Conclusion

This project sits at an exciting intersection of AI, education, and real-time multiplayer technology. The foundation is solid: multiplayer infrastructure works, AI integration is robust, and game mechanics are polished. The critical challenge ahead is building the custom content upload and processing system that will transform this from a demo into a genuinely useful learning tool.

With **5 weeks until the December 1 deadline** and an estimated **11-16 days of focused development** required, the timeline is tight but achievable. Success depends on:

1. **Aggressive prioritization** (text/URL first, PDF if time permits)
2. **Early testing** (identify parsing issues quickly)
3. **Iterative prompt engineering** (ensure question quality)
4. **Scope flexibility** (cut features if behind schedule)
5. **Consistent daily progress** (avoid last-minute crunch)

The project demonstrates technical sophistication (LiveKit integration, AI orchestration, real-time state management) and pedagogical innovation (competitive learning, dialectical questioning). Completing the custom content system will elevate it from an impressive technical demo to a practical educational tool with real-world utility.

**Next Immediate Action**: Begin implementing content upload interface (Week 1 tasks) starting October 27.

---

**Document Version**: 1.0  
**Last Updated**: October 27, 2025  
**Status**: Midterm Audit - 55% Complete  
**Next Review**: November 3, 2025 (Week 1 Checkpoint)



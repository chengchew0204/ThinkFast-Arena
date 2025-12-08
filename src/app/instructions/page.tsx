'use client';

import Link from 'next/link';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-light text-gray-900">Game Instructions</h1>
            <Link
              href="/"
              className="border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200 py-2 px-4 text-sm rounded-lg"
            >
              Back to Home
            </Link>
          </div>

          <div className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                ThinkFast Arena is a real-time multiplayer AI-powered quiz game where players compete to answer open-ended questions through voice responses. The game uses OpenAI's GPT-4 to generate questions and evaluate answers, and Whisper API for speech-to-text transcription. Players compete in a buzzer-style format, with AI providing comprehensive scoring based on multiple dimensions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Getting Started</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Creating or Joining a Room</h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">1. Create a New Room</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Click "Create Room" on the landing page</li>
                    <li>You will receive a unique 6-character room code</li>
                    <li>Share this code with other players who want to join</li>
                    <li>You become the <strong>Host</strong> of this room</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">2. Join an Existing Room</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Click "Join Existing Room"</li>
                    <li>Enter the 6-character room code shared by the host</li>
                    <li>Click "Join Room"</li>
                    <li>You will join as a <strong>Player</strong> (non-host)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">3. Test Your Devices</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Before playing, click "Test Camera & Microphone" to ensure your devices work properly</li>
                    <li>The game requires both microphone access (for answering) and camera access (for video display during answers)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Game Setup</h2>
              <p className="text-gray-700 mb-4">Once inside a room, the <strong>Host</strong> has access to game controls:</p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Host Controls</h3>
              
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-800 mb-1">1. Upload Custom Content (Optional)</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2 text-sm">
                    <li>Click "Upload Content" to add your own learning material</li>
                    <li><strong>Paste Text</strong>: Provide at least 500 characters of text content</li>
                    <li><strong>Enter URL</strong>: Provide a URL to an article or webpage</li>
                    <li>Choose how many questions to generate (5-30, default is 15)</li>
                    <li>If you don't upload content, the game will use default questions</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-800 mb-1">2. Configure Rounds</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2 text-sm">
                    <li>Set the number of rounds (1-20, default is 5)</li>
                    <li>Each round consists of one question</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-800 mb-1">3. Start the Game</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2 text-sm">
                    <li>Click "Start Game & Generate Question"</li>
                    <li>This begins the game and automatically generates the first question</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Player Roles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Host</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Controls game flow</li>
                      <li>Can participate and answer</li>
                      <li>Starts rounds</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Other Players</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Cannot control game flow</li>
                      <li>Can buzz in and answer</li>
                      <li>Full participation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Game Flow</h2>
              <p className="text-gray-700 mb-4">The game progresses through several stages for each round:</p>

              <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Stage 1: WAITING</h3>
                  <p className="text-gray-700 text-sm">The game is waiting for the host to generate a new question.</p>
                  <p className="text-blue-600 text-sm mt-2"><strong>Host Action:</strong> Click "Generate New Question"</p>
                </div>

                <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Stage 2: QUESTION DISPLAY</h3>
                  <p className="text-gray-700 text-sm">A question appears with a 10-second countdown.</p>
                  <p className="text-blue-600 text-sm mt-2"><strong>All Players:</strong> Read and prepare your answer</p>
                </div>

                <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Stage 3: BUZZING</h3>
                  <p className="text-gray-700 text-sm">The "BUZZ IN" button appears. First to buzz wins (200ms window).</p>
                  <p className="text-blue-600 text-sm mt-2"><strong>All Players:</strong> Click "BUZZ IN" if you know the answer</p>
                </div>

                <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Stage 4: ANSWERING</h3>
                  <p className="text-gray-700 text-sm">Winner records a 90-second voice answer with video.</p>
                  <p className="text-blue-600 text-sm mt-2"><strong>Answering Player:</strong> Speak your answer clearly</p>
                  <p className="text-gray-600 text-sm mt-1"><strong>Other Players:</strong> Watch and listen</p>
                </div>

                <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Stage 5: SCORING</h3>
                  <p className="text-gray-700 text-sm">AI transcribes and evaluates the answer across 4 dimensions.</p>
                  <p className="text-blue-600 text-sm mt-2"><strong>All Players:</strong> View scoring results and feedback</p>
                </div>

                <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Stage 6: NEXT ROUND / GAME OVER</h3>
                  <p className="text-gray-700 text-sm">Host proceeds to next round or game ends.</p>
                  <p className="text-blue-600 text-sm mt-2"><strong>Host Action:</strong> Click "Next Round" or view final leaderboard</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Scoring System</h2>
              <p className="text-gray-700 mb-4">The AI evaluates each answer across four key dimensions:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-amber-300 rounded-lg p-4 bg-amber-50">
                  <h3 className="text-lg font-medium text-amber-900 mb-2">Concept Accuracy</h3>
                  <p className="text-amber-800 text-2xl font-bold mb-2">30 points</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Correctness of core concepts</li>
                    <li>Factual accuracy</li>
                    <li>Depth of understanding</li>
                  </ul>
                </div>

                <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Structural Coherence</h3>
                  <p className="text-blue-800 text-2xl font-bold mb-2">25 points</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Logical organization</li>
                    <li>Clear structure and flow</li>
                    <li>Coherent presentation</li>
                  </ul>
                </div>

                <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                  <h3 className="text-lg font-medium text-green-900 mb-2">Practical Examples</h3>
                  <p className="text-green-800 text-2xl font-bold mb-2">25 points</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Real-world examples</li>
                    <li>Relevance to topic</li>
                    <li>Quality of illustrations</li>
                  </ul>
                </div>

                <div className="border border-purple-300 rounded-lg p-4 bg-purple-50">
                  <h3 className="text-lg font-medium text-purple-900 mb-2">Response Quality</h3>
                  <p className="text-purple-800 text-2xl font-bold mb-2">20 points</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Communication effectiveness</li>
                    <li>Clarity and articulation</li>
                    <li>Engagement</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                <p className="text-gray-800 font-medium">Total Possible Score per Question: <span className="text-2xl text-blue-600">100 points</span></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Tips for Success</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Read Carefully</h3>
                  <p className="text-gray-700 text-sm">Use the 10-second display time to fully understand the question</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Buzz Strategically</h3>
                  <p className="text-gray-700 text-sm">Only buzz in if you have a solid answer</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Structure Your Answer</h3>
                  <p className="text-gray-700 text-sm">Start with core concept, add details, use examples, conclude clearly</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Speak Clearly</h3>
                  <p className="text-gray-700 text-sm">Moderate pace, enunciate clearly, avoid long pauses</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Use Examples</h3>
                  <p className="text-gray-700 text-sm">Real-world applications and specific cases boost your score</p>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Manage Your Time</h3>
                  <p className="text-gray-700 text-sm">90 seconds - aim for comprehensive but concise</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Technical Requirements</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>Stable internet connection (for WebRTC streaming)</li>
                <li>Working microphone (for voice answers)</li>
                <li>Working camera (for video during answering)</li>
                <li>Microphone and camera permissions must be granted</li>
              </ul>
            </section>

            <section className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Game Philosophy</h2>
              <p className="text-gray-700 mb-4">ThinkFast Arena is designed to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li>Encourage deep knowledge and critical thinking</li>
                <li>Foster articulate communication skills</li>
                <li>Create competitive yet educational experiences</li>
                <li>Demonstrate the power of AI in education and assessment</li>
                <li>Provide real-time collaborative learning experiences</li>
              </ul>
              <p className="text-gray-600 text-sm mt-4 italic">
                The name "ThinkFast Arena" emphasizes quick thinking and competitive knowledge battles in a real-time environment.
              </p>
            </section>

            <div className="text-center py-6">
              <Link
                href="/"
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 py-3 px-8 text-lg font-medium rounded-lg shadow-md hover:shadow-lg inline-block"
              >
                Ready to Play? Go Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThinkFast Arena - Real-time Quiz Game',
  description: 'Real-time multiplayer quiz game platform based on WebRTC + SFU architecture. Compete with friends in knowledge battles.',
  keywords: 'WebRTC, quiz game, multiplayer, SFU, LiveKit, real-time communication',
  authors: [{ name: 'ThinkFast Arena' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

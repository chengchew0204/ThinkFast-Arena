# Video Broadcasting Fix - Second Round Issue

## Problem
Starting from the second round of questions, video would not broadcast and was not visible in the answerer's window.

## Root Causes

### 1. Video Element Remounting
The video elements had keys that included `gameState.currentRound`:
```tsx
key={`local-${gameState.currentAnswerer}-${gameState.currentRound}`}
```

When the round number changed, React would completely unmount and remount the video elements, breaking the track attachments.

### 2. Race Condition in Track Attachment
The useEffect for attaching camera tracks had `gameState.currentRound` as a dependency, causing unnecessary re-runs and potential timing issues with track attachment/detachment.

### 3. Missing Track Cleanup
The video elements weren't properly clearing old srcObject before attaching new tracks, potentially causing conflicts.

## Solutions Implemented

### 1. Stable Video Element Keys
Changed video element keys to be stable across rounds:
```tsx
// Before
key={`local-${gameState.currentAnswerer}-${gameState.currentRound}`}

// After  
key="local-video"
```

This prevents unnecessary remounting and allows tracks to be properly reattached.

### 2. Removed Round Dependency
Removed `gameState.currentRound` from the useEffect dependency array for video attachment, preventing unnecessary effect re-runs.

### 3. Proper Track Cleanup
Added explicit cleanup of existing srcObject before attaching new tracks:
```tsx
if (localVideoElement.srcObject) {
  const tracks = (localVideoElement.srcObject as MediaStream).getTracks();
  tracks.forEach(track => track.stop());
  localVideoElement.srcObject = null;
}
```

### 4. Improved Camera Enable Logic
Enhanced the `enableAnswererCamera` function to properly handle existing camera tracks:
- Check if camera is already enabled and unmuted
- Reuse existing camera tracks when possible
- Only create new tracks when necessary

### 5. Added Timing Safeguards
Added small delays to ensure video elements are fully mounted before attaching tracks:
```tsx
setTimeout(() => {
  // Attach camera track
}, 100);
```

## Files Modified
- `/src/components/GameUI.tsx` - Fixed video element keys and track attachment logic
- `/src/components/LiveKitRoom.tsx` - Improved camera enable/disable logic
- Added better logging for debugging track subscriptions

## Testing
Test the fix by:
1. Starting a game
2. Completing the first round
3. Verifying video broadcasts correctly in the second round
4. Continuing through multiple rounds to ensure consistency

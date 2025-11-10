# Storage Fix - Global Persistence

**Issue**: Questions were being stored but not found when generating questions
**Root Cause**: In Next.js, in-memory Maps were being cleared between API route calls
**Solution**: Use Node.js `global` object to persist storage across all API routes

---

## What Changed

### Before:
```typescript
const contentStore = new Map<string, UserContent>();
const questionPools = new Map<string, GeneratedQuestion[]>();
```

### After:
```typescript
// Use global object for persistence
const contentStore = global.contentStore || new Map<string, UserContent>();
const questionPools = global.questionPools || new Map<string, GeneratedQuestion[]>();

// Persist to global
if (!global.contentStore) global.contentStore = contentStore;
if (!global.questionPools) global.questionPools = questionPools;
```

---

## Why This Works

In Next.js:
- **Development Mode**: Hot module reloading can clear module-level variables
- **Serverless**: Each API route might be in a different instance
- **Solution**: `global` object persists across all of these scenarios

---

## Enhanced Debugging

Added comprehensive debug output to track storage:

### New Debug Function:
```typescript
debugStorage() // Shows all contentIds and question counts
```

### Where It's Called:
1. **After storing questions** (`/api/content/analyze`)
2. **Before retrieving questions** (`/api/game/generate-question`)

---

## How to Test

1. **Restart the dev server** (important!):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Upload content**:
   - Enable Game Mode
   - Click "Upload Content"
   - Set question count (5-30)
   - Paste text or enter URL
   - Click "Generate Questions"

3. **Check SERVER CONSOLE** (terminal where `npm run dev` is running):
   ```
   You should see:
   ✓ Successfully generated 15 questions for contentId: content_xxxxx
   ✓ Storing 15 questions for contentId: content_xxxxx
   ✓ === CONTENT STORE DEBUG ===
   ✓ Content Store size: 1
   ✓ Question Pools size: 1
   ✓ Question Pool IDs: ["content_xxxxx"]
   ```

4. **Start the game**:
   - Click "Start Game & Generate Question"
   
5. **Check SERVER CONSOLE again**:
   ```
   You should see:
   ✓ Attempting to get question for contentId: content_xxxxx
   ✓ === CONTENT STORE DEBUG ===
   ✓ Question Pools size: 1  ← Should be 1, not 0!
   ✓ Looking for questions with contentId: content_xxxxx
   ✓ Found pool with 15 questions
   ✓ Returning unused question: q_xxxxx
   ```

---

## What to Look For

### ✅ SUCCESS:
```
Question Pools size: 1
Question Pool IDs: ["content_1762809xxx"]
Found pool with 15 questions
```

### ❌ FAILURE (old behavior):
```
Question Pools size: 0  ← Empty!
Question Pool IDs: []
No question pool found for contentId
```

---

## Debug Endpoint

Added `/api/content/debug` to check storage status:

```bash
# Check what's in storage
curl http://localhost:3001/api/content/debug
```

Returns:
```json
{
  "contentCount": 1,
  "contents": [
    {
      "id": "content_xxxxx",
      "title": "My Content",
      "wordCount": 1500,
      "status": "ready"
    }
  ]
}
```

---

## Files Modified

1. ✅ `src/utils/contentStore.ts`
   - Use global object for persistence
   - Added debugStorage() function
   - Added getAllQuestionPools()

2. ✅ `src/app/api/content/analyze/route.ts`
   - Added debugStorage() call after storing

3. ✅ `src/app/api/game/generate-question/route.ts`
   - Added debugStorage() calls before/after retrieval

4. ✅ `src/app/api/content/debug/route.ts` (NEW)
   - Diagnostic endpoint

---

## Testing Checklist

- [ ] Restart dev server
- [ ] Upload content
- [ ] Check server console for "Storing X questions"
- [ ] Check server console shows "Question Pools size: 1"
- [ ] Start game
- [ ] Check server console for "Found pool with X questions"
- [ ] Question appears (no 404 error)
- [ ] Play multiple rounds
- [ ] Different questions each round

---

## If It Still Doesn't Work

1. **Check which terminal** - Server logs are in the terminal running `npm run dev`, NOT browser console

2. **Restart server** - Must restart after code changes:
   ```bash
   Ctrl+C
   npm run dev
   ```

3. **Check the debug endpoint**:
   ```bash
   curl http://localhost:3001/api/content/debug
   ```

4. **Look for this in server console**:
   - "Storing X questions for contentId"
   - "Question Pools size: 1" (not 0)
   - "Found pool with X questions" (not "No question pool found")

---

## Build Status

✅ **Build Successful**
```bash
npm run build
✓ Compiled successfully
✓ All routes included
```

---

## Expected Flow

```
1. Upload Content
   ↓
2. /api/content/process → Returns contentId
   ↓
3. /api/content/analyze → Stores questions in global.questionPools
   ↓  [SERVER CONSOLE: "Question Pools size: 1"]
4. SET_CONTENT message → Client stores contentId
   ↓
5. START_GAME
   ↓
6. /api/game/generate-question → Retrieves from global.questionPools
   ↓  [SERVER CONSOLE: "Found pool with 15 questions"]
7. Question displayed ✅
```

---

## Key Points

- **Look at SERVER console** (terminal), not browser console for storage logs
- **Restart dev server** after code changes
- **Global object** ensures persistence across API calls
- **Debug endpoint** available at `/api/content/debug`

This should fix the issue completely!


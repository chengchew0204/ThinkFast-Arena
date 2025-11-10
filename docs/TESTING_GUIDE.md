# Testing Guide - Game Workflow Optimization

## Quick Start Testing

### Prerequisites
1. Ensure `.env.local` has `OPENAI_API_KEY` configured
2. Build completed successfully (verified ✅)
3. Start development server: `npm run dev`

## Phase 1: Camera Activation Testing

### Test 1: Main Answer Camera
1. Enable Game Mode
2. Start Game & Generate Question
3. Wait for countdown (10s)
4. Click "BUZZ IN"
5. **Expected**: Camera automatically turns on
6. **Verify**: You see your own video in the answer area

### Test 2: Follow-up Camera Persistence
1. Complete main answer (90s or early stop)
2. Wait for AI to generate follow-up question
3. **Expected**: Camera REMAINS on (video still showing)
4. **Verify**: Video displays throughout follow-up stage
5. Click "Record Answer (30s)"
6. **Expected**: Camera continues showing during 30s recording
7. Submit follow-up answer
8. **Expected**: Camera disables when scoring appears

### Test 3: Camera Cleanup
1. Complete full round with follow-up
2. View score display
3. **Expected**: Camera is OFF during scoring
4. Click "Next Round"
5. **Expected**: Camera remains off until next buzz-in

## Phase 2: Content Upload Testing

### Test 4: Text Paste Upload
1. Enable Game Mode (don't start yet)
2. Click "Upload Content" button
3. Select "Paste Text" tab
4. Paste sample text (500-1000 words)
   - **Sample**: Copy an article from Wikipedia or any educational content
5. (Optional) Enter a title
6. Click "Generate Questions"
7. **Expected**: 
   - Processing indicator appears
   - "Generating questions from content..." message
   - Success: "X questions generated and ready"
   - Status shows in control panel with title and count

### Test 5: URL Upload
1. Click "Upload Content" again
2. Select "Enter URL" tab
3. Enter a URL (suggestions below)
4. Click "Generate Questions"
5. **Expected**: 
   - Fetches and parses HTML
   - Extracts main content
   - Generates questions
   - Shows success message

**Suggested Test URLs**:
- https://en.wikipedia.org/wiki/Artificial_intelligence
- https://en.wikipedia.org/wiki/Game_theory
- https://simple.wikipedia.org/wiki/Neural_network
- Any educational blog post or article

### Test 6: Game with Custom Content
1. Upload content (text or URL)
2. Wait for "Content Ready" message
3. Click "Start Game & Generate Question"
4. **Expected**: Question is generated from YOUR content (not fixed database)
5. **Verify**: Question content relates to uploaded material
6. Complete the round
7. Click "Next Round"
8. **Expected**: Another question from your custom content (different from first)

### Test 7: Multi-player Custom Content
**Setup**: Open two browser windows/tabs

**Window 1 (Host)**:
1. Join room as "Host"
2. Enable Game Mode
3. Upload custom content
4. Start game

**Window 2 (Player)**:
1. Join same room as "Player2"
2. Enable Game Mode
3. Wait for host to start

**Expected Behavior**:
- Player2 sees questions from Host's uploaded content
- Both see identical questions
- Synchronization maintained
- Custom content shared across session

### Test 8: Error Handling - Text Too Short
1. Click "Upload Content"
2. Paste only 100 words
3. Click "Generate Questions"
4. **Expected**: Error message "Text is too short..."
5. **Verify**: Character count shows red/yellow warning

### Test 9: Error Handling - Invalid URL
1. Click "Upload Content"
2. Select "Enter URL"
3. Enter invalid URL: "htp://invalid"
4. **Expected**: Validation error "Invalid URL format..."
5. Try URL that doesn't exist: "https://thisdoesnotexist12345.com"
6. **Expected**: Fetch error with clear message

### Test 10: Error Handling - Question Exhaustion
1. Upload short content (~500 words)
2. Start game and play ~15-20 rounds
3. **Expected**: Eventually questions start repeating
4. **Verify**: System handles gracefully, no crashes

### Test 11: Fallback to Fixed Database
1. Enable Game Mode (no custom content uploaded)
2. Start Game
3. **Expected**: Questions generated from fixed Emergence Theory database
4. **Verify**: Questions about emergence, complexity, systems thinking

## Advanced Testing

### Test 12: Large Content Handling
1. Upload very large text (10,000+ words)
2. **Expected**: System truncates to 20,000 words max
3. Generates appropriate number of questions

### Test 13: Special Characters & Formatting
1. Upload text with special characters, emojis, formatting
2. **Expected**: Content cleaned properly
3. Questions generated correctly

### Test 14: URL Timeout
1. Try uploading a very slow-loading URL
2. **Expected**: 10-second timeout with clear error message

## Verification Checklist

### Camera Feature ✓
- [ ] Camera auto-activates on main answer
- [ ] Camera persists during follow-up question display
- [ ] Camera remains on during 30s follow-up recording
- [ ] Camera disables after scoring
- [ ] No camera issues or leaks

### Content Upload ✓
- [ ] Text paste accepts 500-50,000 characters
- [ ] URL validation works
- [ ] URL fetching succeeds for valid URLs
- [ ] HTML parsing extracts meaningful content
- [ ] Character counter accurate
- [ ] Title field optional and working

### Question Generation ✓
- [ ] Generates 10-20 questions from content
- [ ] Questions are relevant to uploaded content
- [ ] Questions are open-ended (not yes/no)
- [ ] Questions vary in focus
- [ ] Quality filter works (no gibberish)

### Game Integration ✓
- [ ] Custom content questions used in game
- [ ] Questions don't repeat immediately
- [ ] Fallback to fixed database works
- [ ] Multi-player sync maintained
- [ ] contentId transmitted correctly

### Error Handling ✓
- [ ] All validation errors show clear messages
- [ ] Network errors handled gracefully
- [ ] AI failures don't crash app
- [ ] Empty states handled
- [ ] Edge cases covered

## Performance Expectations

- **Text Processing**: < 1 second
- **URL Fetching**: 2-5 seconds (depends on source)
- **Question Generation**: 10-20 seconds (AI processing)
- **Total Upload Time**: 15-30 seconds typical

## Common Issues & Solutions

### Issue: "Failed to fetch URL"
- **Solution**: Check URL is valid and publicly accessible
- Try copying content as text instead

### Issue: "Content too short"
- **Solution**: Need at least 500 characters (roughly 100 words)
- Try longer article or combine multiple sources

### Issue: Questions don't match content
- **Solution**: Verify content uploaded successfully
- Check contentInfo display shows correct title
- May need better source material (more structured content works better)

### Issue: Camera doesn't show
- **Solution**: Check browser permissions for camera
- Ensure no other app is using camera
- Try refreshing page

## Success Indicators

✅ **Phase 1 Success**:
- Camera visible during entire answer period (main + follow-up)
- Smooth transitions between stages
- No camera permission errors

✅ **Phase 2 Success**:
- Content upload smooth and intuitive
- Questions relevant to uploaded content
- Error messages helpful and actionable
- Multi-player synchronization maintained
- Game playable end-to-end with custom content

## Report Issues

If you encounter unexpected behavior:
1. Check browser console for errors
2. Note the exact steps to reproduce
3. Screenshot any error messages
4. Check if issue occurs in both single and multi-player

## Next Steps After Testing

1. Document any bugs found
2. Test with real learning materials (textbooks, papers, etc.)
3. Gather user feedback on question quality
4. Consider enhancements (PDF support, content library, etc.)


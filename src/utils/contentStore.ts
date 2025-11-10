import { UserContent, GeneratedQuestion } from '@/types/content';

// Use global to persist across hot reloads in development
// and across serverless function invocations
declare global {
  var contentStore: Map<string, UserContent> | undefined;
  var questionPools: Map<string, GeneratedQuestion[]> | undefined;
}

const contentStore = global.contentStore || new Map<string, UserContent>();
const questionPools = global.questionPools || new Map<string, GeneratedQuestion[]>();

// Persist to global
if (!global.contentStore) {
  global.contentStore = contentStore;
}
if (!global.questionPools) {
  global.questionPools = questionPools;
}

export function storeContent(content: UserContent): void {
  contentStore.set(content.id, content);
}

export function getContent(contentId: string): UserContent | undefined {
  return contentStore.get(contentId);
}

export function storeQuestions(contentId: string, questions: GeneratedQuestion[]): void {
  console.log(`Storing ${questions.length} questions for contentId: ${contentId}`);
  questionPools.set(contentId, questions);
  console.log('Total content IDs in questionPools:', Array.from(questionPools.keys()));
}

export function getQuestions(contentId: string): GeneratedQuestion[] | undefined {
  return questionPools.get(contentId);
}

export function getUnusedQuestion(contentId: string): GeneratedQuestion | null {
  console.log(`Looking for questions with contentId: ${contentId}`);
  console.log('Available content IDs:', Array.from(questionPools.keys()));
  
  const pool = questionPools.get(contentId);
  if (!pool) {
    console.error(`No question pool found for contentId: ${contentId}`);
    return null;
  }
  
  console.log(`Found pool with ${pool.length} questions`);
  const unused = pool.find(q => !q.used);
  if (unused) {
    unused.used = true;
    console.log(`Returning unused question: ${unused.id}`);
    return unused;
  }
  
  // All used - reset and return first
  console.log('All questions used, resetting pool');
  pool.forEach(q => q.used = false);
  pool[0].used = true;
  return pool[0];
}

export function resetQuestionPool(contentId: string): void {
  const pool = questionPools.get(contentId);
  if (pool) {
    pool.forEach(q => q.used = false);
  }
}

export function deleteContent(contentId: string): void {
  contentStore.delete(contentId);
  questionPools.delete(contentId);
}

export function getAllContent(): UserContent[] {
  return Array.from(contentStore.values());
}

export function getAllQuestionPools(): Map<string, GeneratedQuestion[]> {
  return questionPools;
}

export function debugStorage(): void {
  console.log('=== CONTENT STORE DEBUG ===');
  console.log('Content Store size:', contentStore.size);
  console.log('Content IDs:', Array.from(contentStore.keys()));
  console.log('Question Pools size:', questionPools.size);
  console.log('Question Pool IDs:', Array.from(questionPools.keys()));
  questionPools.forEach((pool, id) => {
    console.log(`  - ${id}: ${pool.length} questions`);
  });
  console.log('=========================');
}


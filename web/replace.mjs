import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function replaceInFile(filePath, replacements) {
  let content = readFileSync(filePath, 'utf-8');
  for (const [search, replace] of replacements) {
    content = content.replace(new RegExp(search, 'g'), replace);
  }
  writeFileSync(filePath, content, 'utf-8');
}

// 1. Rename files in vector-stores and rag-chat
import { renameSync, readdirSync } from 'fs';

const vectorStoreDir = join(process.cwd(), 'src/pages/vector-stores');
for (const file of readdirSync(vectorStoreDir)) {
  if (file.includes('AiProvider')) {
    renameSync(join(vectorStoreDir, file), join(vectorStoreDir, file.replace('AiProvider', 'VectorStore')));
  }
}

const ragChatDir = join(process.cwd(), 'src/pages/rag-chat');
for (const file of readdirSync(ragChatDir)) {
  if (file.includes('Chat')) {
    renameSync(join(ragChatDir, file), join(ragChatDir, file.replace('Chat', 'RagChat')));
  }
}

// 2. Replace content in vector-stores
for (const file of readdirSync(vectorStoreDir)) {
  if(file.endsWith('.tsx') || file.endsWith('.ts')) {
    replaceInFile(join(vectorStoreDir, file), [
      ['AiProvider', 'VectorStore'],
      ['aiProvider', 'vectorStore'],
      ['ai-provider', 'vector-store'],
      ['AI Provider', 'Vector Store'],
      ['Ai Provider', 'Vector Store'],
      ['ai_provider', 'vector_store'],
      ['Ai provider', 'Vector store'],
    ]);
  }
}

// 3. Replace content in rag-chat
for (const file of readdirSync(ragChatDir)) {
    if(file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceInFile(join(ragChatDir, file), [
        ['Chat', 'RagChat'],
        ['chat', 'ragChat'],
        // some lowercase css or URLs could be broken, but let's fix that later
        ['chatService', 'ragChatService'],
        ['/chat', '/rag-chat'],
        ['RAG RAG', 'RAG '], // avoid double RAG
      ]);
    }
}

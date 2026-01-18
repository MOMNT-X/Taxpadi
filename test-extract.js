// Test the extractAiResponse function
const extractAiResponse = (content) => {
  const trimmed = content.trim();
  
  console.log('🔍 Testing extraction with content:', trimmed.substring(0, 100));
  
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      console.log('✅ Parsed JSON:', parsed);
      
      if (parsed.ai_response) {
        console.log('✅ Found ai_response:', parsed.ai_response);
        return parsed.ai_response;
      }
      
      if (parsed.response) {
        console.log('✅ Found response:', parsed.response);
        return parsed.response;
      }
      
      console.log('⚠️ No ai_response or response field');
      return content;
    } catch (e) {
      console.error('❌ Parse failed:', e);
      return content;
    }
  }
  
  console.log('ℹ️ Not JSON format');
  return content;
};

// Test cases
console.log('\n=== Test 1: JSON string from webhook ===');
const test1 = '{"status":"reply", "ai_response":"I\'m your Nigerian tax consultant for 2026."}';
console.log('Input:', test1);
console.log('Output:', extractAiResponse(test1));

console.log('\n=== Test 2: Formatted JSON ===');
const test2 = `{
  "status": "reply",
  "ai_response": "Hello there!"
}`;
console.log('Input:', test2);
console.log('Output:', extractAiResponse(test2));

console.log('\n=== Test 3: Plain text ===');
const test3 = 'Just plain text response';
console.log('Input:', test3);
console.log('Output:', extractAiResponse(test3));

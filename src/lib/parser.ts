
export type StreamEvent =
  | { event: "token"; data: { delta: string } }
  | { event: "done"; data: any }
  | { event: "error"; data: { message: string } };

export function parseJsonl(content: string): StreamEvent[] {
  const lines = content.split("\n");
  const events: StreamEvent[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      // Basic validation to ensure it matches the shape
      if (parsed.event && parsed.data) {
        events.push(parsed as StreamEvent);
      }
    } catch (e) {
      console.warn("Failed to parse line:", line);
    }
  }

  return events;
}

export function extractVegaSpec(text: string): Record<string, any> | null {
  // Look for ```json ... ``` block
  // This regex matches a code block starting with ```json and ending with ```
  // We use [\s\S]*? to match any character including newlines lazily
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonBlockRegex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      // JSON might be incomplete if we are still streaming, which is expected
      return null;
    }
  }

  return null;
}

export function extractThinkingProcess(text: string) {
  // Regex to capture content between <thought> tags (handling unclosed for streaming)
  // Also supports <think> for DeepSeek compatibility
  const thoughtMatch = text.match(/<(thought|think)>([\s\S]*?)(<\/(thought|think)>|$)/);

  if (thoughtMatch) {
    const fullMatch = thoughtMatch[0];
    const thoughtContent = thoughtMatch[2];
    const isClosed = !!thoughtMatch[3] && thoughtMatch[3].startsWith('</');

    // Everything AFTER the thought block is the main content
    // If unclosed, main content is empty
    const mainContent = text.replace(fullMatch, '');

    return { hasThought: true, thought: thoughtContent, content: mainContent, isClosed };
  }

  return { hasThought: false, thought: '', content: text, isClosed: true };
}

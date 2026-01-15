
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

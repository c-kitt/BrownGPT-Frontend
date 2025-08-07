const API_URL = 'http://localhost:5000';  // Change for production

export interface ChatResponse {
  response: string;
  data_sources?: string[];
  intent?: string;
  error?: string;
}

export async function initializeChat(
  concentration: string,
  gradeLevel: string,
  semester: string,
  sessionId: string = 'default'
) {
  const response = await fetch(`${API_URL}/api/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      concentration,
      gradeLevel,
      semester
    })
  });
  return response.json();
}

export async function sendMessage(
  message: string,
  sessionId: string = 'default'
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      message
    })
  });
  return response.json();
}
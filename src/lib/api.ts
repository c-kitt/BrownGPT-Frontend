// src/lib/api.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface ChatResponse {
  response: string;
  intent?: string;
  data_sources?: string[];
  error?: string;
}

export interface ContextData {
  concentration: string;
  gradeLevel: string;
  semester: string;
}

// Generate unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function initializeSession(sessionId: string) {
  console.log('[API] Initializing session:', sessionId);
  try {
    const response = await fetch(`${API_URL}/api/init`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[API] Session initialized:', data);
    return data;
  } catch (error) {
    console.error('[API] Failed to initialize session:', error);
    throw error;
  }
}

export async function setUserContext(
  sessionId: string,
  context: ContextData
) {
  console.log('[API] Setting context:', context);
  try {
    const response = await fetch(`${API_URL}/api/set-context`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        concentration: context.concentration,
        gradeLevel: context.gradeLevel,
        semester: context.semester
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Context setting failed:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[API] Context set:', data);
    return data;
  } catch (error) {
    console.error('[API] Failed to set context:', error);
    throw error;
  }
}

export async function validateConcentration(concentration: string) {
  console.log('[API] Validating concentration:', concentration);
  try {
    const response = await fetch(`${API_URL}/api/validate-concentration`, {  // Must use ${API_URL}
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ concentration })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[API] Validation result:', data);
    return data;
  } catch (error) {
    console.error('[API] Failed to validate concentration:', error);
    return { proper_name: concentration };
  }
}

export async function sendMessage(
  sessionId: string,
  message: string
): Promise<ChatResponse> {
  console.log('[API] Sending message:', message);
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        message
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[API] Response received');
    return data;
  } catch (error) {
    console.error('[API] Failed to send message:', error);
    return {
      response: "I'm having trouble connecting. Please check that the server is running.",
      error: error.toString()
    };
  }
}
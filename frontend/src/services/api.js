// API Service for triggering code executions

const API_BASE_URL = 'http://localhost:5000/api';

export const executeCode = async (code, language) => {
  try {
    const response = await fetch(`${API_BASE_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      throw new Error(`Execution request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API execution error:', error);
    throw error;
  }
};

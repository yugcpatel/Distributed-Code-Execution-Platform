// Import axios, which is a popular library to make HTTP requests
import axios from 'axios';

// This is the base URL for our backend server
const API_BASE_URL = 'http://localhost:5000/api';

// We export an async function that sends the code to the backend
export const executeCode = async (code, language) => {
  try {
    // We use axios.post to send a POST request to the /execute route
    // The second argument is the data we want to send: the code and its language
    const response = await axios.post(`${API_BASE_URL}/execute`, {
      code,
      language
    });
    
    // The backend now responds instantly with { success: true, jobId: "..." }
    // We return response.data to give the components the jobId
    return response.data;
  } catch (error) {
    // If there is an error (like server is down), we print it to the console
    console.error('API execution error:', error);
    
    // Extract the exact error message sent by our backend (e.g., SyntaxError or Unsupported language)
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    
    // Otherwise throw the original error (e.g., Network Error)
    throw error;
  }
};

// New function to poll the status of a submitted job
export const getJobStatus = async (jobId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('API status fetch error:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

import type { FormData, Prediction } from '../types';

// Directly set the FastAPI endpoint. 
// Ensure your FastAPI server is running on this address and port.
const FASTAPI_ENDPOINT = 'http://localhost:8000/predict';

export const predictSalaryWithFastAPI = async (formData: FormData): Promise<Prediction> => {
  try {
    const response = await fetch(FASTAPI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      let errorBody = "Unknown error";
      try {
        // Try to get more detailed error message from backend if available
        const errorData = await response.json();
        errorBody = errorData.detail || JSON.stringify(errorData);
      } catch (e) {
        // Fallback if error response is not JSON or parsing fails
        try {
            errorBody = await response.text();
        } catch (textErr) {
            // Ignore if can't parse error body as text either
        }
      }
      throw new Error(`FastAPI server returned an error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
    }

    const result = await response.json();

    // Validate the structure of the prediction
    if (!result || typeof result.salaryCategory !== 'string' || typeof result.explanation !== 'string') {
      throw new Error('Invalid JSON structure received from FastAPI backend.');
    }
    if (result.salaryCategory !== '>50K' && result.salaryCategory !== '<=50K') {
        throw new Error(`Invalid salaryCategory value from FastAPI: ${result.salaryCategory}. Must be '>50K' or '<=50K'.`);
    }
    
    return result as Prediction;

  } catch (error) {
    console.error("Error calling FastAPI backend:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(`Could not connect to the FastAPI backend at ${FASTAPI_ENDPOINT}. Please ensure the server is running, accessible, and that there are no CORS issues if running on different domains/ports locally without proper CORS configuration on the server.`);
    }
    // Ensure the error message is a string for the UI
    if (error instanceof Error) {
        throw error;
    }
    throw new Error(String(error)); 
  }
};
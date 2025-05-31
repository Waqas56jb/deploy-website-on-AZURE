
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Configure Gemini API
genai.configure(api_key=api_key)

# Load Gemini model
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception:
    model = genai.GenerativeModel('gemini-1.0-pro')

# Generate response
def get_gemini_response(user_input):
    prompt = f"You are a chatbot for HealthGenix, an online gym, diet, and rehabilitation platform using MediaPipe pose estimation. Answer the following question with expertise in fitness, nutrition, and rehab: {user_input}"
    try:
        response = model.generate_content(prompt)
        return response.text[:500] + "..." if len(response.text) > 500 else response.text
    except Exception as e:
        return f"Error: {str(e)}"

# API route
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400
    message = data['message']
    response = get_gemini_response(message)
    return jsonify({'response': response})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

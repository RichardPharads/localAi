from flask import Flask, request, jsonify
import sqlite3
import ollama  # Assuming you're using Ollama AI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('chat.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_message TEXT,
            bot_response TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Endpoint to get AI response and store it
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message")

    # Get AI response from Ollama
    ai_response = ollama.chat(model="llama3.2:1b", messages=[{"role": "user", "content": user_message}])["message"]["content"]

    # Store chat history in SQLite
    conn = sqlite3.connect('chat.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO chat_history (user_message, bot_response) VALUES (?, ?)', (user_message, ai_response))
    conn.commit()
    conn.close()

    return jsonify({"response": ai_response})

# Endpoint to fetch chat history
@app.route('/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect('chat.db')
    cursor = conn.cursor()
    cursor.execute('SELECT user_message, bot_response, timestamp FROM chat_history ORDER BY timestamp DESC')
    chats = cursor.fetchall()
    conn.close()

    history = [{"user_message": chat[0], "bot_response": chat[1], "timestamp": chat[2]} for chat in chats]
    return jsonify(history)

@app.route('/reset', methods=['DELETE'])
def reset_history():
    conn = sqlite3.connect('chat.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM chat_history')  # Clears all data
    conn.commit()
    conn.close()
    return jsonify({"message": "Chat history cleared!"})

if __name__ == '__main__':
    app.run(debug=True)

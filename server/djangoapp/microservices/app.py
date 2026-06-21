from flask import Flask, request, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask("Sentiment Analyzer")
sia = SentimentIntensityAnalyzer()

@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. \
    Use /analyze/text to get the sentiment"

@app.get('/analyze')
def analyze_sentiment():
    # Extract from query parameters: /analyze?text=your+string
    input_txt = request.args.get('text', '')
    
    if not input_txt:
        return jsonify({"sentiment": "neutral"}), 400
        
    scores = sia.polarity_scores(input_txt)
    pos = scores.get('pos', 0.0)
    neg = scores.get('neg', 0.0)
    net = pos - neg

    if net >= 0.3:
        res = "positive"
    elif net <= -0.3:
        res = "negative"
    else:
        res = "neutral"
        
    return jsonify({"sentiment": res})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
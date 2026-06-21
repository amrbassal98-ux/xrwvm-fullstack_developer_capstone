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
    
    # Extract compound metric or evaluate high-scores safely
    # Flask native jsonify handles headers and JSON formatting cleaner than json.dumps
    neg = scores.get('neg', 0.0)
    pos = scores.get('pos', 0.0)
    neu = scores.get('neu', 0.0)
    
    if neg > pos and neg > neu:
        res = "negative"
    elif neu > neg and neu > pos:
        res = "neutral"
    else:
        res = "positive"
        
    return jsonify({"sentiment": res})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
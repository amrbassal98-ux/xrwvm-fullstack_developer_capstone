from flask import Flask, request, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask("Sentiment Analyzer")
sia = SentimentIntensityAnalyzer()


@app.get('/')
def home():
    return (
        "Welcome to the Sentiment Analyzer. "
        "Use /analyze?text=your+string to get the sentiment"
    )


@app.get('/analyze')
def analyze_sentiment():
    input_txt = request.args.get('text', '')

    if not input_txt or not input_txt.strip():
        return jsonify({"sentiment": "neutral", "scores": {}})

    scores = sia.polarity_scores(input_txt)
    compound = scores.get('compound', 0.0)

    if compound >= 0.05:
        res = "positive"
    elif compound <= -0.05:
        res = "negative"
    else:
        res = "neutral"

    return jsonify({
        "sentiment": res,
        "scores": {
            "compound": compound,
            "pos": scores.get('pos', 0.0),
            "neg": scores.get('neg', 0.0),
            "neu": scores.get('neu', 0.0)
        }
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

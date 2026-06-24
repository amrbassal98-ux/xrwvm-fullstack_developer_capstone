import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.environ.get(
    'NODE_API_URL', default="http://localhost:3030"
)
sentiment_analyzer_url = os.environ.get(
    'SENTIMENT_ANALYZER_URL',
    default="http://localhost:5050/"
)


def get_request(endpoint, **kwargs):
    """
    Executes an HTTP GET request using automated
    query parameter handling.
    """
    request_url = f"{backend_url}{endpoint}"
    print(f"GET from {request_url} with params: {kwargs}")

    try:
        response = requests.get(
            request_url, params=kwargs
        )
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Network exception occurred: {e}")
        return None


def analyze_review_sentiments(text):
    """
    Consumes the sentiment analyzer microservice
    safely using query parameters.
    """
    base_url = sentiment_analyzer_url.rstrip('/') + '/analyze'
    payload = {'text': text}

    try:
        response = requests.get(
            base_url, params=payload, timeout=5
        )
        response.raise_for_status()
        result = response.json()
        return {
            "sentiment": result.get('sentiment', 'neutral'),
            "scores": result.get('scores', {})
        }

    except requests.exceptions.RequestException as err:
        print(f"Sentiment analysis failed: {err}")
        return {"sentiment": "neutral", "scores": {}}


def post_review(data_dict):
    request_url = f"{backend_url}/insert_review"
    try:
        response = requests.post(
            request_url, json=data_dict
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Network exception occurred: {e}")
        return None

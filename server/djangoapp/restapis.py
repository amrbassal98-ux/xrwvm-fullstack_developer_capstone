import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5000/")

def get_request(endpoint, **kwargs):
    """
    Executes an HTTP GET request using automated query parameter handling.
    """
    request_url = f"{backend_url}{endpoint}"
    print(f"GET from {request_url} with params: {kwargs}")
    
    try:
        # The requests library automatically serializes kwargs into URL parameters safely
        response = requests.get(request_url, params=kwargs)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Network exception occurred: {e}")
        return None

def analyze_review_sentiments(text):
    """
    Consumes the sentiment analyzer microservice safely using query parameters.
    """
    # Standardize URL trailing slash
    base_url = SENTIMENT_ANALYZER_URL.rstrip('/') + '/analyze'
    payload = {'text': text}
    
    try:
        # Pass payload to params; requests handles encoding natively
        response = requests.get(base_url, params=payload)
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as err:
        print(f"Network exception occurred: {err}")
        return {"sentiment": "neutral"}

def post_review(data_dict):
    request_url = f"{backend_url}/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Network exception occurred: {e}")
        return None


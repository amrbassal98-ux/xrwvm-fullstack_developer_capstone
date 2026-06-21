from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate, _seed_mongodb_reviews
from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments, post_review


# Get an instance of a logger
logger = logging.getLogger(__name__)

@csrf_exempt
def login_user(request):
    """
    Handles user login requests by authenticating the user
    and logging them in if the credentials are valid.
    """
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated", "firstName": user.first_name, "lastName": user.last_name}
    return JsonResponse(data)

def logout_request(request):
    """
    Terminates the active user session and clears backend authentication states.
    """
    # Extract the username before flushing the session data
    username = request.user.username if request.user.is_authenticated else ""
    
    # Explicitly clear the session engine state
    logout(request) 
    
    # Package empty username descriptor per Capstone specifications
    data = {"userName": ""} 
    return JsonResponse(data)

@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    
    username_exists = False
    try:
        User.objects.get(username=username)
        username_exists = True
    except User.DoesNotExist:
        logger.debug("%s is new user", username)
        
    if not username_exists:
        user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name, password=password, email=email)
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated", "firstName": first_name, "lastName": last_name})
    else:
        return JsonResponse({"userName": username, "error": "Already Registered"})

# Update the `get_cars` view to render the index
def get_cars(request):
    _seed_mongodb_reviews()
    count = CarMake.objects.filter().count()
    if(count == 0):
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({"CarModel": car_model.name, "CarMake": car_model.car_make.name})
    return JsonResponse({"CarModels":cars})

def get_dealerships(request, state='ALL'):
    _seed_mongodb_reviews()
    if state == 'ALL':
        endpoint = "/fetchDealers"
    else:
        endpoint = f"/fetchDealers/{state}"
    dealerships = get_request(endpoint)
    return JsonResponse({"dealers": dealerships, "status": 200})

def get_dealer_reviews(request, dealer_id):
    # if dealer id has been provided
    if(dealer_id):
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            review_detail['sentiment'] = response['sentiment']
        return JsonResponse({"status":200,"reviews":reviews})
    else:
        return JsonResponse({"status":400,"message":"Bad Request"})

def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        return JsonResponse({"dealer": dealership, "status": 200})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})

def add_review(request):
    if request.user.is_anonymous == False:
        data = json.loads(request.body)
        try:
            response = post_review(data)
            return JsonResponse({"status": 200, "message": "Review added successfully"})
        except Exception as e:
            return JsonResponse({"status": 400, "message": "Error adding review"})
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})
    

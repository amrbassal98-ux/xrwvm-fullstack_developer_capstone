#!/usr/bin/env python3
"""Simple end-to-end authentication flow test.

Assumes the Django development server is already running
on http://127.0.0.1:8000.
The script performs:
  1. Register a fresh user via /djangoapp/register
  2. Log in the same user via /djangoapp/login
  3. Log out via /djangoapp/logout

Run it with:
    python run_auth_test.py
"""
import random
import string
import sys
import time
import requests

BASE = "http://127.0.0.1:8000/djangoapp"


def rand_str(n=8):
    return "".join(
        random.choice(string.ascii_letters + string.digits)
        for _ in range(n)
    )


creds = {
    "userName": f"test_{rand_str()}",
    "password": f"Pass{rand_str(10)}",
    "firstName": "Demo",
    "lastName": "User",
    "email": f"demo_{rand_str()}@example.com",
}


def register():
    r = requests.post(
        f"{BASE}/register", json=creds, timeout=5
    )
    print("REGISTER", r.status_code, r.json())
    if r.json().get("status") != "Authenticated":
        sys.exit("Register failed")


def login():
    payload = {
        "userName": creds["userName"],
        "password": creds["password"],
    }
    r = requests.post(
        f"{BASE}/login", json=payload, timeout=5
    )
    print("LOGIN", r.status_code, r.json())
    if (
        r.json().get("status") != "Authenticated"
        or "sessionid" not in r.cookies
    ):
        sys.exit("Login failed")
    return r.cookies


def logout(cookies):
    r = requests.get(
        f"{BASE}/logout", cookies=cookies, timeout=5
    )
    print("LOGOUT", r.status_code, r.json())
    if r.json().get("userName") != "":
        sys.exit("Logout failed")


if __name__ == "__main__":
    time.sleep(2)
    register()
    sess = login()
    logout(sess)
    print("All steps succeeded")

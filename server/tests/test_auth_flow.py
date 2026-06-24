# test_auth_flow.py
"""Simple authentication flow test for the Capstone app.

This script exercises the **register**, **login**, and
**logout** API endpoints provided by the Django backend.
It uses the public HTTP API (no browser required) and
verifies that:
  1. A new user can be registered.
  2. The same user can log in and receives a session cookie.
  3. After logout the session cookie becomes invalid.

Run the script with:
    python test_auth_flow.py

Make sure the Django development server is running
(e.g. `python manage.py runserver`) and that the database
is in a clean state or that the chosen username does not
already exist.
"""

import os
import requests
from urllib.parse import urljoin

# Configuration
BASE_URL = os.environ.get('DJANGO_TEST_URL', 'http://localhost:8000/')
REGISTER_ENDPOINT = urljoin(BASE_URL, "djangoapp/register")
LOGIN_ENDPOINT = urljoin(BASE_URL, "djangoapp/login")
LOGOUT_ENDPOINT = urljoin(BASE_URL, "djangoapp/logout")

TEST_USER = {
    "userName": "test_user_123",
    "password": "TestPass!23",
    "firstName": "Test",
    "lastName": "User",
    "email": "test_user_123@example.com",
}


def register_user(session: requests.Session) -> None:
    """Register a new user."""
    resp = session.post(
        REGISTER_ENDPOINT,
        json=TEST_USER,
        headers={"Content-Type": "application/json"},
    )
    resp.raise_for_status()
    data = resp.json()
    assert data.get("status") == "Authenticated", (
        f"Register failed: {data}"
    )
    print("Registration succeeded")


def login_user(session: requests.Session) -> None:
    """Log in the previously registered user."""
    login_payload = {
        "userName": TEST_USER["userName"],
        "password": TEST_USER["password"],
    }
    resp = session.post(
        LOGIN_ENDPOINT,
        json=login_payload,
        headers={"Content-Type": "application/json"},
    )
    resp.raise_for_status()
    data = resp.json()
    assert data.get("status") == "Authenticated", (
        f"Login failed: {data}"
    )
    assert "sessionid" in session.cookies, (
        "No session cookie set after login"
    )
    print("Login succeeded, session cookie received")


def logout_user(session: requests.Session) -> None:
    """Log out the current user and verify the session
    is cleared."""
    resp = session.get(LOGOUT_ENDPOINT)
    resp.raise_for_status()
    data = resp.json()
    assert data.get("userName") == "", (
        f"Logout response unexpected: {data}"
    )
    session.cookies.clear()
    print("Logout succeeded, session cleared")


def main() -> None:
    with requests.Session() as s:
        register_user(s)
        login_user(s)
        logout_user(s)
        print("All authentication flow tests passed!")


if __name__ == "__main__":
    main()

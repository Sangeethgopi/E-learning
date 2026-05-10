def test_register_user(client):
    register_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "test"
    }
    response = client.post("/v1/auth/register", json=register_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_user(client):
    # First register a user
    register_data = {
        "username": "loginuser",
        "email": "login@example.com",
        "password": "test"
    }
    client.post("/v1/auth/register", json=register_data)
    
    # Then login
    login_data = {
        "email": "login@example.com",
        "password": "test"
    }
    response = client.post("/v1/auth/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials(client):
    login_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/v1/auth/login", json=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"

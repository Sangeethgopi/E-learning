def test_health_check(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "platform": "AI E-Learning Platform"
    }

def test_api_docs_available(client):
    # Testing Swagger UI availability
    response = client.get("/docs")
    assert response.status_code == 200
    assert "Swagger UI" in response.text

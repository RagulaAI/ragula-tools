"""Tests for the RagulaClient, focusing on initialization and core attributes."""

import pytest
from ragula.sdk.client import RagulaClient

# TODO: Add comprehensive tests for RagulaClient

def test_client_initialization():
    """Tests basic client initialization."""
    token = "test_token" # Renamed for clarity
    base_url = "http://localhost:8000"
    client = RagulaClient(token=token, base_url=base_url)
    assert client.token == token
    assert client.base_url == base_url.rstrip('/') + '/api'
    assert client.collections is not None
    assert client.files is not None
    assert client.folders is not None
    assert client.query is not None

# Add more tests here for client methods, error handling, etc.
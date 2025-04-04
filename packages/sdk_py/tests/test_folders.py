"""Tests for the FoldersHandler, covering folder operations."""

import pytest
from ragula.sdk.client import RagulaClient
from ragula.sdk.folders import FoldersService

# TODO: Add comprehensive tests for FoldersHandler

@pytest.fixture
def client():
    """Fixture to create a RagulaClient instance for tests."""
    return RagulaClient(token="test_api_key", base_url="http://localhost:8000")

@pytest.fixture
def folders_handler(client):
    """Fixture to create a FoldersHandler instance."""
    return client.folders

def test_folders_handler_initialization(folders_handler, client):
    """Tests FoldersHandler initialization."""
    assert folders_handler._client == client

# Add more tests here for list_folders, create_folder, get_folder,
# delete_folder, etc., including mocking API calls.
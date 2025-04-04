"""Tests for the FilesHandler, covering file operations."""

import pytest
from ragula.sdk.client import RagulaClient
from ragula.sdk.files import FilesService

# TODO: Add comprehensive tests for FilesHandler

@pytest.fixture
def client():
    """Fixture to create a RagulaClient instance for tests."""
    return RagulaClient(token="test_api_key", base_url="http://localhost:8000")

@pytest.fixture
def files_handler(client):
    """Fixture to create a FilesHandler instance."""
    return client.files

def test_files_handler_initialization(files_handler, client):
    """Tests FilesHandler initialization."""
    assert files_handler._client == client

# Add more tests here for list_files, upload_file, get_file,
# delete_file, etc., including mocking API calls and file operations.
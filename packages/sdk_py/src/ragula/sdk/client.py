import requests
from typing import Optional, Dict, Any, Union

class RagulaError(Exception):
    """Base exception for Ragula SDK errors."""
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(f"[{status_code}] {message}")

class RagulaClient:
    def __init__(self, base_url: str = "https://www.ragula.io", token: Optional[str] = None):
        """
        Initializes the Ragula API client.

        Args:
            base_url: The base URL for the Ragula API. Defaults to "https://api.ragula.io".
            token: The API token (Bearer) for authentication.
        """
        # Ensure base_url doesn't end with a slash, and append /api if not present
        if base_url.endswith('/'):
            base_url = base_url[:-1]
        if not base_url.endswith('/api'):
             self.base_url = f"{base_url}/api"
        else:
             self.base_url = base_url

        self.token = token
        self._session = requests.Session()
        if self.token:
            self._session.headers.update({"Authorization": f"Bearer {self.token}"})
        self._session.headers.update({"Content-Type": "application/json", "Accept": "application/json"})

        # Initialize services
        from .collections import CollectionsService
        from .folders import FoldersService
        from .files import FilesService
        from .query import QueryService

        self.collections = CollectionsService(self)
        self.folders = FoldersService(self)
        self.files = FilesService(self)
        self.query = QueryService(self)


    def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json_data: Optional[Dict[str, Any]] = None,
        files: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None, # For form data like multipart/form-data
    ) -> Union[Dict[str, Any], Any]:
        """
        Makes an HTTP request to the specified endpoint.

        Args:
            method: HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
            endpoint: API endpoint path (e.g., '/collections').
            params: URL query parameters.
            json_data: JSON payload for the request body.
            files: Files to upload (for multipart/form-data).
            data: Form data payload (used with files).

        Returns:
            The JSON response from the API.

        Raises:
            RagulaError: If the API returns an error status code.
        """
        url = f"{self.base_url}{endpoint}"
        headers = self._session.headers.copy()

        # Adjust headers for file uploads
        if files:
            # requests handles Content-Type for multipart/form-data
            # Remove Content-Type and Accept if they were set for JSON
            headers.pop('Content-Type', None)
            headers.pop('Accept', None) # Let requests handle Accept for file responses if needed

        try:
            response = self._session.request(
                method=method,
                url=url,
                params=params,
                json=json_data if not files else None, # Don't send json if files are present
                files=files,
                data=data if files else None, # Send data only if files are present
                headers=headers
            )
            response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)

            # Handle successful responses
            if response.status_code == 204: # No Content
                return None
            try:
                return response.json()
            except requests.exceptions.JSONDecodeError:
                 # Handle cases where response might not be JSON (e.g., file download - though not in this spec)
                 # Or if a 2xx response unexpectedly has no body or non-JSON body
                 return response.text # Or response.content for binary

        except requests.exceptions.HTTPError as e:
            status_code = e.response.status_code
            try:
                # Try to parse error message from JSON response
                error_data = e.response.json()
                message = error_data.get("message", e.response.text)
            except requests.exceptions.JSONDecodeError:
                # If error response is not JSON
                message = e.response.text
            raise RagulaError(status_code=status_code, message=message) from e
        except requests.exceptions.RequestException as e:
            # Handle connection errors, timeouts, etc.
            raise RagulaError(status_code=500, message=f"Request failed: {e}") from e
from typing import TYPE_CHECKING, List, Dict, Any, Optional

if TYPE_CHECKING:
    from .client import RagulaClient

class CollectionsService:
    """
    Service for interacting with the Collections endpoints.
    """
    def __init__(self, client: 'RagulaClient'):
        self._client = client

    def list_collections(self) -> List[Dict[str, Any]]:
        """
        Lists all collections accessible by the authenticated user.

        Returns:
            A list of collection objects.
        """
        return self._client._request("GET", "/collections")

    def create_collection(self, name: str, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Creates a new collection.

        Args:
            name: The name of the collection.
            description: An optional description for the collection.

        Returns:
            The newly created collection object.
        """
        payload = {"name": name, "description": description}
        # Filter out None values if description is not provided
        payload = {k: v for k, v in payload.items() if v is not None}
        return self._client._request("POST", "/collections", json_data=payload)

    def get_collection(self, collection_id: str) -> Dict[str, Any]:
        """
        Retrieves details for a specific collection.

        Args:
            collection_id: The ID of the collection to retrieve.

        Returns:
            The collection object.
        """
        return self._client._request("GET", f"/collections/{collection_id}")

    def update_collection(self, collection_id: str, name: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Updates an existing collection.

        Args:
            collection_id: The ID of the collection to update.
            name: The new name for the collection (optional).
            description: The new description for the collection (optional).

        Returns:
            The updated collection object.
        """
        payload = {}
        if name is not None:
            payload["name"] = name
        if description is not None:
            payload["description"] = description

        if not payload:
             # Or raise an error, depending on desired behavior if nothing is updated
             # For now, just fetch the collection if no update data provided
             return self.get_collection(collection_id)

        return self._client._request("PUT", f"/collections/{collection_id}", json_data=payload)

    def delete_collection(self, collection_id: str) -> None:
        """
        Deletes a specific collection.

        Args:
            collection_id: The ID of the collection to delete.
        """
        self._client._request("DELETE", f"/collections/{collection_id}")
        return None # Explicitly return None for 204 responses

    def get_collection_status(self, collection_id: str) -> Dict[str, Any]:
        """
        Retrieves the processing status for a specific collection.

        Args:
            collection_id: The ID of the collection.

        Returns:
            An object containing the collection's status, file count, and total size.
        """
        return self._client._request("GET", f"/collections/{collection_id}/status")
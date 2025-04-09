from typing import TYPE_CHECKING, List, Optional
from .models import (
    Collection, CollectionStatus, CreateCollectionPayload, UpdateCollectionPayload,
    ListCollectionsResponse, CreateCollectionResponse, GetCollectionResponse,
    UpdateCollectionResponse, GetCollectionStatusResponse
)

if TYPE_CHECKING:
    from .client import RagulaClient

class CollectionsService:
    """
    Service for interacting with the Collections endpoints.
    """
    def __init__(self, client: 'RagulaClient'):
        self._client = client

    def list_collections(self) -> ListCollectionsResponse:
        """
        Lists all collections accessible by the authenticated user.

        Returns:
            List[Collection]: A list of collection objects.
        """
        return self._client._request("GET", "/collections")

    def create_collection(self, payload: CreateCollectionPayload) -> CreateCollectionResponse:
        """
        Creates a new collection.

        Args:
            payload (CreateCollectionPayload): The details for the new collection.
                - name (str): The name of the collection.
                - description (Optional[str]): An optional description.

        Returns:
            Collection: The newly created collection object.
        """
        # Use model_dump to serialize, handling optional fields and aliases
        json_payload = payload.model_dump(exclude_unset=True, by_alias=True)
        return self._client._request("POST", "/collections", json_data=json_payload)

    def get_collection(self, collection_id: str) -> GetCollectionResponse:
        """
        Retrieves details for a specific collection.

        Args:
            collection_id (str): The ID of the collection to retrieve.

        Returns:
            Collection: The collection object.
        """
        return self._client._request("GET", f"/collections/{collection_id}")

    def update_collection(self, collection_id: str, payload: UpdateCollectionPayload) -> UpdateCollectionResponse:
        """
        Updates an existing collection. Only provided fields will be updated.

        Args:
            collection_id (str): The ID of the collection to update.
            payload (UpdateCollectionPayload): The fields to update.
                - name (Optional[str]): The new name for the collection.
                - description (Optional[str]): The new description for the collection.

        Returns:
            Collection: The updated collection object.
        """
        # Use model_dump to serialize, excluding unset fields for partial update
        # and using aliases for correct JSON field names.
        json_payload = payload.model_dump(exclude_unset=True, by_alias=True)

        # The API should handle the case where json_payload is empty if allowed.
        # If not allowed, the API would return an error.
        # No need for the client to pre-emptively check for an empty payload.
        return self._client._request("PUT", f"/collections/{collection_id}", json_data=json_payload)

    def delete_collection(self, collection_id: str) -> None:
        """
        Deletes a specific collection.

        Args:
            collection_id: The ID of the collection to delete.
        """
        self._client._request("DELETE", f"/collections/{collection_id}")
        return None # Explicitly return None for 204 responses

    def get_collection_status(self, collection_id: str) -> GetCollectionStatusResponse:
        """
        Retrieves the processing status for a specific collection.

        Args:
            collection_id (str): The ID of the collection.

        Returns:
            CollectionStatus: An object containing the collection's status,
                              file count, and total size.
        """
        return self._client._request("GET", f"/collections/{collection_id}/status")
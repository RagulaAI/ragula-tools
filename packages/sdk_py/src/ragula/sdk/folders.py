from typing import TYPE_CHECKING, List, Dict, Any, Optional

if TYPE_CHECKING:
    from .client import RagulaClient

class FoldersService:
    """
    Service for interacting with the Folders endpoints.
    """
    def __init__(self, client: 'RagulaClient'):
        self._client = client

    def list_folders(self, collection_id: str, parent_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Lists folders within a specific collection. Can be filtered by parent folder ID.

        Args:
            collection_id: The ID of the collection containing the folders.
            parent_id: The ID of the parent folder to list folders from.
                       If None, lists folders at the root level of the collection.

        Returns:
            A list of folder objects.
        """
        params = {}
        if parent_id:
            params["parentId"] = parent_id
        return self._client._request("GET", f"/collections/{collection_id}/folders", params=params)

    def create_folder(self, collection_id: str, name: str, parent_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Creates a new folder within a collection.

        Args:
            collection_id: The ID of the collection where the folder will be created.
            name: The name of the new folder.
            parent_id: The ID of the parent folder. If None, the folder is created at the root.

        Returns:
            The newly created folder object.
        """
        payload = {"name": name, "parentId": parent_id}
        # The API spec requires parentId, even if null. Let's keep it.
        # payload = {k: v for k, v in payload.items() if v is not None} # Keep null parentId
        return self._client._request("POST", f"/collections/{collection_id}/folders", json_data=payload)

    def delete_folder(self, collection_id: str, folder_id: str) -> None:
        """
        Deletes a specific folder within a collection.

        Args:
            collection_id: The ID of the collection containing the folder.
            folder_id: The ID of the folder to delete.
        """
        self._client._request("DELETE", f"/collections/{collection_id}/folders/{folder_id}")
        return None # Explicitly return None for 204 responses
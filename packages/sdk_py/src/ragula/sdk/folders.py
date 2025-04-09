from typing import TYPE_CHECKING, List, Optional
from .models import Folder, CreateFolderPayload, ListFoldersResponse, CreateFolderResponse

if TYPE_CHECKING:
    from .client import RagulaClient

class FoldersService:
    """
    Service for interacting with the Folders endpoints.
    """
    def __init__(self, client: 'RagulaClient'):
        self._client = client

    def list_folders(self, collection_id: str, parent_id: Optional[str] = None) -> ListFoldersResponse:
        """
        Lists folders within a specific collection. Can be filtered by parent folder ID.

        Args:
            collection_id (str): The ID of the collection containing the folders.
            parent_id (Optional[str]): The ID of the parent folder to list folders from.
                                       If None, lists folders at the root level.

        Returns:
            List[Folder]: A list of folder objects.
        """
        params = {}
        if parent_id:
            params["parentId"] = parent_id
        return self._client._request("GET", f"/collections/{collection_id}/folders", params=params)

    def create_folder(self, collection_id: str, payload: CreateFolderPayload) -> CreateFolderResponse:
        """
        Creates a new folder within a collection.

        Args:
            collection_id (str): The ID of the collection where the folder will be created.
            payload (CreateFolderPayload): The details for the new folder.
                - name (str): The name of the new folder.
                - parent_id (Optional[str]): The ID of the parent folder. If None,
                                             the folder is created at the root.

        Returns:
            Folder: The newly created folder object.
        """
        # Use model_dump to serialize, handling optional fields and aliases.
        # parent_id=None will be correctly included as null in the JSON if set.
        json_payload = payload.model_dump(exclude_unset=True, by_alias=True)
        return self._client._request("POST", f"/collections/{collection_id}/folders", json_data=json_payload)

    def delete_folder(self, collection_id: str, folder_id: str) -> None:
        """
        Deletes a specific folder within a collection.

        Args:
            collection_id (str): The ID of the collection containing the folder.
            folder_id (str): The ID of the folder to delete.
        """
        self._client._request("DELETE", f"/collections/{collection_id}/folders/{folder_id}")
        return None # Explicitly return None for 204 responses
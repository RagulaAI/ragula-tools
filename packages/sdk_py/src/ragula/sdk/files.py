
import os
from typing import TYPE_CHECKING, List, Dict, Any, Optional, IO, Tuple

if TYPE_CHECKING:
    from .client import RagulaClient

class FilesService:
    """
    Service for interacting with the Files endpoints.
    """
    def __init__(self, client: 'RagulaClient'):
        self._client = client

    def list_files(self, collection_id: str, folder_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Lists files within a specific collection, optionally filtered by folder ID.

        Args:
            collection_id: The ID of the collection containing the files.
            folder_id: The ID of the folder to list files from.
                       If None, lists files at the root level of the collection.

        Returns:
            A list of file objects.
        """
        params = {}
        if folder_id:
            params["folderId"] = folder_id
        return self._client._request("GET", f"/collections/{collection_id}/files", params=params)

    def upload_file(
        self,
        collection_id: str,
        file_path: Optional[str] = None,
        file_content: Optional[Union[bytes, IO[bytes]]] = None,
        file_name: Optional[str] = None,
        folder_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Uploads a file to a specific collection, optionally placing it in a folder.
        You must provide either file_path OR file_content (with file_name).

        Args:
            collection_id: The ID of the collection to upload the file to.
            file_path: The local path to the file to upload.
            file_content: The content of the file as bytes or a file-like object.
                          If using this, file_name must also be provided.
            file_name: The name to give the uploaded file. Required if using file_content.
            folder_id: The ID of the folder to place the uploaded file in (optional).

        Returns:
            The file object representing the uploaded file.

        Raises:
            ValueError: If required arguments are missing or conflicting.
        """
        if not file_path and not (file_content and file_name):
            raise ValueError("Either 'file_path' or both 'file_content' and 'file_name' must be provided.")
        if file_path and file_content:
            raise ValueError("Provide either 'file_path' or 'file_content', not both.")

        data = {}
        if folder_id:
            data['folderId'] = folder_id

        files_payload: Dict[str, Tuple[Optional[str], Union[bytes, IO[bytes]]]] = {}

        if file_path:
            actual_file_name = os.path.basename(file_path)
            files_payload['file'] = (actual_file_name, open(file_path, 'rb'))
            # Note: The file handle will be closed by the requests library
        elif file_content and file_name:
             files_payload['file'] = (file_name, file_content)

        # Use the _request method with files and data parameters
        # The client's _request method handles multipart/form-data encoding
        return self._client._request(
            "POST",
            f"/collections/{collection_id}/files",
            files=files_payload,
            data=data # Send folderId as form data part
        )


    def delete_file(self, collection_id: str, file_id: str) -> None:
        """
        Deletes a specific file within a collection.

        Args:
            collection_id: The ID of the collection containing the file.
            file_id: The ID of the file to delete.
        """
        self._client._request("DELETE", f"/collections/{collection_id}/files/{file_id}")
        return None # Explicitly return None for 204 responses
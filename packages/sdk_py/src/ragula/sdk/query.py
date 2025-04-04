from typing import TYPE_CHECKING, List, Dict, Any, Optional

if TYPE_CHECKING:
    from .client import RagulaClient

class QueryService:
    """
    Service for interacting with the Query endpoints.
    """
    def __init__(self, client: 'RagulaClient'):
        self._client = client

    def query_collection(
        self,
        collection_id: str,
        query: str,
        top_k: Optional[int] = None,
        folder_ids: Optional[List[str]] = None,
        file_types: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Performs a query against a specific collection.

        Args:
            collection_id: The ID of the collection to query.
            query: The query string.
            top_k: The maximum number of results to return (optional).
            folder_ids: A list of folder IDs to filter the search by (optional).
            file_types: A list of file types (extensions) to filter the search by (optional).

        Returns:
            A dictionary containing the query results.
        """
        payload: Dict[str, Any] = {"query": query}
        if top_k is not None:
            payload["topK"] = top_k

        filter_data: Dict[str, List[str]] = {}
        if folder_ids:
            filter_data["folderIds"] = folder_ids
        if file_types:
            filter_data["fileTypes"] = file_types

        if filter_data:
            payload["filter"] = filter_data

        return self._client._request("POST", f"/collections/{collection_id}/query", json_data=payload)
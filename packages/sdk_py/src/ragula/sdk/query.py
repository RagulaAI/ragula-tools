from typing import TYPE_CHECKING, Optional
# Import QueryResponse directly, QueryCollectionResponse is an alias in models.py
from .models import QueryResponse, SimpleQueryPayload, QueryCollectionResponse

if TYPE_CHECKING:
    from .client import RagulaClient

class QueryService:
    """
    Service for interacting with the Query endpoints.
    """
    def __init__(self, client: 'RagulaClient'):
        self._client = client

    def query_collection(self, collection_id: str, query: str) -> QueryCollectionResponse:
        """
        Performs a semantic search query against a specific collection.
        Note: This uses the simplified SDK payload { "query": query }.

        Args:
            collection_id (str): The ID of the collection to query.
            query (str): The query string.

        Returns:
            QueryResponse: An object containing the query results.
        """
        # Use the simplified payload as per the Node.js SDK definition
        payload = SimpleQueryPayload(query=query)
        json_payload = payload.model_dump(by_alias=True) # Ensures correct field names if aliases were used
        return self._client._request("POST", f"/collections/{collection_id}/query", json_data=json_payload)

    def ask_question(self, collection_id: str, query: str) -> QueryCollectionResponse:
        """
        Asks a question to a specific collection (likely using RAG).
        Note: This uses the simplified SDK payload { "query": query }.

        Args:
            collection_id (str): The ID of the collection to ask the question to.
            query (str): The question string.

        Returns:
            QueryResponse: An object containing the answer or related results.
        """
        # Uses the same simplified payload structure
        payload = SimpleQueryPayload(query=query)
        json_payload = payload.model_dump(by_alias=True)
        return self._client._request("POST", f"/collections/{collection_id}/question", json_data=json_payload)
"""
ragula.ai_tool package.

This package provides a tool for integrating Ragula's knowledge base retrieval capabilities with AI models.
"""

__version__ = "0.1.0"

from typing import Dict, Any, Optional, List, TypedDict, Callable
from ragula.sdk import RagulaClient

class QueryResult(TypedDict):
    context: str

class RagulaToolParams(TypedDict):
    query: str

def ragula_tool(api_key: str, collection_id: str) -> Dict[str, Any]:
    """
    Creates a tool that fetches relevant context from a Ragula knowledge base.
    
    Args:
        api_key: Your Ragula API key
        collection_id: The ID of the Ragula collection to query
        
    Returns:
        A tool definition that can be used with AI frameworks like LangChain
    """
    def execute(params: RagulaToolParams) -> QueryResult:
        """
        Executes the tool with the given parameters.
        
        Args:
            params: The parameters for the tool execution
            
        Returns:
            A dictionary containing the context from the knowledge base
        """
        query = params.get("query")
        if not query:
            raise ValueError("Query parameter is required")
            
        client = RagulaClient(token=api_key)
        
        try:
            response = client.query.query_collection(
                collection_id=collection_id,
                query=query
            )
            
            if not response:
                return {"context": ""}
                
            results = response.get("results", [])
            
            context = ""
            for result in results:
                if content_snippet := result.get("contentSnippet"):
                    context += f"\n\n{content_snippet}"
                    
            return {"context": context.strip()}
            
        except Exception as e:
            raise RuntimeError(f"Error fetching context: {str(e)}")
    
    return {
        "name": "knowledgebase",
        "description": "Fetch additional context from the knowledgebase for the provided search query.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "A string to find more information in the knowledgebase"
                }
            },
            "required": ["query"]
        },
        "execute": execute
    }
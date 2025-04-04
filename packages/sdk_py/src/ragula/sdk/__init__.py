"""
Ragula Python SDK

This SDK provides a Python interface to the Ragula REST API.
"""

__version__ = "0.1.0" # Initial version

from .client import RagulaClient, RagulaError
from .collections import CollectionsService
from .folders import FoldersService
from .files import FilesService
from .query import QueryService

__all__ = [
    "RagulaClient",
    "RagulaError",
    "CollectionsService",
    "FoldersService",
    "FilesService",
    "QueryService",
]

# Optional: Configure logging for the library
import logging
logging.getLogger(__name__).addHandler(logging.NullHandler())
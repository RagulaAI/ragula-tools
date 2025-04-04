"""
Tests for the greet module.
"""

import unittest
from ragula.langchain_tool import greet_langchain_tool


class TestGreet(unittest.TestCase):
    """Test cases for the greet module."""

    def test_greet_langchain_tool(self):
        """Test that greet_langchain_tool returns the expected greeting."""
        self.assertEqual(greet_langchain_tool(), "Hello from ragula.langchain_tool!")


if __name__ == "__main__":
    unittest.main()
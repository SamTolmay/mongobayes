"""Mongobayes."""
import pymongo


class Mongobayes:
    """Naive bayesian classifier implemented in mongodb."""

    def __init__(self, name, uri=None):
        """
        Initialise Mongobayes clasifier.

        Connect to a mongodb instance using the specified uri.
        If no uri is specified, connects to localhost, port 27017 (mongdb default).
        name is name of the classifier. A mongodb database with this name is created in the connected
        mongodb server.
        """
        self.name = name
        if uri:
            self.db = pymongo.MongoClient(uri)[name]
        else:
            self.db = pymongo.MongoClient()[name]

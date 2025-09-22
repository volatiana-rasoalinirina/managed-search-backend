import csv
import secrets

import requests

from rest_framework.views import APIView
from rest_framework.response import Response

from elasticsearch import helpers, Elasticsearch

ES_CLIENT = Elasticsearch(hosts=[{'host': 'localhost', 'port': 9200, 'scheme': 'http'}])
class UploadFileView(APIView):

    def post(self, request):
        try:
            index_name = secrets.token_hex(6)
            ES_CLIENT.indices.create(index=index_name)
        except Exception as e:
            return Response({'error': f'Failed to create Elasticsearch index: {str(e)}'}, status=500)
        # Index the data from the request csv file
        csv_file = request.FILES['file']
        if not csv_file:
            return Response({'error': 'No file provided'})
        decoded_file = csv_file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        actions = [{"_index": index_name, "_source": row } for row in reader]
        try:
            helpers.bulk(ES_CLIENT, actions)
            ES_CLIENT.indices.refresh(index=index_name)
        except Exception as e:
            return Response({'error': f'Failed to index {str(e)}'}, status=500)
        # return the success response which is the search url
        search_url = f"/api/search/{index_name}/"
        return Response({
            'search_url': search_url,
            'index_name': index_name,
        }, status=201)

class SearchView(APIView):

    def get(self, request, index_name):
        query = request.query_params.get('q', None)
        if not query:
            return Response({'error': 'No query provided'})
        search_body = {
            'query': {
                'multi_match': {
                    'query': query,
                    'fields': ['*']
                }
            }
        }
        try:
            result = ES_CLIENT.search(index=index_name, body=search_body)
            return Response(result['hits']['hits'])
        except Exception as e:
            return Response({'error': str(e)}, status=500)
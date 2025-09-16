import requests
from rest_framework.views import APIView
from rest_framework.response import Response


PROVISIONING_URL = 'http://localhost:3001/provision-index'
class UploadFileView(APIView):

    def post(self, request):
        # Call provisioning service for creating index
        response = requests.post(PROVISIONING_URL)
        # Index the data from the request csv file
        # return the success response which is the search url
        # breakpoint()
        return Response(response.json())
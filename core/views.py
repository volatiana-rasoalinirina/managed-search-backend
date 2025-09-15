from rest_framework.views import APIView
from rest_framework.response import Response


class UploadFileView(APIView):

    def post(self, request):
        # Call provisioning service for creating index
        # Index the data from the request csv file
        # return the success response which is the search url
        return Response('TODO')
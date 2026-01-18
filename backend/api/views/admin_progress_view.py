from rest_framework import viewsets, status
from rest_framework.response import Response
from api.permissions import IsAdmin

from api.models import ProjectProgress
from api.serializers import ProjectProgressUpdateSerializer


class AdminProgressViewSet(viewsets.ViewSet):
    permission_classes = [IsAdmin]

    def update(self, request, pk=None):
        try:
            progress = ProjectProgress.objects.get(pk=pk)
        except ProjectProgress.DoesNotExist:
            return Response(
                {"detail": "Progress not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProjectProgressUpdateSerializer(
            progress,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Progress updated successfully."},
            status=status.HTTP_200_OK
        )

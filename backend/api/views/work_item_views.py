from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.models import WorkItem
from api.serializers.work_item_serializer import WorkItemSerializer


class WorkItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing work items
    """
    queryset = WorkItem.objects.all()
    serializer_class = WorkItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = WorkItem.objects.all()
        category = self.request.query_params.get('category', None)
        if category is not None and category != 'all':
            queryset = queryset.filter(category=category)
        return queryset

    def perform_create(self, serializer):
        # Set the main image to be the after image if provided
        after_image = self.request.FILES.get('after_image')
        if after_image:
            serializer.save(image=after_image)
        else:
            # If no after image, save without main image (it's optional now)
            serializer.save()

    def perform_update(self, serializer):
        # Set the main image to be the after image if provided
        after_image = self.request.FILES.get('after_image')
        if after_image:
            serializer.save(image=after_image)
        else:
            # If no after image, save without updating main image
            serializer.save()


@api_view(['GET'])
def get_work_items(request):
    """
    Get all work items for public display
    """
    try:
        category = request.query_params.get('category', 'all')
        queryset = WorkItem.objects.all()
        
        if category != 'all':
            queryset = queryset.filter(category=category)
        
        serializer = WorkItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': 'Internal server error: ' + str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

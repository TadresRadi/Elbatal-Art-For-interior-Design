import time
from django.core.cache import cache
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework import status

class RateLimitMiddleware(MiddlewareMixin):
    """Custom rate limiting middleware"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        super().__init__(get_response)
    
    def process_request(self, request):
        # Skip rate limiting for admin users
        if hasattr(request, 'user') and request.user.is_authenticated:
            if request.user.is_staff or request.user.is_superuser:
                return None
        
        # Get client IP
        ip_address = self.get_client_ip(request)
        
        # Rate limit: 100 requests per minute per IP
        limit = 100
        window = 60  # seconds
        
        cache_key = f"rate_limit:{ip_address}"
        requests = cache.get(cache_key, [])
        
        # Remove old requests outside the window
        current_time = time.time()
        requests = [req_time for req_time in requests if current_time - req_time < window]
        
        if len(requests) >= limit:
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'message': f'Maximum {limit} requests per {window} seconds allowed'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        # Add current request
        requests.append(current_time)
        cache.set(cache_key, requests, window)
        
        return None
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SecurityHeadersMiddleware(MiddlewareMixin):
    """Add security headers to responses"""
    
    def process_response(self, request, response):
        # Security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        # CSP header (Content Security Policy)
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        )
        response['Content-Security-Policy'] = csp
        
        return response


class InputValidationMiddleware(MiddlewareMixin):
    """Basic input validation middleware"""
    
    def process_request(self, request):
        # Skip validation for safe methods
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return None
        
        # Check for potentially dangerous content
        if hasattr(request, 'body') and request.body:
            body_str = request.body.decode('utf-8', errors='ignore').lower()
            
            # Basic XSS patterns
            xss_patterns = [
                '<script', 'javascript:', 'onload=', 'onerror=',
                'onclick=', 'onmouseover=', 'onfocus=', 'onblur=',
                'eval(', 'expression('
            ]
            
            for pattern in xss_patterns:
                if pattern in body_str:
                    return JsonResponse({
                        'error': 'Invalid input detected',
                        'message': 'Request contains potentially dangerous content'
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        return None

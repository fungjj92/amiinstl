"""
WSGI config for amiinstl project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os
import psycopg2
import urlparse


from django.core.wsgi import get_wsgi_application
from dj_static import Cling

application = Cling(get_wsgi_application())

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "amiinstl.settings")

application = Cling(get_wsgi_application())

urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse(os.environ["postgres://rhywvyexvbbocs:Tw_MI1MN5Z2ZM1PpTUdPxo_RH9@ec2-107-21-114-132.compute-1.amazonaws.com:5432/d694503bvgu2ue"])

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

#!/usr/bin/env bash

gunicorn wsgi:api --bind 0.0.0.0:5000 --log-level=debug --workers=4 --timeout=120 --graceful-timeout=120
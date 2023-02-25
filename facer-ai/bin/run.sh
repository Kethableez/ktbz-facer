#!/usr/bin/env bash

gunicorn wsgi:app --bind 0.0.0.0:9000 --log-level=debug --workers=4 --timeout=120 --graceful-timeout=120
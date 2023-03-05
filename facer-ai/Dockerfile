FROM python:3.9.0-slim as facer-ai

RUN apt-get update && apt-get install -y build-essential cmake protobuf-compiler ffmpeg libsm6 libxext6

COPY requirements.txt requirements.txt

RUN pip install -U pip && pip install -r requirements.txt

ENV DOCKER=True

COPY ./bin /ai/bin
COPY ./src /ai/src
COPY .env /ai/.env
COPY app.py /ai/app.py
COPY wsgi.py /ai/wsgi.py

WORKDIR /ai

EXPOSE 5000

ENTRYPOINT ["bash", "/ai/bin/run.sh"]
# ENTRYPOINT ["python", "/ai/app.py"]
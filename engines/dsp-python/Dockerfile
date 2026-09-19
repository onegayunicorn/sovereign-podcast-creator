FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml .
COPY dsp/ ./dsp/
RUN pip install --no-cache-dir -e .
EXPOSE 5000
CMD ["python", "-c", "print('Sovereign DSP Engine ready'); import time; time.sleep(3600)"]

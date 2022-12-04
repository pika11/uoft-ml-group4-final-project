# Deploy instructions

```
gcloud functions deploy predictions \
 --gen2 \
 --region=us-central1 \
 --runtime=python39 \
 --source=. \
 --trigger-http \
 --memory=1024
```

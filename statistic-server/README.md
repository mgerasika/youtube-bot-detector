1 gcloud init

https://cloud.google.com/sdk/docs/install-sdk#deb
2 curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
3 echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
4 sudo apt-get update && sudo apt-get install google-cloud-cli
5 gsutil cors set cors.json gs://ybot-detector.firebasestorage.app
# Makefile for Quota Manager Frontend

APP_NAME := quota-manager-frontend
VERSION := 1.0.0
REGISTRY := crpi-j8wrd0nl8l9v42wd.cn-shenzhen.personal.cr.aliyuncs.com/shenma-ai
IMAGE := $(REGISTRY)/$(APP_NAME):$(VERSION)
LATEST_IMAGE := $(REGISTRY)/$(APP_NAME):latest
NAMESPACE := shenma

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  dev              - Start development server"
	@echo "  build            - Build frontend project"
	@echo "  docker-build     - Build Docker image"
	@echo "  docker-push      - Push Docker image to registry"
	@echo "  docker-run       - Run Docker container locally"
	@echo "  compose-up       - Start Docker Compose services"
	@echo "  compose-down     - Stop Docker Compose services"
	@echo "  k8s-apply        - Deploy to Kubernetes"
	@echo "  k8s-delete       - Delete from Kubernetes"
	@echo "  deploy           - Build, push and deploy"

.PHONY: dev
dev:
	npm run dev

.PHONY: build
build:
	npm run build

.PHONY: docker-build
docker-build:
	docker build -t $(IMAGE) -t $(LATEST_IMAGE) .

.PHONY: docker-push
docker-push: docker-build
	docker push $(IMAGE)
	docker push $(LATEST_IMAGE)

.PHONY: docker-run
docker-run:
	docker run -d -p 3000:80 --name $(APP_NAME) $(LATEST_IMAGE)

.PHONY: compose-up
compose-up:
	docker-compose up -d

.PHONY: compose-down
compose-down:
	docker-compose down

.PHONY: k8s-apply
k8s-apply:
	kubectl apply -f k8s-deployment.yaml

.PHONY: k8s-delete
k8s-delete:
	kubectl delete -f k8s-deployment.yaml

.PHONY: deploy
deploy: docker-build docker-push k8s-apply
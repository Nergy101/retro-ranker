# Retro Ranker Makefile
# A comprehensive Makefile for development, testing, and deployment

.PHONY: help start check build preview update refresh-all sources generate-devices patch-devices scrape sitemap docker-build docker-run docker-push clean

# Default target
.DEFAULT_GOAL := help

# Variables
DOCKER_IMAGE_NAME = retro-ranker
DOCKER_TAG = latest
DOCKER_REPO = nergy101/retro-ranker

# Help command
help:
	@echo "Retro Ranker Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  help             Show this help message"
	@echo "  start            Start the development server"
	@echo "  check            Format, lint and type-check code"
	@echo "  build            Build for production"
	@echo "  preview          Preview production build"
	@echo "  update           Update Fresh framework"
	@echo "  refresh-all      Refresh all data"
	@echo "  sources          Get new data sources"
	@echo "  generate-devices Generate device data"
	@echo "  patch-devices    Patch device data"
	@echo "  scrape           Scrape device images"
	@echo "  sitemap          Generate sitemap.xml"
	@echo "  docker-build     Build Docker image"
	@echo "  docker-run       Run Docker container locally"
	@echo "  docker-push      Push Docker image to registry"
	@echo "  clean            Clean generated files"

# Development commands
start:
	deno task start

check:
	deno task check

build:
	deno task build

preview:
	deno task preview

update:
	deno task update

# Data management commands
refresh-all:
	deno task refresh-all

sources:
	deno task sources

generate-devices:
	deno task generate-devices

patch-devices:
	deno task patch-devices

scrape:
	deno task scrape

sitemap:
	deno task sitemap

# Docker commands
docker-build:
	docker build -t $(DOCKER_IMAGE_NAME):$(DOCKER_TAG) .

docker-run:
	docker run -p 8000:8000 $(DOCKER_IMAGE_NAME):$(DOCKER_TAG)

docker-push:
	docker tag $(DOCKER_IMAGE_NAME):$(DOCKER_TAG) $(DOCKER_REPO):$(DOCKER_TAG)
	docker push $(DOCKER_REPO):$(DOCKER_TAG)

# Utility commands
clean:
	rm -rf _fresh
	find . -name "*.orig" -delete
	find . -name "*.bak" -delete
	find . -name "*.log" -delete

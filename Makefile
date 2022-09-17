ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
VERSION := $(shell yq e ".version" manifest.yaml)
S9PK_PATH=$(shell find . -name jam.s9pk -print)

# delete the target of a rule if it has changed and its recipe exits with a nonzero exit status
.DELETE_ON_ERROR:

all: verify

verify: jam.s9pk $(S9PK_PATH)
	embassy-sdk verify s9pk $(S9PK_PATH)

install: all 
	embassy-cli package install jam.s9pk

clean:
	rm -f jam.s9pk
	rm -f image.tar
	rm -f scripts/*.js

jam.s9pk: manifest.yaml assets/compat/* image.tar scripts/embassy.js docs/instructions.md $(ASSET_PATHS)
	embassy-sdk pack

image.tar: Dockerfile docker_entrypoint.sh assets/utils/*
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/jam/main:$(VERSION) --platform=linux/arm64 -o type=docker,dest=image.tar .

scripts/embassy.js: scripts/**/*.ts
	deno bundle scripts/embassy.ts scripts/embassy.js

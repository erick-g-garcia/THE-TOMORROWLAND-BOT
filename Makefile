.PHONY: help setup format test
.DEFAULT_GOAL := help
NAME := tml-defender
VERSION := $(shell git show -s --format=%h)

help: # Display the application manual
	@echo -e "$(NAME) version \033[33m$(VERSION)\n\e[0m"
	@echo -e "\033[1;37mUSAGE\e[0m"
	@echo -e "  \e[4mmake\e[0m <command> [<arg1>] ... [<argN>]\n"
	@echo -e "\033[1;37mAVAILABLE COMMANDS\e[0m"
	@grep -E '^[a-zA-Z_-]+:.*?# .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?# "}; {printf "  \033[32m%-20s\033[0m %s\n", $$1, $$2}'

setup: check-deps # Setup dependencies and development configuration
	npm install

format: # Run code style autoformatter
	./node_modules/.bin/prettier --write --cache --ignore-unknown --single-quote games/ *.js *.json

test: # Run tests
	npm test

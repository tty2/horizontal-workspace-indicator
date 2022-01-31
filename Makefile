##@ Test
lint: ## Run linters only.
	@echo -e "\033[2m→ Run linters...\033[0m"

test: ## Run go tests for files with tests.
	@echo -e "\033[2m→ Run tests for all files...\033[0m"

check: lint test ## Run full check: lint and test.

##@ Deploy
zip: ## Make zip file for deploy to https://extensions.gnome.org/upload/.
	@echo -e "\033[2m→ Making zip file...\033[0m"
	zip horizontal-workspace-indicatortty2.io.zip metadata.json extension.js stylesheet.css LICENSE

##@ Other
#------------------------------------------------------------------------------
help:  ## Display help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
#------------- <https://suva.sh/posts/well-documented-makefiles> --------------

.DEFAULT_GOAL := help
.PHONY: help lint test check build install run
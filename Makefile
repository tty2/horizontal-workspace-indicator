##@ Deploy
zip: compile-schemas ## Make zip file for deploy to https://extensions.gnome.org/upload/.
	@echo -e "\033[2m→ Making zip file...\033[0m"
	zip horizontal-workspace-indicatortty2.io.zip metadata.json extension.js stylesheet.css prefs.js \
		LICENSE \
		schemas/gschemas.compiled \
		schemas/org.gnome.shell.extensions.nothing-to-say.gschema.xml

compile-schemas: ## Compile all in schemas folder
	glib-compile-schemas --strict schemas/

install: compile-schemas ## Copy to extensions directory for debug.
	cp -r * ~/.local/share/gnome-shell/extensions/horizontal-workspace-indicator@tty2.io

##@ Other
#------------------------------------------------------------------------------
help:  ## Display help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
#------------- <https://suva.sh/posts/well-documented-makefiles> --------------

.DEFAULT_GOAL := help
.PHONY: help zip compile-schemas install

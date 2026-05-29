POSTS := $(patsubst blog/%.md,blog/%.html,$(wildcard blog/*.md))

all: $(POSTS)

blog/%.html: blog/%.md blog/template.html
	if grep -q '^title:' "$<"; then \
		pandoc "$<" --template=blog/template.html -o "$@"; \
	else \
		default_title=$$(echo "$*" | awk '{print toupper(substr($$0,1,1)) substr($$0,2)}'); \
		pandoc "$<" --template=blog/template.html --metadata title="$$default_title" -o "$@"; \
	fi

watch:
	find blog -name '*.md' -o -name 'template.html' | entr make

clean:
	rm -f $(POSTS)

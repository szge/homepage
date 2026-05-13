POSTS := $(patsubst blog/%.md,blog/%.html,$(wildcard blog/*.md))

all: $(POSTS)

blog/%.html: blog/%.md blog/template.html
	title=$$(echo "$*" | awk '{print toupper(substr($$0,1,1)) substr($$0,2)}'); \
	pandoc "$<" --template=blog/template.html --metadata title="$$title" -o "$@"

clean:
	rm -f $(POSTS)

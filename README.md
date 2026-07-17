## Local development

Requires pandoc and entr (`brew install pandoc entr`).

Build all blog posts: `make`

Rebuild from scratch: `make clean && make`

Watch for changes: `make watch`

Blog posts are written as `.md` files in `blog/`. The title is derived from the filename by default, but you can also declare a title by adding a `title: Your Title` line at the top of the file (a pandoc YAML metadata field).

Generated `.html` files in `blog/` are gitignored and are not committed.

## Production (Vercel)

- Just add the project in Vercel and deploy — `vercel.json` runs `build.sh` on every deployment, which downloads a static pandoc binary and runs `make` to regenerate the blog HTML from markdown before the site is served. No extra configuration needed.

todo:
- [ ] separate out project into base template + fork

Requires pandoc and entr (`brew install pandoc entr`).

Build all blog posts: `make`

Rebuild from scratch: `make clean && make`

Watch for changes: `make watch`

Blog posts are written as `.md` files in `blog/`. The title is derived from the filename.

todo:
- [ ] separate out project into base template + fork
- [ ] remove .html files from git tracking (.gitignore) and have them rather be built
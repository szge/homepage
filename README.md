Requires pandoc and entr (`brew install pandoc entr`).

Build all blog posts: `make`

Rebuild from scratch: `make clean && make`

Watch for changes: `make watch`

Blog posts are written as `.md` files in `blog/`. The title is derived from the filename.

Generated `.html` files in `blog/` are gitignored and are not committed. On
every Vercel deployment, `build.sh` downloads a static pandoc binary (the
build image doesn't have pandoc preinstalled) and runs `make` to regenerate
them from the `.md` sources before the site is served.

todo:
- [ ] separate out project into base template + fork
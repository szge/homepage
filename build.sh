#!/bin/bash
set -euo pipefail

PANDOC_VERSION=3.1.11
PANDOC_DIR="pandoc-${PANDOC_VERSION}"

if ! command -v pandoc >/dev/null 2>&1; then
    echo "Downloading pandoc ${PANDOC_VERSION}..."
    curl -sSL -o pandoc.tar.gz \
        "https://github.com/jgm/pandoc/releases/download/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-linux-amd64.tar.gz"
    tar xzf pandoc.tar.gz
    export PATH="$PWD/${PANDOC_DIR}/bin:$PATH"
fi

pandoc --version | head -1
make clean
make

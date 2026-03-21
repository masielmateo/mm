#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# install.sh — installer for claude-ads
# Usage: curl -fsSL https://raw.githubusercontent.com/AgriciDaniel/claude-ads/main/install.sh | bash
# ============================================================

REPO="AgriciDaniel/claude-ads"
INSTALL_DIR="${HOME}/.claude-ads"
BIN_DIR="${HOME}/.local/bin"
BINARY_NAME="claude-ads"

# ---------- helpers -----------------------------------------

info()    { printf '\033[0;34m[INFO]\033[0m  %s\n' "$*"; }
success() { printf '\033[0;32m[OK]\033[0m    %s\n' "$*"; }
warn()    { printf '\033[0;33m[WARN]\033[0m  %s\n' "$*" >&2; }
error()   { printf '\033[0;31m[ERROR]\033[0m %s\n' "$*" >&2; exit 1; }

require() {
  command -v "$1" >/dev/null 2>&1 || error "'$1' is required but not installed."
}

# ---------- pre-flight checks --------------------------------

info "Checking dependencies..."
require curl
require git

OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Linux)  PLATFORM="linux" ;;
  Darwin) PLATFORM="darwin" ;;
  *)      error "Unsupported OS: $OS" ;;
esac

case "$ARCH" in
  x86_64|amd64) ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *)             error "Unsupported architecture: $ARCH" ;;
esac

info "Detected platform: ${PLATFORM}/${ARCH}"

# ---------- fetch latest release tag -------------------------

info "Fetching latest release from ${REPO}..."
LATEST_TAG="$(
  curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
  | grep '"tag_name"' \
  | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/'
)" || error "Could not determine latest release tag."

if [ -z "$LATEST_TAG" ]; then
  warn "No release found; falling back to main branch."
  LATEST_TAG="main"
fi

info "Latest release: ${LATEST_TAG}"

# ---------- download -----------------------------------------

TARBALL_URL="https://github.com/${REPO}/releases/download/${LATEST_TAG}/${BINARY_NAME}-${PLATFORM}-${ARCH}.tar.gz"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

info "Downloading ${TARBALL_URL}..."
if ! curl -fsSL "$TARBALL_URL" -o "${TMP_DIR}/${BINARY_NAME}.tar.gz" 2>/dev/null; then
  warn "Pre-built binary not available; cloning source..."
  git clone --depth 1 "https://github.com/${REPO}.git" "${TMP_DIR}/source"
  SOURCE_CLONE=true
else
  SOURCE_CLONE=false
  tar -xzf "${TMP_DIR}/${BINARY_NAME}.tar.gz" -C "$TMP_DIR"
fi

# ---------- install ------------------------------------------

mkdir -p "$INSTALL_DIR" "$BIN_DIR"

if [ "$SOURCE_CLONE" = true ]; then
  cp -r "${TMP_DIR}/source/." "$INSTALL_DIR/"
  info "Installed source to ${INSTALL_DIR}"
  # Create a simple launcher if a main entry point exists
  for entry in main.sh run.sh cli.sh "${BINARY_NAME}.sh"; do
    if [ -f "${INSTALL_DIR}/${entry}" ]; then
      chmod +x "${INSTALL_DIR}/${entry}"
      ln -sf "${INSTALL_DIR}/${entry}" "${BIN_DIR}/${BINARY_NAME}"
      break
    fi
  done
else
  if [ -f "${TMP_DIR}/${BINARY_NAME}" ]; then
    install -m 0755 "${TMP_DIR}/${BINARY_NAME}" "${BIN_DIR}/${BINARY_NAME}"
  else
    error "Binary '${BINARY_NAME}' not found in downloaded archive."
  fi
fi

# ---------- PATH reminder ------------------------------------

if ! echo "$PATH" | grep -q "$BIN_DIR"; then
  warn "${BIN_DIR} is not in your PATH."
  warn "Add the following line to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
  warn "  export PATH=\"\$PATH:${BIN_DIR}\""
fi

success "claude-ads ${LATEST_TAG} installed successfully!"
info "Run '${BINARY_NAME} --help' to get started."

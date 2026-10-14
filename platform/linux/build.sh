#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../desktop"
npm install
npx electron-builder --linux deb rpm tar.gz AppImage

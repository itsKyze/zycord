#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../desktop"
npm install
npx electron-builder --mac dmg zip

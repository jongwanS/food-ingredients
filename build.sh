#!/bin/bash
npm run build
mkdir -p build
cp -r dist/* build/
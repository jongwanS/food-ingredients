#!/bin/bash
npm run build
mkdir -p public
cp -r dist/* public/
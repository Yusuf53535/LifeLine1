#!/bin/bash
# Mac + Xcode gerekir. Önce: brew install xcodegen
set -e
cd "$(dirname "$0")"
xcodegen generate
rm -rf build Payload LifeLine.ipa
xcodebuild -project LifeLine.xcodeproj -scheme LifeLine -configuration Release \
  -sdk iphoneos -derivedDataPath build \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY="" build
mkdir Payload
cp -R build/Build/Products/Release-iphoneos/LifeLine.app Payload/
zip -qr LifeLine.ipa Payload
rm -rf Payload
echo "Hazır: LifeLine.ipa (imzasız - Sideloadly / AltStore ile imzalayıp yükleyebilirsin)"

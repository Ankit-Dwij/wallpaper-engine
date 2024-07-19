#!/bin/bash
mkdir -p layer/bin
cd layer/bin
rm -rf *
curl -O https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz
tar -xf ffmpeg-git-amd64-static.tar.xz
mv ffmpeg-git-*-amd64-static/ffmpeg .
rm -rf ffmpeg-git-*-amd64-static ffmpeg-git-amd64-static.tar.xz
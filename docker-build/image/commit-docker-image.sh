#!/bin/bash

new_version=$(date '+%Y%m%d.%H%M%S')
script_dir=$(dirname "$0")
yaml_file="$script_dir/docker-compose-template.yml"

# 判斷是否為 rootless Docker 模式
# Determine if it's rootless Docker mode
is_rootless() {
    docker info 2>&1 | grep -q "Rootless: true"
}

SUDO_CMD=""
if ! is_rootless; then
    SUDO_CMD="sudo"
fi

# ========

# Get the line starting with "image:"
image_line=$(awk '/^ *image:/ {print $0}' "$yaml_file")

# Extract the string before the last "-"
image_config=$(echo "$image_line" | rev | cut -d'-' -f2- | rev)

# Replace the line with the new version
sed -i "s|^ *image:.*|${image_config}-${new_version}|" "$yaml_file"

# ========

IMAGE_NAME=$(awk '/^ *image:/ {sub(/^ *image: */, ""); sub(/ *$/, ""); print $0}' "$yaml_file")

CONTAINER_NAME=$(awk -F= '/^ *- CONTAINER_NAME=/ {gsub(/ /,"",$2); print $2}' "$yaml_file")

# 根據是否為 rootless 模式，決定是否使用 sudo
# Use sudo conditionally based on whether it's rootless mode
${SUDO_CMD} docker tag ${CONTAINER_NAME} ${IMAGE_NAME}
${SUDO_CMD} docker push "${IMAGE_NAME}"

# =========

git add .
git commit -m "${new_version}"
git push --force-with-lease

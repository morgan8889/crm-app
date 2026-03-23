#!/bin/bash
# Auto-format files after write using Biome
FILE_PATH=$(echo "$1" | jq -r '.tool_input.file_path // empty')
if [ -n "$FILE_PATH" ] && [[ "$FILE_PATH" == *.ts || "$FILE_PATH" == *.tsx ]]; then
  npx biome format --write "$FILE_PATH" 2>/dev/null
fi
exit 0

#!/bin/bash

grep -R "Parsing error" build.log | awk -F: '{print $1}' | sort -u | while read file; do
  echo "Stubbing $file"
  echo "export default function Page() { return null }" > "$file"
done

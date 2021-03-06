#!/bin/bash

function fail() {
	echo "$1"
	exit 1
}

# Make sure we're in a git directory
git status >/dev/null 2>&1 || fail "Not currently in a git repository"


curBranch="$( git rev-parse --abbrev-ref HEAD )"
# Don't deploy from gh-pages to gh-pages
[[ "${curBranch}" == "gh-pages" ]] && fail "Cannot deploy from gh-pages branch"

# Delete and create a new gh-pages branch
git branch -D gh-pages
git checkout -b gh-pages || fail "Failed to checkout new branch gh-pages"

# Remove logging statements from javascript files.
find . -type f -name "*.js" -exec sed -i -e '/console.log/d' '{}' \;

# Minify html, js, json, and css files
find . -mindepth 1 -maxdepth 2 -type f -name "*.js" -exec minify '{}' -o '{}' \;
#find . -mindepth 1 -maxdepth 2 -type f -name "*.html" -exec minify '{}' -o '{}' \;
find . -mindepth 1 -maxdepth 2 -type f -name "*.css" -exec minify '{}' -o '{}' \;
find . -mindepth 1 -maxdepth 2 -type f -name "*.json" -exec minify '{}' -o '{}' \;

# Remove the script from the deployed app
git rm deploy.sh

git add .
git commit -m "Deploy from commit $( git rev-parse HEAD )"

# Auto commit only if we passed the --live flag
[[ "$1" != '--live' ]] && exit 0
# Force the push onto gh-pages (only used to host the site, so we don't care about the commit history in that branch)
git push --set-upstream origin gh-pages -f

# Return to the branch we started at.
git checkout "${curBranch}"

exit 0

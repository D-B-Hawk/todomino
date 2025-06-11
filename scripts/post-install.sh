eval "$(ssh-agent -s)"

ssh-add ~/.ssh/macm1gh

SIGNING_KEY="$(cat ~/.ssh/macm1gh.pub)"

git config --global user.name "Derrick Hawkins"
git config --global user.email "derrick.b.hawkins@gmail.com"
git config --global user.signingkey "$SIGNING_KEY"
git config --global gpg.format ssh
git config --global commit.gpgsign true

# 6. Verify setup
echo "=== SIGNING KEY CONFIGURED AS ==="
git config --global user.signingkey
echo "=== SSH AGENT KEYS ==="
ssh-add -L

pnpm i
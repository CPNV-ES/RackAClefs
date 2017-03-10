git config --global user.email "contact@redkill2108.me"
git config --global user.name "Redkill2108"
git add -f .
git remote add update https://redkill:$GITHUB_API_KEY@github.com/CPNV-ES/RackAClefs.git
git add -f .
git commit -m "Travis CI build $TRAVIS_BUILD_NUMBER pushed [skip ci]"
git push -fq update master > /dev/null
echo -e "Done\n"
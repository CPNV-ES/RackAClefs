git config --global user.email "contact@redkill2108.me"
git config --global user.name "Redkill2108"
git remote add update https://redkill:$GITHUB_API_KEY@github.com/CPNV-ES/RackAClefs.git
git add .
git commit -m "Travis CI build $TRAVIS_BUILD_NUMBER pushed [skip ci]"
git push -f update master
echo -e "Done with build number: $TRAVIS_BUILD_NUMBER\n"
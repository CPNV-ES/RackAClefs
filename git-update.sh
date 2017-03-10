git add -f .
git remote add update https://redkill:dbb8f430d19aa36b3cdb7b8496a102ff863159a3@github.com/CPNV-ES/RackAClefs.git
git add -f .
git commit -m "Travis CI build $TRAVIS_BUILD_NUMBER pushed [skip ci]"
git push -fq update master > /dev/null
echo -e "Done\n"
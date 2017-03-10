git add -f .
git remote add update https://redkill:b66d4d179d20835a5020872384abd0d17c763a8b@github.com/CPNV-ES/RackAClefs.git
git add -f .
git commit -m "Travis CI build $TRAVIS_BUILD_NUMBER pushed [skip ci]"
git push -fq update master > /dev/null
echo -e "Done\n"
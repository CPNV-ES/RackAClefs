git add -f .
git remote add update https://redkill2108:API_TOKEN@github.com/CPNV-ES/RackAClefs.git
git add -f .
git commit -m "Travis CI build $TRAVIS_BUILD_NUMBER pushed [skip ci]"
git oush -fq update master > /dev/null
echo -e "Done\n"
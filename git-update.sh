git add -f .
git remote add update https://redkill:db003b488f3f4ef20cf487b94babbf6b4d74974f@github.com/CPNV-ES/RackAClefs.git
git add -f .
git commit -m "Travis CI build $TRAVIS_BUILD_NUMBER pushed [skip ci]"
git push -fq update master > /dev/null
echo -e "Done\n"
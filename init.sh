rm -r Packages
rm -r Packages.bz2
dpkg-scanpackages -m ./packages > Packages
bzip2 Packages
dpkg-scanpackages -m ./packages > Packages

deploy () {
# ng serve --delete-output-path=false  -o
 git add . ;
 git commit -m "$1" ;
 git push ;
 # https://github.com/angular/angular-cli/issues/5618#issuecomment-348225508
 npm run ng-high-mem -- build --prod;
 # firebase deploy;
 # ng build --prod ;
# node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --target=production;
# ng build --prod ; firebase deploy;
   return 0
 firebase deploy —-only hosting ;
}
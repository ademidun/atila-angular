deploy () {
# ng serve --delete-output-path=false  -o
 git add . ;
 git commit -m "$1" ;
 git push ;
 ng build --prod ;
firebase deploy;
# ng build --prod ; firebase deploy;
 # firebase deploy —-only hosting ;
# node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --target=production
   return 0
}
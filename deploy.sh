deploy () {
# ng serve --delete-output-path=false  -o
 git add . ;
 git commit -m "$1" ;
 git push ;
 ng build --prod ;
firebase deploy;
 # firebase deploy —-only hosting ;

   return 0
}
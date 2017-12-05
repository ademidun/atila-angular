deploy () {

 git add . ;
 git commit -m "$1" ;
 git push ;
 ng build --prod ;
 firebase deploy ;

   return 0
}
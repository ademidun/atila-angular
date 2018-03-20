deploy () {
# ng serve --delete-output-path=false  -o
 git add . ;
 git commit -m "$1" ;
 git push ;
 # https://github.com/angular/angular-cli/issues/5618#issuecomment-348225508
 npm run ng-high-mem -- build --prod;

 # ng build --prod ;
# node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --target=production;
# ng build --prod ; firebase deploy;
 # firebase deploy;
 firebase deploy --only hosting ;
   return 0
}

just_deploy(){
npm run ng-high-mem -- build --prod;
firebase deploy --only hosting ;
}
test_args(){
only_hosting=false
	case $2 in
        h) ${only_hosting}=true;;
    esac

    if ${only_hosting}; then

    echo "firebase deploy --only hosting $1, $2";
#    firebase deploy --only hosting ;
else
    echo "firebase deploy $1, $2";
#    firebase deploy;
fi
return 0;
}


test_args(){

only_hosting=false
while getopts :ht opt; do
    case $opt in
#        h) show_some_help; exit ;;
        o) ${only_hosting}=true ;;
        :) echo "Missing argument for option -$OPTARG"; exit 1;;
       \?) echo "Unknown option -$OPTARG"; exit 1;;
       *) echo "$opt $OPTARG" ;;
    esac
done

# here's the key part: remove the parsed options from the positional params
shift $(( OPTIND - 1 ))

# now, $1=="git", $2=="pull"

    if $only_hosting; then

    echo "firebase deploy --only hosting $1, $2"
#    firebase deploy --only hosting ;
    else
        echo "firebase deploy $1 $2";
    #    firebase deploy;
fi



return 0;
}

# Version control

## Structure of the commits

[author]_[branch_name]_[commit_type]_[short_description]optional_long_description
commit types

-   FIX : fixing
-   REF : refactoring
-   ADD : add functionality
-   IMP : improve (which would be considered as a light refactoring)
-   DOC : documentation
-   TEST : test

## Merge strategy

-   main > (staging) > dev > feature branches , staging later on
-   from dev / staging
    -   => creature a feature branch,
    -   => code
    -   => squash and merge ideally in fast-forward on dev
    -   => delete the feature branch (reason why the branch_name is important on the commit level)

## git / github strategies

-   to start : commit-msg, pre-commit, pre-push
    -   commit-msg : check commit message 
    -   pre-commit : eslint + prettier
    -   pre-push : tests
-   in 2nd time : github actions (test, deploy, other ?)





8/28/2018 Section of Build Web APIs from Scratch course: Project #3

In this project, I build all of the routing and database logic for an article submission web app called The Scoop.

The Scoop allows users to:
1. Create and log in to custom username handles
2. Submit, edit, and delete articles containing a link and description
3. Upvote and downvote articles
4. Create, edit, and delete comments on articles
5. Upvote and downvote comments
6. View all of a user's articles and comments

The app currently contains all of the server logic for users and articles so I will complete the missing parts for comments. 

As a bonus, we were encouraged to use YAML because every time you start and stop the server, the database object will get erased as it isn't being saved anywhere. For this I write two functions: one that saves the database object to YAML after each server call, and another that loads the database object when the server starts. We were provided the logic for calling these functions, but needed to find appropriate JavaScript modules for this functionality and writing the following functions:

- loadDatabase
- saveDatabase

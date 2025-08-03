This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev

```
if you run it locally add to your local ```.env``` file

```bash
TURSO_CONNECTION_URL=libsql://wordle-game-emmalululu.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTQxOTc0NzksImlkIjoiZWZlMDZkNjctYjlmNi00M2IzLWFiYTYtNzJmNmVlMDY5YjViIiwicmlkIjoiZjAwNDU2OWUtMGVhMi00OGM4LTlmYzItODRjNWI4NzEyMTc4In0.NHUODMgVOYZR5XpMDaarInRWz8TB1gExK14GGpYV-PCA5WrMFGQ0arFf8OwwJqG4-DdZ5R9CRyMRDehhCHhoCw
 ```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Task Scope
Task 1 ,2, 3 (can check each commit to see detailed implementation at each stage)

## Decision making
### Task1: 
pure FE with one game page and two components, virtualKeyboard and LettersBoard.
the game state is contained in game page, which is an array of

```javascript
 {
    "letters": [
                {
                    "letter": "",
                    "status": "UNUSED"
                },
                {
                    "letter": "",
                    "status": "UNUSED"
                },
                {
                    "letter": "",
                    "status": "UNUSED"
                },
                {
                    "letter": "",
                    "status": "UNUSED"
                },
                {
                    "letter": "",
                    "status": "UNUSED"
                }
            ],
            "isCompleted": false
}
```
to store each round of guess. to be able show the whole game board, the initial is an array contains 6 row object.

When virtualKeyboard is pressed, if the key is the letter, update the current row and column letter value of the game state

### Task 2:
Add sqlite db using turso and connect to the nextjs using drizzle. because they are easy config and lightweight suitable for this project at meantime provide ability to scale the app like having user highest score feature.

move game state from FE state to server and stored in db.
create Dto file 

##### Three Api 
- ```/game/new```
used to init a game row inside db, returns to user a game id 
 - ```/game/[gameID]```
used to fetch the game status of that specific gameID
 - ```/game/guess```
verify the guess input with word list

FE using page router param to store the ```gameId``` after init a game session, because it can make the game shareable, server-ready for nextjs api 

### Task 3

Algorithm of getting candidate word list based on user guess
first to loop each word in candidate list and compare with guess to get the pattern of each letter state (e.g. hit, miss, or present) at same time calculate the score, hit = 2, present = 1, miss = 0) the goal is to find the pattern with lowest score. 
dynamic maintain this candidate list and after each verification store the updated list to db 


### Why Nextjs
Write backend logic (e.g., game server) in ```/app/api/``` without a separate Node.js server.
Works seamlessly withTurso/SQLite
Supports dynamic routes (```/game/[id]/page.tsx```) 

# bank-account-kata

## Main Development Dependencies
- node version v20.11.0
- npm version v10.2.0
- sqlite3 in memory mode
- express v4
- react v18

## Backend
### install
```
cd [project_folder]

cd backend-with-express

npm install
```
### dev
- the backend server will running on port 3000
- The sqlite3 database will be filled with 12 records while the backend server is running.
- if you change the code of backend, the nodemon will reload this app, so the data you've already saved in the database will get lost. so using npm start to avoid it.
```
npm run dev
```

### start
- The sqlite3 database will be filled with 12 records while the backend server is running.
```
npm start
```
## test
- using jest for testing framework
```
npm test
```

## Frontend
### install
```
cd [project_folder]

cd backend-with-react

npm install
```

### dev
- the front-end dev server will running on port 3001
- visit http://localhost:3001
```
npm run dev
```

## test
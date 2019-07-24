# Alter
Twitch extension for driving engagement, improving content, and delivering a more rich experience for viewers and streamers.

## Server
Node.js and MongoDB RESTful API, using Express and Mongoose as middleware.
Add the local SSL certificate located in ./ssl directory.

### Setup
```
cd server
npm install
```

### Run and connect to local MongoDB with hot-reloads for development:
```
npm run start-dev
```

### Run and connect to MongoDB Atlas cluster for production:
```
npm run start
```

## Client
Vue.js SPA bootstraped with Vue CLI and using Vuetify for meterial design.

### Setup
```
cd client
npm install
```

### Compiles and hot-reloads for development:
```
npm run start-dev
```

### Compiles and minifies for production:
```
npm run build
```

### Lints and fixes files:
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Docker
Start Docker in development mode with watcher for code changes:
```
docker-compose up && docker-compose down -v
```

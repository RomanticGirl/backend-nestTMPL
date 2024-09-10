## Installation

```bash
$ npm install
```

## Add .env file (example)
```dotenv
PORT=3003 # порт сервиса
PG_HOST=192.168.43.192 # адрес postgres
PG_PORT=5435 # порт postgres
PG_USER=user1 # логин postgres
PG_PASSWORD=postgres123 # пароль postgres
PG_DATABASE=pcs # база данных postgres
```

test стенд
```dotenv
PORT=3003 # порт сервиса
PG_HOST=192.168.62.196 # адрес postgres db3
PG_PORT=5432 # порт postgres
PG_USER=pcs_back # логин postgres
PG_PASSWORD=ZWxoziaFR2I24eowE # пароль postgres
PG_DATABASE=pcs # база данных postgres
```

## Running the app

```bash
# build
$ npm run build

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
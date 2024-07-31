# Calender app

## Prerequisites

- pnpm (package installer)
- Setting up the database
- if using docker run

```shell
docker compose up -d
```

to setup a database on port 3307

- Setup db schemas. This required prisma installed globally

```shell
pnpm i prisma -g
prisma db push
prisma generate
```

## Getting Started

- setup .env file using the .env.template and point it to the correct database
  port and jwt secret
- run

```shell
pnpm install
```

- run

```shell
pnpm run start:dev
```
 


# MeadTools

MeadTools is an all-in-one mead, wine, and cider recipe-building calculator. It aims to have everything you need to build a recipe in one place, providing accurate estimates for volumes of fruit so you don't have to do a bunch of extra calculations.

- [MeadTools](#meadtools)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Database Setup](#database-setup)
  - [Tech Stack](#tech-stack)
  - [Contributing](#contributing)
    - [Contribution Guidelines](#contribution-guidelines)
  - [License](#license)
  - [Community \& Support](#community--support)

## Features

- **Recipe Builder**: Create, save, and manage your recipes.
- **Extra Calculators**: Various tools for calculations related to fermentation.
- **User Accounts**: Save recipes, manage preferences, and more.
- **Public Recipe Sharing**: Share recipes with other users.
- **iSpindel Integration**: Connect iSpindel devices to track fermentation data.
- **API Access**: API documentation is available at the `/api` route.

## Installation

You can install MeadTools locally. Because the entire app is now built in Next.js 15 and uses React 18.

You also may want to remove i18nexus pull from the start scripts for local development. By default, i18nexus is included in the dev, build, and start scripts to sync translations from the external service. However, if you’re using the translations already included in the repository, you can remove it. To modify the scripts section, open the package.json at the root of the project and change the scripts to match the following.

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest --watch"
}
```

### Prerequisites

- Node.js (latest LTS recommended)
- PostgreSQL (You will need to set up a local database to use MeadTools Locally)
- npm

### Setup

1. Clone the repository:

```sh
git clone https://github.com/ljreaux/meadtools-nextjs-migration
cd meadtools
```

2. Install dependencies

```sh
npm install
```

1. Set up the environment variables by copying .env.example to .env and updating the values:

```sh
cp .env.example .env
```

4. Start the development server:

```sh
npm run dev
```

**Note that this will probably fail if you haven't completed the database setup already.**

5. Access the application at http://localhost:3000

### Database Setup

To run MeadTools locally, you need a PostgreSQL database. Here are the steps to setup and seed the database.

1. Install PostgreSQL Locally

   - Mac: `brew install postgresql`
   - Windows: Download and install from [postgresql.org](https://www.postgresql.org/)
   - Linux: `sudo apt install postgresql`

2. Start PostgreSQL
   - Mac/Linux: pg_ctl -D /usr/local/var/postgres start
   - Windows: Start via pgAdmin or the Windows Services Manager
3. Create a Database & User
   Open the PostgreSQL shell and run:

```sh
CREATE DATABASE meadtools;
CREATE USER meadtools_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE meadtools TO meadtools_user;
```

4. Update .env
   Add the database credentials:

```sh
DATABASE_URL=postgresql://meadtools_user:password@localhost:5432/meadtools
```

1. Generate Prisma Client

```sh
npx prisma generate
```

6. Run Migrations
   To apply the latest migrations and sync the schema, run:

```sh
npx prisma migrate dev --name init
```

- If it’s the first time, this will create the prisma/migrations/ folder.
- If migrations already exist, Prisma will apply them automatically.

7. Check Database Tables
   To confirm the schema matches, you can inspect your database using:

```sh
npx prisma studio
```

This opens a GUI where you can inspect your tables and relationships.

8. Seeding the database
   To fill your database with yeast, ingredient, and test users you can run:

```sh
npx prisma db seed
```

## Tech Stack

- **Next.js 15**
- **React 18**
- **ShadCN Components**
- **TypeScript**
- **Supabase (or PostgreSQL for local development)**
- **i18nexus for translation management**

## Contributing

MeadTools welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch and open a pull request.

### Contribution Guidelines

- Follow the existing code style (I use the default Prettier config to maintain consistency).
- Ensure all new features are documented.
- Test your changes before submitting a pull request.

## License

This project is licensed under the MIT License.

## Community & Support

Join our [Discord server](#https://discord.gg/Wbx9DWWqFC) to discuss features, get support, and contribute to the project.

---

MeadTools is also live at **[meadtools.com](https://meadtools.com)**.

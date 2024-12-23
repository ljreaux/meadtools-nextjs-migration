-- CreateEnum
CREATE TYPE "temp_units" AS ENUM ('F', 'C', 'K');

-- CreateTable
CREATE TABLE "brews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "start_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ(6),
    "user_id" INTEGER,
    "latest_gravity" REAL,
    "recipe_id" INTEGER,
    "name" TEXT,

    CONSTRAINT "brews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "device_name" TEXT,
    "recipe_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "coefficients" REAL[] DEFAULT ARRAY[]::REAL[],
    "brew_id" UUID,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sugar_content" DECIMAL NOT NULL,
    "water_content" DECIMAL NOT NULL,
    "category" VARCHAR(255) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "datetime" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "angle" REAL NOT NULL,
    "temperature" REAL NOT NULL,
    "temp_units" "temp_units" NOT NULL,
    "battery" REAL NOT NULL,
    "gravity" REAL NOT NULL,
    "interval" INTEGER NOT NULL,
    "calculated_gravity" REAL,
    "device_id" UUID,
    "brew_id" UUID,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "recipeData" TEXT NOT NULL,
    "yanFromSource" VARCHAR(255),
    "yanContribution" VARCHAR(255) NOT NULL,
    "nutrientData" TEXT NOT NULL,
    "advanced" BOOLEAN NOT NULL,
    "nuteInfo" TEXT,
    "primaryNotes" TEXT[],
    "secondaryNotes" TEXT[],
    "private" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "google_id" VARCHAR(255),
    "role" VARCHAR(255) DEFAULT 'user',
    "hydro_token" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yeasts" (
    "id" SERIAL NOT NULL,
    "brand" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nitrogen_requirement" VARCHAR(255) NOT NULL,
    "tolerance" DECIMAL NOT NULL,
    "low_temp" DECIMAL NOT NULL,
    "high_temp" DECIMAL NOT NULL,

    CONSTRAINT "yeasts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_hydro_token_key" ON "users"("hydro_token");

-- AddForeignKey
ALTER TABLE "brews" ADD CONSTRAINT "brews_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "brews" ADD CONSTRAINT "brews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_brew_id_fkey" FOREIGN KEY ("brew_id") REFERENCES "brews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_brew_id_fkey" FOREIGN KEY ("brew_id") REFERENCES "brews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

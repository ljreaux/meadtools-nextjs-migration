/*
  Warnings:

  - You are about to drop the column `hydro_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - The primary key for the `brews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `brews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `user_id` column on the `brews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `latest_gravity` on the `brews` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - The primary key for the `devices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `devices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `coefficients` on the `devices` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - The `brew_id` column on the `devices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `angle` on the `logs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - You are about to alter the column `temperature` on the `logs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - You are about to alter the column `battery` on the `logs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - You are about to alter the column `gravity` on the `logs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - You are about to alter the column `calculated_gravity` on the `logs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - The `device_id` column on the `logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `brew_id` column on the `logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `user_id` column on the `recipes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `name` on the `recipes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `yanFromSource` on the `recipes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `yanContribution` on the `recipes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Changed the type of `user_id` on the `devices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "brews" DROP CONSTRAINT "brews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_brew_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_brew_id_fkey";

-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_device_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_user_id_fkey";

-- DropIndex
DROP INDEX "User_hydro_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hydro_token",
DROP COLUMN "role";

-- AlterTable
ALTER TABLE "brews" DROP CONSTRAINT "brews_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "start_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "end_date" SET DATA TYPE TIMESTAMPTZ(6),
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "latest_gravity" SET DATA TYPE REAL,
ADD CONSTRAINT "brews_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "devices" DROP CONSTRAINT "devices_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "coefficients" SET DATA TYPE REAL[],
DROP COLUMN "brew_id",
ADD COLUMN     "brew_id" UUID,
ADD CONSTRAINT "devices_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "logs" DROP CONSTRAINT "logs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "datetime" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "angle" SET DATA TYPE REAL,
ALTER COLUMN "temperature" SET DATA TYPE REAL,
ALTER COLUMN "battery" SET DATA TYPE REAL,
ALTER COLUMN "gravity" SET DATA TYPE REAL,
ALTER COLUMN "calculated_gravity" SET DATA TYPE REAL,
DROP COLUMN "device_id",
ADD COLUMN     "device_id" UUID,
DROP COLUMN "brew_id",
ADD COLUMN     "brew_id" UUID,
ADD CONSTRAINT "logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "yanFromSource" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "yanContribution" SET DATA TYPE VARCHAR(255);

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
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "google_id" VARCHAR(255),
    "role" VARCHAR(255) DEFAULT 'user',
    "hydro_token" TEXT,
    "public_username" VARCHAR(50),

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
ALTER TABLE "brews" ADD CONSTRAINT "brews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_brew_id_fkey" FOREIGN KEY ("brew_id") REFERENCES "brews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_brew_id_fkey" FOREIGN KEY ("brew_id") REFERENCES "brews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

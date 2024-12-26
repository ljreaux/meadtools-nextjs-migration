/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `google_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - The primary key for the `brews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `brews` table. All the data in the column will be lost.
  - The primary key for the `devices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `devices` table. All the data in the column will be lost.
  - The primary key for the `logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the `ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `yeasts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "brews" DROP CONSTRAINT "brews_userId_fkey";

-- DropForeignKey
ALTER TABLE "brews" DROP CONSTRAINT "brews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_brew_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_userId_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_brew_id_fkey";

-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_device_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_userId_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_user_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "google_id",
DROP COLUMN "password",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "brews" DROP CONSTRAINT "brews_pkey",
DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "start_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "end_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "latest_gravity" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "brews_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "devices" DROP CONSTRAINT "devices_pkey",
DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "coefficients" SET DATA TYPE DOUBLE PRECISION[],
ALTER COLUMN "brew_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "devices_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "logs" DROP CONSTRAINT "logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "datetime" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "angle" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "temperature" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "battery" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "gravity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "calculated_gravity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "device_id" SET DATA TYPE TEXT,
ALTER COLUMN "brew_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "userId",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "yanFromSource" SET DATA TYPE TEXT,
ALTER COLUMN "yanContribution" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "ingredients";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "yeasts";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "brews" ADD CONSTRAINT "brews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_brew_id_fkey" FOREIGN KEY ("brew_id") REFERENCES "brews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_brew_id_fkey" FOREIGN KEY ("brew_id") REFERENCES "brews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

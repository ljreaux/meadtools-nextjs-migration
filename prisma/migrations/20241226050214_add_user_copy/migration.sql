-- AlterTable
ALTER TABLE "brews" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "google_id" VARCHAR(255),
    "role" VARCHAR(255) DEFAULT 'user',
    "hydro_token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_hydro_token_key" ON "User"("hydro_token");

-- AddForeignKey
ALTER TABLE "brews" ADD CONSTRAINT "brews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

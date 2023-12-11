-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('POUPANCA', 'CORRENTE');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "ag" TEXT NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT 'CORRENTE',
    "balance" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_number_key" ON "Account"("number");

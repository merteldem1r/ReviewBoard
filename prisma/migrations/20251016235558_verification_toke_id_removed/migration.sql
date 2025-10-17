/*
  Warnings:

  - The primary key for the `verificationtokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `verificationtokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "verificationtokens" DROP CONSTRAINT "verificationtokens_pkey",
DROP COLUMN "id";

/*
  Warnings:

  - You are about to drop the column `risk_score` on the `tags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tags" DROP COLUMN "risk_score",
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

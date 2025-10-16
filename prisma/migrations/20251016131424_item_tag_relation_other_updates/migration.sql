/*
  Warnings:

  - The values [AMOUNT_THRESHOLD,TAG_MULTIPLIER,COMBINATION] on the enum `RuleType` will be removed. If these variants are still used in the database, this will fail.
  - The `old_value` column on the `audit_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `new_value` column on the `audit_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_by_id` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `items` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RuleType_new" AS ENUM ('AMOUNT_RULE', 'TAG_RULE');
ALTER TABLE "public"."rules" ALTER COLUMN "rule_type" DROP DEFAULT;
ALTER TABLE "rules" ALTER COLUMN "rule_type" TYPE "RuleType_new" USING ("rule_type"::text::"RuleType_new");
ALTER TYPE "RuleType" RENAME TO "RuleType_old";
ALTER TYPE "RuleType_new" RENAME TO "RuleType";
DROP TYPE "public"."RuleType_old";
ALTER TABLE "rules" ALTER COLUMN "rule_type" SET DEFAULT 'AMOUNT_RULE';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_created_by_id_fkey";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "old_value",
ADD COLUMN     "old_value" JSONB,
DROP COLUMN "new_value",
ADD COLUMN     "new_value" JSONB;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "created_by_id",
DROP COLUMN "tags",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "rules" ALTER COLUMN "rule_type" SET DEFAULT 'AMOUNT_RULE';

-- CreateTable
CREATE TABLE "_ItemToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItemToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ItemToTag_B_index" ON "_ItemToTag"("B");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToTag" ADD CONSTRAINT "_ItemToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToTag" ADD CONSTRAINT "_ItemToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

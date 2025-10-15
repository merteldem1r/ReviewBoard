/*
  Warnings:

  - You are about to drop the column `action` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tags` table. All the data in the column will be lost.
  - Changed the type of `condition` on the `rules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuditLogActionType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'UPDATED');

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "action",
ADD COLUMN     "action_type" "AuditLogActionType" NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "rules" ALTER COLUMN "rule_type" SET DEFAULT 'AMOUNT_THRESHOLD',
DROP COLUMN "condition",
ADD COLUMN     "condition" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "description";

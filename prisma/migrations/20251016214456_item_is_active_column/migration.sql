-- AlterTable
ALTER TABLE "items" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "rules_is_active_rule_type_idx" ON "rules"("is_active", "rule_type");

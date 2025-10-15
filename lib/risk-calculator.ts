import { prisma } from "./prisma";

interface RiskCalculationInput {
  amount: number;
  tags: string[];
}

interface RiskBreakdown {
  totalScore: number;
  breakdown: {
    tagRisks: { tag: string; score: number }[];
    amountRisk: { ruleName: string; score: number } | null;
    tagMultipliers: { tag: string; ruleName: string; score: number }[];
  };
}

export async function calculateRiskScore(
  input: RiskCalculationInput
): Promise<RiskBreakdown> {
  const { amount, tags } = input;
  let totalScore = 0;

  const breakdown = {
    tagRisks: [] as { tag: string; score: number }[],
    amountRisk: null as { ruleName: string; score: number } | null,
    tagMultipliers: [] as { tag: string; ruleName: string; score: number }[],
  };

  // Step 1: Get base risk scores from tags
  const tagRecords = await prisma.tag.findMany({
    where: {
      name: { in: tags },
      is_active: true,
    },
  });

  for (const tag of tagRecords) {
    totalScore += tag.risk_score;
    breakdown.tagRisks.push({
      tag: tag.name,
      score: tag.risk_score,
    });
  }

  // Step 2: Get all active rules
  const rules = await prisma.rule.findMany({
    where: { is_active: true },
  });

  // Step 3: Apply AMOUNT_THRESHOLD rules
  const amountRules = rules.filter((r) => r.rule_type === "AMOUNT_THRESHOLD");

  for (const rule of amountRules) {
    const condition = rule.condition as any;
    const min = condition.threshold?.min ?? 0;
    const max = condition.threshold?.max;

    // Check if amount falls within this rule's range
    const meetsMin = amount >= min;
    const meetsMax = max === null || amount < max;

    if (meetsMin && meetsMax) {
      totalScore += rule.score;
      breakdown.amountRisk = {
        ruleName: rule.name,
        score: rule.score,
      };
      break; // Only apply one amount threshold rule
    }
  }

  // Step 4: Apply TAG_MULTIPLIER rules
  const tagMultiplierRules = rules.filter(
    (r) => r.rule_type === "TAG_MULTIPLIER"
  );

  for (const rule of tagMultiplierRules) {
    const condition = rule.condition as any;
    const ruleTag = condition.tag;

    // Check if user's tags include this rule's tag
    if (tags.includes(ruleTag)) {
      totalScore += rule.score;
      breakdown.tagMultipliers.push({
        tag: ruleTag,
        ruleName: rule.name,
        score: rule.score,
      });
    }
  }

  // Step 5: Cap the score at 100
  totalScore = Math.min(totalScore, 100);

  return {
    totalScore,
    breakdown,
  };
}

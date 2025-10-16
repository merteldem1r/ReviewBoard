import { TagNameRiskScore } from "@/app/api/items/route";
import { prisma } from "../prisma";
import { NextResponse } from "next/server";
import { Rule } from "@prisma/client";

interface RiskCalculationInput {
  amount: number;
  tagNamesRiskScore: TagNameRiskScore[];
}

interface RuleCondition {
  amount?: {
    min: number;
    max: number;
  };
  tag: string;
}

type RuleRow = {
  id: string;
  rule_type: "TAG_RULE" | "AMOUNT_RULE";
  is_active: boolean;
  score: number;
  condition: any;
};

export async function calculateRiskScore(input: RiskCalculationInput) {
  const { amount, tagNamesRiskScore } = input;
  let totalScore = 0;

  // risk score of each item based on each tag predefined risk score
  for (const { risk_score } of tagNamesRiskScore) {
    totalScore += risk_score;
  }

  // active rules
  const amountRules: RuleRow[] = await prisma.$queryRaw`
      select rule_type, score, condition
      from "rules"
      where is_active = true
        and rule_type = 'AMOUNT_RULE'
        and (condition -> 'amount' ->> 'min')::numeric <= ${amount}
        and (condition -> 'amount' ->> 'max')::numeric >= ${amount}
      limit 1
    `;

  // AMOUNT_RULE scores
  if (amountRules.length != 0) {
    totalScore += amountRules[0].score;
  }

  // TAG_RULE score
  const tagNames = tagNamesRiskScore.map((tag) => {
    return tag.name;
  });

  const tagJson = JSON.stringify(tagNames);

  const tagRules: RuleRow[] = await prisma.$queryRaw`
      SELECT rule_type, score, condition
      FROM "rules" 
      WHERE is_active = true
        AND rule_type = 'TAG_RULE'
        -- every tag in the rule must be present in our tagNames array
        AND (${tagJson}::jsonb) @> (condition -> 'tags')
    `;

  for (const tagRule of tagRules) {
    totalScore += tagRule.score;
  }

  totalScore = Math.min(totalScore, 100);
  return { totalScore };
}

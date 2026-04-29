import { Deal, Insight } from '../data/mock';

/**
 * AI Deal Scoring Engine (Simulated)
 * Calculates a numerical health/momentum score (1-100) based on multiple factors.
 */
export function calculateDealScore(deal: Deal): number {
  let score = 50; // Starting baseline

  // 1. Current Stage Weighting
  const stageWeights = {
    'Sourcing': 0,
    'Due Diligence': 10,
    'Execution': 25,
    'Portfolio': 15
  };
  score += stageWeights[deal.stage] || 0;

  // 2. Recency of Interaction (Decay factor)
  const msPerDay = 1000 * 3600 * 24;
  const daysSinceAction = Math.max(0, Math.floor((Date.now() - new Date(deal.lastInteractionDate).getTime()) / msPerDay));
  
  if (daysSinceAction <= 2) score += 15;
  else if (daysSinceAction <= 7) score += 5;
  else if (daysSinceAction > 14) score -= 15;
  else score -= 5;

  // 3. Frequency of Interactions (Momentum)
  if (deal.interactionsCount > 20) score += 10;
  else if (deal.interactionsCount >= 10) score += 5;
  else if (deal.interactionsCount < 5) score -= 10;

  // 4. Speed of Progression (Stagnation penalty)
  if (deal.daysInCurrentStage > 40) score -= 20;
  else if (deal.daysInCurrentStage > 20) score -= 10;
  else if (deal.daysInCurrentStage < 7) score += 10;

  // 5. Identified Risk Flags
  score -= deal.riskFlags.length * 20;

  // Clamp the final score between 1 and 100
  return Math.max(1, Math.min(100, Math.round(score)));
}

/**
 * AI Follow-up Suggestion Generator
 * Analyzes deals to generate proactive next-best-actions based on data footprint.
 */
export function generateProactiveInsights(deals: Deal[]): Insight[] {
  const insights: Insight[] = [];
  const msPerDay = 1000 * 3600 * 24;
  
  deals.forEach(deal => {
    const daysSinceAction = Math.max(0, Math.floor((Date.now() - new Date(deal.lastInteractionDate).getTime()) / msPerDay));
    
    // Rule 1: High severity risk flags
    if (deal.riskFlags.length > 0) {
      insights.push({
        id: `ins-risk-${deal.id}`,
        title: 'Predictive Alert',
        description: `Based on detected risk flags (${deal.riskFlags.join(', ')}), ${deal.name} is likely to stall in ${deal.stage}. Follow up with ${deal.primaryContact} immediately.`,
        action: 'Mitigation Plan'
      });
    } 
    // Rule 2: Sudden drop in engagement (Stagnation)
    else if (daysSinceAction > 7) {
      insights.push({
        id: `ins-stag-${deal.id}`,
        title: 'Engagement Drop',
        description: `Interaction frequency has dropped for ${deal.name}. Schedule a check-in for ${deal.name} with ${deal.primaryContact} before it moves to the next stage.`,
        action: 'Schedule Check-in'
      });
    } 
    // Rule 3: Abnormally long time in current stage
    else if (deal.daysInCurrentStage > 30 && deal.stage !== 'Portfolio') {
      insights.push({
        id: `ins-time-${deal.id}`,
        title: 'Velocity Warning',
        description: `${deal.name} has been in ${deal.stage} for ${deal.daysInCurrentStage} days, exceeding the moving average. Review potential blockers.`,
        action: 'Review Blockers'
      });
    }
  });

  // Sort by priority/severity (for demo purposes, just return top 3)
  return insights.slice(0, 3);
}

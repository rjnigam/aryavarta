import OpenAI from 'openai';

// Perplexity uses OpenAI-compatible API
export const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY || '',
  baseURL: 'https://api.perplexity.ai',
});

// Available Perplexity models
export const PERPLEXITY_MODELS = {
  SONAR: 'sonar', // Basic research with citations ($1/1M tokens)
  SONAR_PRO: 'sonar-pro', // Advanced research
  SONAR_REASONING: 'sonar-reasoning', // Complex multi-step research
} as const;

export type PerplexityModel = typeof PERPLEXITY_MODELS[keyof typeof PERPLEXITY_MODELS];

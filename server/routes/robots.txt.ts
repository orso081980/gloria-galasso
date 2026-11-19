/** Search engines and AI search / assistant crawlers are explicitly welcome. */
const AI_CRAWLERS = [
  'OAI-SearchBot', // ChatGPT search
  'ChatGPT-User', // ChatGPT browsing on behalf of a user
  'GPTBot', // OpenAI
  'ClaudeBot', // Anthropic
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot', // Perplexity search
  'Perplexity-User',
  'Google-Extended', // Gemini / AI Overviews grounding
  'Applebot-Extended', // Apple Intelligence
  'Bingbot', // Bing + Copilot
  'DuckAssistBot', // DuckDuckGo AI answers
  'MistralAI-User', // Le Chat
  'CCBot', // Common Crawl (feeds many models)
]

export default defineEventHandler((event) => {
  const siteUrl = getSiteUrl(event)
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI search and assistants',
    ...AI_CRAWLERS.map((bot) => `User-agent: ${bot}`),
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})

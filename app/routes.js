//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// Developer tools routes (simplified)
router.get('/developer-tools', function (req, res) {
  res.render('developer-tools')
})

// Common API key request routes
router.get('/request-api-key', function (req, res) {
  // Pre-populate access type if coming from a specific page
  const accessType = req.query['access-type']
  if (accessType) {
    req.session.data['access-type'] = accessType
  }
  res.render('request-api-key')
})

router.post('/request-api-key', function (req, res) {
  // Get form data
  const accessType = req.body['access-type']
  const apiType = req.body['api-type']
  const serviceCode = req.body['service-code']
  const justification = req.body['justification']
  const dataTypes = req.body['data-types']
  const dataClassification = req.body['data-classification']

  // Store data in session for confirmation page
  req.session.data['access-type'] = accessType
  req.session.data['api-type'] = apiType
  req.session.data['service-code'] = serviceCode
  req.session.data['justification'] = justification
  req.session.data['data-types'] = dataTypes
  req.session.data['data-classification'] = dataClassification

  // Redirect to confirmation page
  res.redirect('/request-api-key/confirmation')
})

router.get('/request-api-key/confirmation', function (req, res) {
  res.render('request-api-key-confirmation')
})

// LLM integration route
router.get('/llm-integration', function (req, res) {
  res.render('llm-integration')
})

// Low-code agents route
router.get('/low-code-agents', function (req, res) {
  res.render('low-code-agents')
})

// Copilot Chat route
router.get('/copilot-chat', function (req, res) {
  res.render('copilot-chat')
})

// Browse AI solutions route
router.get('/browse-ai-solutions', function (req, res) {
  res.render('browse-ai-solutions')
})

// Sandbox routes
router.get('/sandbox', function (req, res) {
  res.render('sandbox')
})

// Unified sandbox chat interface
router.get('/sandbox/chat', function (req, res) {
  const model = req.query.model || req.session.data['model'] || 'claude-3-5-sonnet'
  const modelNames = {
    'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
    'claude-3-haiku': 'Claude 3 Haiku',
    'amazon-titan-text': 'Amazon Titan Text',
    'gpt-4o': 'GPT-4o',
    'gpt-3-5-turbo': 'GPT-3.5 Turbo'
  }
  
  req.session.data['model'] = model
  req.session.data['model-name'] = modelNames[model] || 'AI Model'
  
  // Initialize chat history if not exists
  if (!req.session.data['chat-history']) {
    req.session.data['chat-history'] = []
  }
  
  res.render('sandbox-chat')
})

router.post('/sandbox/chat', function (req, res) {
  const message = req.body.message
  const model = req.body.model
  const modelNames = {
    'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
    'claude-3-haiku': 'Claude 3 Haiku',
    'amazon-titan-text': 'Amazon Titan Text',
    'gpt-4o': 'GPT-4o',
    'gpt-3-5-turbo': 'GPT-3.5 Turbo'
  }
  const modelName = modelNames[model] || 'AI Model'
  
  // Initialize chat history if not exists
  if (!req.session.data['chat-history']) {
    req.session.data['chat-history'] = []
  }
  
  // Add user message
  req.session.data['chat-history'].push({
    type: 'user',
    content: message,
    model: modelName
  })
  
  // Simulate AI response (in real implementation, this would call the actual AI API)
  const responses = [
    "I understand your request. As a prototype, I'm simulating a response from " + modelName + ". In a real implementation, this would connect to the actual AI model API.",
    "Thank you for testing " + modelName + ". This is a demonstration response to show how the chat interface would work.",
    "I'm processing your message: \"" + message + "\". In production, this would be handled by the actual " + modelName + " API.",
    "This is a simulated response from " + modelName + ". The actual implementation would provide real AI-generated responses based on your input."
  ]
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  // Add AI response
  req.session.data['chat-history'].push({
    type: 'ai',
    content: randomResponse,
    model: modelName
  })
  
  req.session.data['model'] = model
  req.session.data['model-name'] = modelName
  
  res.redirect('/sandbox/chat?model=' + model)
})

// New session route
router.get('/sandbox/chat/new-session', function (req, res) {
  const model = req.query.model || 'claude-3-5-sonnet'
  
  // Clear chat history for new session
  req.session.data['chat-history'] = []
  
  res.redirect('/sandbox/chat?model=' + model)
})

// Documentation route
router.get('/documentation', function (req, res) {
  res.render('documentation')
})

// Manage routes
router.get('/manage/api-keys', function (req, res) {
  res.render('manage-api-keys')
})

router.get('/manage', function (req, res) {
  // Redirect to API keys as default manage page
  res.redirect('/manage/api-keys')
})

module.exports = router

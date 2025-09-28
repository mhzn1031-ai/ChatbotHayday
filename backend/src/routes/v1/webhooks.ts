import express from 'express';
import crypto from 'crypto';
import { prisma } from '../../config/database';
import { logger, auditLogger } from '../../utils/logger';
import { asyncHandler } from '../../middleware/errorHandler';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

// Webhook endpoints for external integrations
router.post('/stripe', asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error('Stripe webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancellation(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
    default:
      logger.info(`Unhandled Stripe event type: ${event.type}`);
  }

  res.json({ received: true });
}));

// Outbound webhook management
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  
  const webhooks = await prisma.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  res.json(webhooks);
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { url, events, secret, isActive = true } = req.body;

  // Validate webhook URL
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid webhook URL' });
  }

  // Create webhook
  const webhook = await prisma.webhook.create({
    data: {
      userId,
      url,
      events,
      secret: secret || generateWebhookSecret(),
      isActive
    }
  });

  auditLogger.info('Webhook created', {
    userId,
    webhookId: webhook.id,
    url: webhook.url,
    events: webhook.events
  });

  res.status(201).json(webhook);
}));

router.put('/:webhookId', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { webhookId } = req.params;
  const { url, events, isActive } = req.body;

  const webhook = await prisma.webhook.findFirst({
    where: { id: webhookId, userId }
  });

  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  const updatedWebhook = await prisma.webhook.update({
    where: { id: webhookId },
    data: { url, events, isActive }
  });

  auditLogger.info('Webhook updated', {
    userId,
    webhookId,
    changes: { url, events, isActive }
  });

  res.json(updatedWebhook);
}));

router.delete('/:webhookId', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { webhookId } = req.params;

  const webhook = await prisma.webhook.findFirst({
    where: { id: webhookId, userId }
  });

  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  await prisma.webhook.delete({
    where: { id: webhookId }
  });

  auditLogger.info('Webhook deleted', {
    userId,
    webhookId
  });

  res.status(204).send();
}));

// Test webhook endpoint
router.post('/:webhookId/test', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { webhookId } = req.params;

  const webhook = await prisma.webhook.findFirst({
    where: { id: webhookId, userId }
  });

  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  // Send test payload
  const testPayload = {
    event: 'webhook.test',
    timestamp: new Date().toISOString(),
    data: {
      message: 'This is a test webhook from your AI Chatbot SaaS platform'
    }
  };

  try {
    const success = await sendWebhook(webhook, testPayload);
    
    if (success) {
      res.json({ success: true, message: 'Test webhook sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send test webhook' });
    }
  } catch (error) {
    logger.error('Test webhook failed:', error);
    res.status(500).json({ error: 'Failed to send test webhook' });
  }
}));

// Webhook delivery logs
router.get('/:webhookId/deliveries', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { webhookId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const webhook = await prisma.webhook.findFirst({
    where: { id: webhookId, userId }
  });

  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  const deliveries = await prisma.webhookDelivery.findMany({
    where: { webhookId },
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.webhookDelivery.count({
    where: { webhookId }
  });

  res.json({
    deliveries,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// Helper functions
async function handleSubscriptionUpdate(subscription: any) {
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer }
    });

    if (user) {
      await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          stripeId: subscription.id,
          status: subscription.status.toUpperCase(),
          plan: mapStripePlanToOurPlan(subscription.items.data[0].price.id)
        }
      });

      // Send webhook notification
      await triggerWebhook(user.id, 'subscription.updated', {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan: mapStripePlanToOurPlan(subscription.items.data[0].price.id)
        }
      });
    }
  } catch (error) {
    logger.error('Failed to handle subscription update:', error);
  }
}

async function handleSubscriptionCancellation(subscription: any) {
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer }
    });

    if (user) {
      await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          status: 'CANCELED'
        }
      });

      // Send webhook notification
      await triggerWebhook(user.id, 'subscription.canceled', {
        subscription: {
          id: subscription.id,
          canceledAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    logger.error('Failed to handle subscription cancellation:', error);
  }
}

async function handlePaymentSuccess(invoice: any) {
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer }
    });

    if (user) {
      // Send webhook notification
      await triggerWebhook(user.id, 'payment.succeeded', {
        invoice: {
          id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          paidAt: new Date(invoice.status_transitions.paid_at * 1000).toISOString()
        }
      });
    }
  } catch (error) {
    logger.error('Failed to handle payment success:', error);
  }
}

async function handlePaymentFailure(invoice: any) {
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer }
    });

    if (user) {
      // Send webhook notification
      await triggerWebhook(user.id, 'payment.failed', {
        invoice: {
          id: invoice.id,
          amount: invoice.amount_due,
          currency: invoice.currency,
          failedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    logger.error('Failed to handle payment failure:', error);
  }
}

export async function triggerWebhook(userId: string, event: string, data: any) {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: {
        userId,
        isActive: true,
        events: {
          has: event
        }
      }
    });

    for (const webhook of webhooks) {
      const payload = {
        event,
        timestamp: new Date().toISOString(),
        data
      };

      await sendWebhook(webhook, payload);
    }
  } catch (error) {
    logger.error('Failed to trigger webhooks:', error);
  }
}

async function sendWebhook(webhook: any, payload: any): Promise<boolean> {
  try {
    const signature = generateWebhookSignature(JSON.stringify(payload), webhook.secret);
    
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'User-Agent': 'AI-Chatbot-SaaS/1.0'
      },
      body: JSON.stringify(payload)
    });

    const success = response.ok;
    
    // Log delivery attempt
    await prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        event: payload.event,
        payload: JSON.stringify(payload),
        statusCode: response.status,
        success,
        responseBody: success ? null : await response.text(),
        deliveredAt: success ? new Date() : null
      }
    });

    if (!success) {
      logger.warn('Webhook delivery failed', {
        webhookId: webhook.id,
        url: webhook.url,
        statusCode: response.status
      });
    }

    return success;
  } catch (error) {
    logger.error('Webhook delivery error:', error);
    
    // Log failed delivery
    await prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        event: payload.event,
        payload: JSON.stringify(payload),
        statusCode: 0,
        success: false,
        responseBody: error.message
      }
    });

    return false;
  }
}

function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateWebhookSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function mapStripePlanToOurPlan(priceId: string): string {
  // Map Stripe price IDs to your plan names
  const planMapping: Record<string, string> = {
    [process.env.STRIPE_PRO_PRICE_ID!]: 'PRO',
    [process.env.STRIPE_BUSINESS_PRICE_ID!]: 'BUSINESS'
  };
  
  return planMapping[priceId] || 'FREE';
}

export default router;
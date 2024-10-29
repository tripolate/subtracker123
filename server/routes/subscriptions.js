import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  getUpcomingRenewals, 
  getEndingTrials, 
  getSubscriptionStats,
  updateSubscriptionStatus 
} from '../services/subscription.js';

const router = express.Router();

// Get upcoming renewals
router.get('/upcoming', authenticateToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const renewals = await getUpcomingRenewals(req.user.id, days);
    res.json(renewals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming renewals' });
  }
});

// Get ending trials
router.get('/trials', authenticateToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 3;
    const trials = await getEndingTrials(req.user.id, days);
    res.json(trials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ending trials' });
  }
});

// Get subscription statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await getSubscriptionStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription statistics' });
  }
});

// Force update subscription statuses
router.post('/update-status', authenticateToken, async (req, res) => {
  try {
    await updateSubscriptionStatus();
    res.json({ message: 'Subscription statuses updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription statuses' });
  }
});

export default router;
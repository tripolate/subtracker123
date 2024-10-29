import { PrismaClient } from '@prisma/client';
import { addDays, isBefore, isAfter } from 'date-fns';

const prisma = new PrismaClient();

export async function getUpcomingRenewals(userId, daysThreshold = 7) {
  const thresholdDate = addDays(new Date(), daysThreshold);
  
  return prisma.subscription.findMany({
    where: {
      userId,
      status: { not: 'cancelled' },
      nextBillingDate: {
        lte: thresholdDate,
        gt: new Date(),
      },
    },
    orderBy: {
      nextBillingDate: 'asc',
    },
  });
}

export async function getEndingTrials(userId, daysThreshold = 3) {
  const thresholdDate = addDays(new Date(), daysThreshold);
  
  return prisma.subscription.findMany({
    where: {
      userId,
      status: 'trial',
      trialEndsAt: {
        lte: thresholdDate,
        gt: new Date(),
      },
    },
    orderBy: {
      trialEndsAt: 'asc',
    },
  });
}

export async function getSubscriptionStats(userId) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      status: { not: 'cancelled' },
    },
  });

  const monthlyTotal = subscriptions.reduce((acc, sub) => {
    const amount = sub.billingCycle === 'monthly' ? 
      sub.amount : 
      sub.amount / 12;
    return acc + amount;
  }, 0);

  const yearlyTotal = subscriptions.reduce((acc, sub) => {
    const amount = sub.billingCycle === 'yearly' ? 
      sub.amount : 
      sub.amount * 12;
    return acc + amount;
  }, 0);

  const categorySummary = subscriptions.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + sub.amount;
    return acc;
  }, {});

  return {
    monthlyTotal,
    yearlyTotal,
    totalSubscriptions: subscriptions.length,
    activeTrials: subscriptions.filter(sub => sub.status === 'trial').length,
    categorySummary,
  };
}

export async function updateSubscriptionStatus() {
  const now = new Date();
  
  // Update trials that have ended
  await prisma.subscription.updateMany({
    where: {
      status: 'trial',
      trialEndsAt: {
        lt: now,
      },
    },
    data: {
      status: 'active',
    },
  });

  // Update next billing date for subscriptions that have passed their billing date
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: 'active',
      nextBillingDate: {
        lt: now,
      },
    },
  });

  for (const sub of subscriptions) {
    const newBillingDate = new Date(sub.nextBillingDate);
    while (isBefore(newBillingDate, now)) {
      if (sub.billingCycle === 'monthly') {
        newBillingDate.setMonth(newBillingDate.getMonth() + 1);
      } else {
        newBillingDate.setFullYear(newBillingDate.getFullYear() + 1);
      }
    }

    await prisma.subscription.update({
      where: { id: sub.id },
      data: { nextBillingDate: newBillingDate },
    });
  }
}

const mapCredits = (credit: any) => ({
  total: credit?.creditsTotal ?? null,
  used: credit?.creditsUsed ?? 0,
  remaining:
    credit?.creditsTotal != null
      ? Math.max(credit.creditsTotal - credit.creditsUsed, 0)
      : null,
});

export const mapSubscriptionDetails = (sub: any) => ({
  id: sub._id.toString(),

  user: sub.user,

  plan: sub.plan
    ? {
        id: sub.plan._id,
        name: sub.plan.name,
        tier: sub.plan.tier,
        currency: sub.plan.currency,
        price: sub.plan.price,
        limits: sub.plan.limits,
        isPopular: sub.plan.isPopular,
      }
    : null,

  snapshot: sub.snapshot,

  status: sub.status,

  startDate: sub.startDate,
  endDate: sub.endDate,

  createdAt: sub.createdAt,
  updatedAt: sub.updatedAt,

  payments: (sub.payments || []).map((p: any) => ({
    orderId: p.orderId,
    paymentId: p.paymentId,
    amount: p.amount,
    billingCycle: p.billingCycle,
    status: p.status,
    paidAt: p.paidAt,
  })),

  cycles: (sub.cycles || []).map((c: any) => ({
    startDate: c.startDate,
    endDate: c.endDate,

    analyses: mapCredits(c.analyses),
    aiReplies: mapCredits(c.aiReplies),
    totalScans: mapCredits(c.totalScans),
  })),
});
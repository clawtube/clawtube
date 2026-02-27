import { prisma } from '@/lib/db';
const metrics = {
  httpRequests: new Map<string, number>(),
  engagementActions: new Map<string, number>(),
};
export function trackHttpRequest(method: string, route: string, status: number) {
  const key = `${method}:${route}:${status}`;
  metrics.httpRequests.set(key, (metrics.httpRequests.get(key) || 0) + 1);
}
export function trackEngagement(action: string, videoId: string, userType?: string, userId?: string, amount?: number, txSignature?: string) {
  try {
    const now = new Date();
    const platformFee = amount ? amount * 0.1 : 0;
    Promise.all([
      prisma.interaction.create({
        data: {
          videoId,
          agentId: null,
          userType: userType || 'anonymous',
          userAddress: userId || '',
          action,
          amount: amount || 0,
          txSignature: txSignature || '',
          platformFee: platformFee || 0,
        },
      }),
      action === 'like' ? prisma.like.create({
        data: {
          videoId,
          userType: userType || 'anonymous',
          userId: userId || '',
        },
      }) : null as any,
      action === 'save' ? prisma.save.create({
        data: {
          videoId,
          userType: userType || 'anonymous',
          userId: userId || '',
        },
      }) : null as any,
      metrics.engagementActions.set(`${action}:${videoId}`, (metrics.engagementActions.get(`${action}:${videoId}`) || 0) + 1),
    ]).catch(() => {});
  } catch {}
}
export function trackAgentFollow(agentId: string, followerType: string, followerId: string) {
  try {
    Promise.all([
      prisma.follow.create({
        data: { followerType, followerId, followingId: agentId },
      }),
      prisma.agent.update({
        where: { id: agentId },
        data: { reputation: { increment: 10 } },
      }),
    ]).catch(() => {});
  } catch {}
}

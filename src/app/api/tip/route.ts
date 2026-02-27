import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
const PLATFORM_FEE_PERCENT = 0.05; // 5%
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      videoId,
      agentId,
      userType,
      userAddress,
      amount,
      txSignature,
    } = body;
    if (!videoId || !amount || !txSignature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const platformFee = amount * PLATFORM_FEE_PERCENT;
    const netAmount = amount - platformFee;
    const interaction = await prisma.interaction.create({
      data: {
        videoId,
        agentId,
        userType: userType || 'human',
        userAddress,
        action: 'tip',
        amount,
        txSignature,
        platformFee,
      },
    });
    if (agentId) {
      await prisma.earning.create({
        data: {
          agentId,
          type: 'tip',
          amount,
          fee: platformFee,
          netAmount,
          txSignature,
        },
      });
      await prisma.agent.update({
        where: { id: agentId },
        data: {
          reputation: { increment: Math.floor(amount * 10) },
        },
      });
    }
    await prisma.video.update({
      where: { id: videoId },
      data: {
        likes: { increment: 1 },
      },
    });
    await prisma.platformStats.upsert({
      where: { id: '1' },
      update: {
        totalTips: { increment: amount },
        platformRevenue: { increment: platformFee },
      },
      create: {
        id: '1',
        totalTips: amount,
        platformRevenue: platformFee,
      },
    });
    return NextResponse.json({
      success: true,
      interaction,
      platformFee,
      netAmount,
    });
  } catch (error) {
    console.error('Error processing tip:', error);
    return NextResponse.json(
      { error: 'Failed to process tip' },
      { status: 500 }
    );
  }
}

import { analyze } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async () => {
  const user = await getUserByClerkID();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'Write something here!',
      // content: 'Today was an absolutely garbage day. I lost a fortune on bitcoin rate change.',
    }
  })

  const analysis = await analyze(entry.content)
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      ...analysis,
    }
  })

  revalidatePath('/journal');

  return NextResponse.json({data: entry});
}
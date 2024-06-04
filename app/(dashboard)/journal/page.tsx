import EntryCard from '@/components/EntryCard'
import NewEntryCard from '@/components/NewEntryCard'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import Link from 'next/link'

const getEntries = async () => {
  const user = await getUserByClerkID()
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // await analyze(`I'm going to give you a journal entry, I want you to analyze for a few things. I need the mood, a summary, what the subject is, and a color representing the mood.
  // Yuo need to respond back with formatted JSON like so: {"mood": "", "subject": "", "color": "", "negative": ""}.

  // entry:
  // Today was a really greate day. I finally was able to grab that pair of shoes I have been dying to get`)

  // await analyze(
  //   `Today was a really greate day. I finally was able to grab that pair of shoes I have been dying to get.`
  // )

  // await analyze(
  //   `Today was an absolutely garbage day. I lost a fortune on bitcoin rate change.`
  // )

  // await analyze(
  //   `Today was a eh, ok day I guess. I found a new coffee shop that was cool but then I got a flat tire. :) `
  // )

  return entries
}

const JournalPage = async () => {
  const entries = await getEntries()
  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal Page</h2>
      <div className="grid grid-cols-3 gap-4 ">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default JournalPage

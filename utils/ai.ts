// import { OpenAIAgent } from "langchain/agents"; 

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { loadQARefineChain } from "langchain/chains";
import { Document } from "langchain/document";
import { StructuredOutputParser } from "langchain/output_parsers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { z } from "zod";


const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z.boolean().describe('is the journal entry negative? (i.e. does it contain negative emotions?).'),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z.string().describe('a hexidecimal color code that represents the mood of entry. Example #0101fe for blue representing happiness.'),
    sentimentScore: z.number().describe('sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'),
  })
)

// const getPrompt = async (content) => {

// }

export const analyze = async (content) => {

  const formattedInstructions = parser.getFormatInstructions()

  const systemTemplate = `Analize the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{formattedInstructions}. Do not guess and leave Sumary field an empty string in case of default message 'Write something here!' or if it is initially empty`;
  
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{content}"],
  ])

  const model = new ChatOpenAI({model: "gpt-3.5-turbo", temperature: 0,});

  // const promptParsed = prompt.invoke({
  //   formattedInstructions: formattedInstructions,
  //   content: content
  // });

  // console.log((await promptParsed).toChatMessages());

  const chain = prompt.pipe(model)

  const result = await chain.invoke({
    formattedInstructions: formattedInstructions,
    content: content
  });
  // console.log(result);
  try {
    const parsedResult = await parser.parse(result.content);
    // console.log(parsedResult)
    return parsedResult;
  } catch (error) {
    console.log(error);
  }
}

export const qa = async (question, entries) => {

  const docs = entries.map((entry) => {
    return new Document({
     pageContent: entry.content,
     metadata: { id: entry.id, createdAt: entry.createdAt },
    }) 
  })
  
  const model = new ChatOpenAI({temperature: 0, model: "gpt-3.5-turbo"});
  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();

  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  const relevantDocs = await store.similaritySearch(question)

    const res = await chain._call({
      input_documents: relevantDocs,
      question,
    })

  return res.output_text
}

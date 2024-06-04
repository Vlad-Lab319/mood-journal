// import { OpenAIAgent } from "langchain/agents"; 

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z.boolean().describe('is the journal entry negative? (i.e. does it contain negative emotions?).'),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z.string().describe('a hexidecimal color code that represents the mood of entry. Example #0101fe for blue representing happiness.')
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

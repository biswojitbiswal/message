import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    // i will modify the prompt and will integrate the openai
  
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
    });
  
    return result.toDataStreamResponse();
  } catch (error) {
    if(error instanceof OpenAI.APIError){
        const {name, status, headers, message} = error;

        return NextResponse.json({
            name, status, headers, message
        })
    } else {
        console.log('An Unexpected error occured', error);
        throw error
    }
  }
}
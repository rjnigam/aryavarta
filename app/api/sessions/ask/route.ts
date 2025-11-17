import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { perplexity, PERPLEXITY_MODELS } from '@/lib/perplexity';

export const runtime = 'edge'; // Use Edge Runtime for streaming

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, question, ai_model = 'perplexity' } = body;

    // Validate required fields
    if (!session_id || !question) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, question' },
        { status: 400 }
      );
    }

    // 1. Insert user's question into database
    const { error: userMessageError } = await supabase
      .from('session_messages')
      .insert({
        session_id,
        role: 'user',
        content: question,
        is_partial: false,
      });

    if (userMessageError) {
      console.error('Error inserting user message:', userMessageError);
      return NextResponse.json(
        { error: 'Failed to save question' },
        { status: 500 }
      );
    }

    // 2. Call Perplexity AI with streaming
    const stream = await perplexity.chat.completions.create({
      model: PERPLEXITY_MODELS.SONAR, // Use Sonar for research
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable research assistant focused on Vedic philosophy and Indian wisdom traditions. Provide detailed, well-cited answers with sources.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
      stream: true, // Enable streaming
      max_tokens: 2000,
    });

    // 3. Create a readable stream to send to client
    const encoder = new TextEncoder();
    let fullResponse = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            
            if (content) {
              fullResponse += content;
              
              // Send chunk to client
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }

          // 4. After streaming completes, save full response to database
          const { error: assistantMessageError } = await supabase
            .from('session_messages')
            .insert({
              session_id,
              role: 'assistant',
              content: fullResponse,
              is_partial: false,
              citations: [], // Perplexity provides citations in response
            });

          if (assistantMessageError) {
            console.error('Error saving assistant message:', assistantMessageError);
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    // Return streaming response
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

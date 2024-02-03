import * as openai from 'openai';
import { ChatCompletion } from 'openai/resources';

const prePrompt = `You are the automated code reviewer.
Your task is to verify the pull request and label the complexity and size of a pull request.
Possible labels are: S, M, L, XL.
Answer only with the label and nothing else.
This is a pull request for the following issue:`;

async function verifyPullRequest(prContent: string, llmApiKey: string, llmProvider: string): Promise<any> {
    if (llmProvider === 'openai') {
        const openaiClient: openai.OpenAI = new openai.OpenAI({ apiKey: llmApiKey });

        const completion: ChatCompletion = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                {
                    role: 'system',
                    content: prePrompt,
                },
                {
                    role: 'user',
                    content: prContent,
                },
            ],
        });

        // Parse the completion to get the label
        const label = completion.choices[0].message.content?.trim();

        if (label === 'S' || label === 'M' || label === 'L' || label === 'XL') {
            return label;
        } else {
            throw new Error('Invalid label');
        }
    } else {
        throw new Error('Unsupported LLM provider');
    }
}

export { verifyPullRequest };

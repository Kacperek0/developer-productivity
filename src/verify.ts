import * as openai from 'openai';
import { ChatCompletion } from 'openai/resources';

const prePrompt = `You are the automated code reviewer.
Your task is to verify the pull request and label the complexity and size of a pull request.
Possible labels are: S, M, L, XL.
Smallest and easiest pull requests should be labeled S, while the largest and most complex pull requests should be labeled XL.
Please make sure to verify the pull request and label it accordingly.
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
        console.log('Completion:', completion);

        const label = completion.choices[0].message.content?.trim();

        console.log('Label:', label);
        if (label === 'S' || label === 'M' || label === 'L' || label === 'XL') {
            return label;
        } else {
            throw new Error('Invalid label, please rerun the action.');
        }
    } else {
        throw new Error('Unsupported LLM provider');
    }
}

export { verifyPullRequest };

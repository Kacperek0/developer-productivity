import * as core from '@actions/core';
import * as github from '@actions/github';
import * as verify from './verify';

interface ActionInputs {
    githubToken: string;
    llmApiKey: string;
    llmProvider: string;
    azureEndpoint?: string;
}

async function run(): Promise<void> {
    try {
        const inputs: ActionInputs = {
            githubToken: core.getInput('GITHUB_TOKEN', { required: true }),
            llmApiKey: core.getInput('LLM_API_KEY', { required: true }),
            llmProvider: core.getInput('LLM_PROVIDER', { required: true }),
            azureEndpoint: core.getInput('AZURE_ENDPOINT'),
        };

        const octokit = github.getOctokit(inputs.githubToken);
        const prNumber = github.context.payload.pull_request?.number;

        if (!prNumber) {
            throw new Error('No pull request number found.');
        }

        const { owner, repo } = github.context.repo;
        const { data: pr } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: prNumber,
        });

        const prContent = pr.body + '\n\n' + pr.title;

        const label: string = await verify.verifyPullRequest(prContent, inputs.llmApiKey, inputs.llmProvider);

        await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: prNumber,
            labels: [label],
        });

        core.setOutput('label', label);

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();

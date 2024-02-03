"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPullRequest = void 0;
const openai = __importStar(require("openai"));
const prePrompt = `You are the automated code reviewer.
Your task is to verify the pull request and label the complexity and size of a pull request.
Possible labels are: S, M, L, XL.
Answer only with the label and nothing else.
This is a pull request for the following issue:`;
function verifyPullRequest(prContent, llmApiKey, llmProvider) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (llmProvider === 'openai') {
            const openaiClient = new openai.OpenAI({ apiKey: llmApiKey });
            const completion = yield openaiClient.chat.completions.create({
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
            const label = (_a = completion.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim();
            if (label === 'S' || label === 'M' || label === 'L' || label === 'XL') {
                return label;
            }
            else {
                throw new Error('Invalid label');
            }
        }
        else {
            throw new Error('Unsupported LLM provider');
        }
    });
}
exports.verifyPullRequest = verifyPullRequest;
//# sourceMappingURL=verify.js.map
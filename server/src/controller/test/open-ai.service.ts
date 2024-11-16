import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ILogger } from '@common/utils/create-logger.utils';
import OpenAI from 'openai';

export async function openAIAsync(content: string, logger: ILogger): IAsyncPromiseResult<string> {
    try {
        const apiKey = `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`;
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // or another model like "gpt-4o" if available
            messages: [
                {
                    role: 'user',
                    content:
                        'Дай індекс токсичноті від 1 до 100 наступному коментарю (кожен розділений \n)' +
                        content,
                },
            ],
        });

        if (completion?.choices.length) {
            const haiku = completion?.choices.map((c) => c?.message?.content?.trim()).join('\n');
            return [haiku];
        }
    } catch (error) {
        logger.log('Error generating haiku:', error);
        return [, '' + error];
    }
    return [''];
}

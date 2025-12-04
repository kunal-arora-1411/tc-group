import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const INDEX_NAME = 'intent-platform';

// Helper to check if index exists and create if not
export async function ensureIndex() {
    const existingIndexes = await pinecone.listIndexes();
    const indexExists = existingIndexes.indexes?.some(idx => idx.name === INDEX_NAME);

    if (!indexExists) {
        console.log(`Creating Pinecone index: ${INDEX_NAME}`);
        await pinecone.createIndex({
            name: INDEX_NAME,
            dimension: 1536, // OpenAI text-embedding-3-small dimension
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });
    }
}

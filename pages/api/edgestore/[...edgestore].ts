import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

console.log(`EDGE_STORE_SECRET_KEY: `,process.env.EDGE_STORE_SECRET_KEY);
console.log(`EDGE_STORE_ACCESS_KEY: `,process.env.EDGE_STORE_ACCESS_KEY);
const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});

/**
 * Create the handler for the Edge Store API.
 */
const handler = createEdgeStoreNextHandler({
  logLevel: 'debug',
  router: edgeStoreRouter,
});

/**
 * Default export for the API route.
 */
export { handler as GET, handler as POST };

/**
 * Specify that this API route uses the Edge Runtime.
 */
export const config = {
  runtime: "edge",
};

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;

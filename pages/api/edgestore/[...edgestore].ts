import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
 
const es = initEdgeStore.create();
 
/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});
 
export default function handler(req, res) {
  if (req.method === 'POST') {
    return createEdgeStoreNextHandler({
      router: edgeStoreRouter,
    })(req);
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
 
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

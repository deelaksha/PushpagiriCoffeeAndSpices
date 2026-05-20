import { getDocuments, updateDocument } from '@/lib/firebase/firestore';

/**
 * Run this script with `node scripts/migrateProducts.ts`.
 * It reads all product documents, normalizes the image field, and updates the doc.
 */
async function migrate() {
  try {
    const products = await getDocuments<any>('products');
    const promises = products.map(async (product) => {
      // If product already has images array, skip.
      if (Array.isArray(product.images)) return;
      // Legacy field may be `image` (string) or missing.
      if (typeof product.image === 'string') {
        const normalized = { ...product, images: [product.image] } as any;
        delete normalized.image;
        await updateDocument('products', product.id, normalized);
        console.log(`Migrated product ${product.id}`);
      }
    });
    await Promise.all(promises);
    console.log('Migration complete');
  } catch (err) {
    console.error('Migration failed', err);
  }
}

migrate();

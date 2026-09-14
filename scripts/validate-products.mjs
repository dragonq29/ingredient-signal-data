import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../products/', import.meta.url));
const productFiles = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    if (entry.isFile() && entry.name.endsWith('.json')) productFiles.push(path);
  }
}

async function main() {
  await collect(root);
  const seen = new Set();
  for (const file of productFiles) {
    const raw = await readFile(file, 'utf8');
    let product;
    try { product = JSON.parse(raw); } catch { throw new Error(`${file}: invalid JSON`); }
    const required = ['barcode', 'name', 'ingredientsText', 'source'];
    for (const key of required) if (!product[key]) throw new Error(`${file}: missing ${key}`);
    if (!/^\d{8,14}$/.test(product.barcode)) throw new Error(`${file}: barcode must have 8–14 digits`);
    if (seen.has(product.barcode)) throw new Error(`${file}: duplicate barcode ${product.barcode}`);
    seen.add(product.barcode);
    if (!Array.isArray(product.categories ?? [])) throw new Error(`${file}: categories must be an array`);
    if (typeof product.source !== 'object' || typeof product.source.verified !== 'boolean' || !product.source.updatedAt) {
      throw new Error(`${file}: invalid source metadata`);
    }
    const expected = `${product.barcode.slice(0, 3)}/${product.barcode}.json`;
    if (!relative(root, file).endsWith(expected)) throw new Error(`${file}: expected products/${expected}`);
  }
  console.log(`Validated ${productFiles.length} product file(s).`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });

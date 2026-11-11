/**
 * Cryptographic & Similarity Hashing Utilities
 * ContentProof Web Application
 */

/**
 * Computes exact cryptographic SHA-256 hash of a File object using Web Cryptography API.
 * Returns bytes32 formatted hex string (0x-prefixed, 64 hex characters).
 * @param {File|Blob} file 
 * @returns {Promise<{hash: string, rawBytes: Uint8Array, timeMs: number}>}
 */
export async function computeSHA256(file) {
  const startTime = performance.now();
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const timeMs = Math.round(performance.now() - startTime);

  return {
    hash: hexHash,
    timeMs: Math.max(1, timeMs)
  };
}

/**
 * Computes SHA-256 hash of an arbitrary UTF-8 text string.
 * @param {string} text 
 * @returns {Promise<string>}
 */
export async function computeTextSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes an experimental 64-bit Average Perceptual Hash (aHash) for image files.
 * This is used ONLY for demonstrating visual similarity analysis.
 * NOTE: This is distinct from cryptographic SHA-256. Cryptographic hashes change
 * completely with 1 bit alteration; perceptual hashes remain similar for visual edits.
 * @param {File} imageFile 
 * @returns {Promise<{pHash: string, previewUrl: string}>}
 */
export async function computePerceptualHash(imageFile) {
  return new Promise((resolve, reject) => {
    if (!imageFile.type.startsWith('image/')) {
      return resolve({ pHash: 'N/A (Non-image file)', previewUrl: null });
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 8;
          canvas.height = 8;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 8, 8);
          const imgData = ctx.getImageData(0, 0, 8, 8).data;

          // Compute grayscale values
          const grays = [];
          let sum = 0;
          for (let i = 0; i < imgData.length; i += 4) {
            const gray = Math.floor(0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2]);
            grays.push(gray);
            sum += gray;
          }
          const avg = sum / 64;

          // Compute 64-bit hash
          let binary = '';
          for (let i = 0; i < 64; i++) {
            binary += grays[i] >= avg ? '1' : '0';
          }

          // Convert 64 bits to hex
          let hex = '';
          for (let i = 0; i < 64; i += 4) {
            const nibble = parseInt(binary.substring(i, i + 4), 2).toString(16);
            hex += nibble;
          }

          resolve({
            pHash: '0x' + hex,
            previewUrl: e.target.result
          });
        } catch (err) {
          resolve({ pHash: 'Unable to compute', previewUrl: e.target.result });
        }
      };
      img.onerror = () => resolve({ pHash: 'Error loading image', previewUrl: null });
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Calculates Hamming distance between two hex strings (perceptual similarity).
 * @param {string} hash1 
 * @param {string} hash2 
 * @returns {number} percentage similarity 0-100
 */
export function calculateSimilarity(hash1, hash2) {
  if (!hash1 || !hash2 || hash1 === hash2) return 100;
  const h1 = hash1.replace('0x', '');
  const h2 = hash2.replace('0x', '');
  if (h1.length !== h2.length) return 0;

  let distance = 0;
  for (let i = 0; i < h1.length; i++) {
    const b1 = parseInt(h1[i], 16).toString(2).padStart(4, '0');
    const b2 = parseInt(h2[i], 16).toString(2).padStart(4, '0');
    for (let j = 0; j < 4; j++) {
      if (b1[j] !== b2[j]) distance++;
    }
  }
  const maxBits = h1.length * 4;
  return Math.round(((maxBits - distance) / maxBits) * 100);
}

/**
 * Format bytes to readable string (e.g. 1.25 MB)
 * @param {number} bytes 
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate Ethereum address for UI display
 * @param {string} address 
 * @returns {string}
 */
export function truncateAddress(address) {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Truncate long hash for UI display
 * @param {string} hash 
 * @returns {string}
 */
export function truncateHash(hash) {
  if (!hash) return '';
  if (hash.length <= 16) return hash;
  return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
}

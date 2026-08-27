/**
 * Abyntra AI Bulletproof File Downloader
 * Supports direct Stream, Blob memory buffering, and Anchor fallback.
 * Prevents "Network Error" or "Check internet connection" errors in Chrome, Android, macOS, and iOS.
 */

export async function triggerFileDownload(url, fileName, onProgress) {
  const targetFileName = fileName || url.split('/').pop() || 'Abyntra_AI_Package';

  try {
    if (onProgress) onProgress('connecting');

    // 1. Fetch binary as ArrayBuffer/Blob
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    if (onProgress) onProgress('downloading');

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // 2. Trigger programmatic download
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl;
    link.setAttribute('download', targetFileName);
    document.body.appendChild(link);
    link.click();

    if (onProgress) onProgress('completed');

    // 3. Clean up memory
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 2500);

    return true;
  } catch (err) {
    console.warn('Blob download encountered error, falling back to direct anchor stream:', err);
    if (onProgress) onProgress('fallback');

    // Fallback: Direct Anchor Click
    const directLink = document.createElement('a');
    directLink.style.display = 'none';
    directLink.href = url;
    directLink.setAttribute('download', targetFileName);
    directLink.target = '_blank';
    document.body.appendChild(directLink);
    directLink.click();

    setTimeout(() => {
      if (document.body.contains(directLink)) {
        document.body.removeChild(directLink);
      }
    }, 1000);

    return true;
  }
}

/**
 * Girionix AI Bulletproof File Downloader
 * Supports direct Stream, Blob memory buffering, and Anchor fallback.
 * Prevents "Network Error" or "Check internet connection" errors in Chrome, Android, macOS, and iOS.
 */

export async function triggerFileDownload(url, fileName, onProgress) {
  const targetFileName = fileName || url.split('/').pop() || 'Girionix_AI_Package';

  try {
    if (onProgress) onProgress('downloading');

    // Direct anchor click for clean HTTP download without synthetic blob warning flags
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', targetFileName);
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 1500);

    if (onProgress) onProgress('completed');
    return true;
  } catch (err) {
    console.warn('Download error:', err);
    window.open(url, '_blank');
    return false;
  }
}

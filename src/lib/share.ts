export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export async function shareInvitation(data: ShareData): Promise<{ success: boolean; fallbackCopied: boolean }> {
  if (navigator.share && navigator.canShare && navigator.canShare(data)) {
    try {
      await navigator.share(data);
      return { success: true, fallbackCopied: false };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled the share dialog
        return { success: false, fallbackCopied: false };
      }
      // If native sharing fails for another reason, fallback to copy
    }
  }

  // Fallback to Clipboard API
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(data.url);
      return { success: true, fallbackCopied: true };
    }
  } catch (clipboardErr) {
    console.error('Clipboard copy failed:', clipboardErr);
  }

  // Legacy fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = data.url;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      return { success: true, fallbackCopied: true };
    }
  } catch (execErr) {
    console.error('execCommand copy failed:', execErr);
  }

  return { success: false, fallbackCopied: false };
}


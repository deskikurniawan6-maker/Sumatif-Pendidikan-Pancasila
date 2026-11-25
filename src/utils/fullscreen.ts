export function isFullscreenActive(): boolean {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  };
  return Boolean(
    doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
  );
}

export async function requestExamFullscreen(): Promise<boolean> {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  };
  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
      return true;
    }
    if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen();
      return true;
    }
    if (el.mozRequestFullScreen) {
      await el.mozRequestFullScreen();
      return true;
    }
    if (el.msRequestFullscreen) {
      await el.msRequestFullscreen();
      return true;
    }
  } catch {
    // Fullscreen can be blocked in embedded iframe contexts
  }
  return false;
}

export async function exitExamFullscreen(): Promise<void> {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  };
  try {
    if (!isFullscreenActive()) return;
    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
    }
  } catch {
    // Ignore errors when exiting fullscreen
  }
}

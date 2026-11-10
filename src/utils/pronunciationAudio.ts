// Shared single-channel audio helper for word-by-word and letter pronunciation.
// Ensures rapid taps cleanly stop the previous sound instead of overlapping.

let activeAudio: HTMLAudioElement | null = null;
let activeAbortId = 0;

export function stopPronunciationAudio(): void {
  activeAbortId += 1;
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.onended = null;
    activeAudio.onerror = null;
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface PlayClipCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function playPronunciationClip(url: string, callbacks?: PlayClipCallbacks): void {
  stopPronunciationAudio();
  const callId = activeAbortId;

  const audio = new Audio(url);
  activeAudio = audio;

  audio.onended = () => {
    if (callId !== activeAbortId) return;
    activeAudio = null;
    callbacks?.onEnd?.();
  };

  audio.onerror = () => {
    if (callId !== activeAbortId) return;
    activeAudio = null;
    callbacks?.onError?.();
  };

  callbacks?.onStart?.();
  audio.play().catch(() => {
    if (callId !== activeAbortId) return;
    activeAudio = null;
    callbacks?.onError?.();
  });
}

export function playAudioSequence(
  urls: string[],
  onItemStart?: (index: number) => void,
  onComplete?: () => void,
  onError?: () => void
): void {
  stopPronunciationAudio();
  const sequenceId = activeAbortId;

  const playNext = (idx: number) => {
    if (sequenceId !== activeAbortId) return;
    if (idx >= urls.length) {
      activeAudio = null;
      onComplete?.();
      return;
    }

    const audio = new Audio(urls[idx]);
    activeAudio = audio;
    onItemStart?.(idx);

    audio.onended = () => {
      if (sequenceId !== activeAbortId) return;
      playNext(idx + 1);
    };

    audio.onerror = () => {
      if (sequenceId !== activeAbortId) return;
      activeAudio = null;
      onError?.();
    };

    audio.play().catch(() => {
      if (sequenceId !== activeAbortId) return;
      activeAudio = null;
      onError?.();
    });
  };

  playNext(0);
}

export function hasArabicSpeechSupport(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  const voices = window.speechSynthesis.getVoices();
  // Some browsers populate voices lazily; if empty, speechSynthesis may still work for ar-SA
  if (voices.length === 0) return true;
  return voices.some((v) => v.lang.toLowerCase().startsWith('ar'));
}

export function speakArabicSyllable(
  arabicText: string,
  callbacks?: { onStart?: () => void; onEnd?: () => void; onUnavailable?: () => void }
): boolean {
  stopPronunciationAudio();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    callbacks?.onUnavailable?.();
    return false;
  }

  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));

  // If voices list has loaded and there is genuinely no Arabic voice on the OS/browser
  if (voices.length > 0 && !arabicVoice) {
    callbacks?.onUnavailable?.();
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(arabicText);
  utterance.lang = arabicVoice?.lang || 'ar-SA';
  if (arabicVoice) utterance.voice = arabicVoice;
  utterance.rate = 0.78;
  utterance.pitch = 1.0;

  utterance.onstart = () => callbacks?.onStart?.();
  utterance.onend = () => callbacks?.onEnd?.();
  utterance.onerror = () => callbacks?.onUnavailable?.();

  window.speechSynthesis.speak(utterance);
  return true;
}

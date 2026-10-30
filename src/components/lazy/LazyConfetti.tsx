import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;

  const colors = ['#C9A227', '#FFDF78', '#6B1E2E', '#E11D48', '#FCEEE9'];

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  // Initial burst
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors,
  });

  frame();
}

export default function ConfettiCelebrationTrigger() {
  return null;
}


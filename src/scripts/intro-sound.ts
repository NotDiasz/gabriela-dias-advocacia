// Sound for the intro, synthesised with Web Audio so it follows the pen exactly:
// filtered noise is the nib on paper, its loudness and brightness follow the
// speed of the nib, and short transients make the wax seal and the dot of the i.
// Browsers may keep audio suspended until the first gesture on the page.

type Point = { x: number; y: number; time: number };

export type IntroSound = {
  resume(): void;
  seal(): void;
  pen(x: number, y: number): void;
  lift(): void;
  dot(): void;
  dispose(): void;
};

function noiseBuffer(context: AudioContext, seconds: number) {
  const buffer = context.createBuffer(
    1,
    Math.round(context.sampleRate * seconds),
    context.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function createIntroSound(): IntroSound | undefined {
  const Context =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Context) return;
  const context = new Context();
  const noise = noiseBuffer(context, 2);
  const master = context.createGain();
  master.gain.value = 0.9;
  master.connect(context.destination);

  // Paper friction: a very quiet low hiss under the nib while it moves.
  const frictionSource = context.createBufferSource();
  frictionSource.buffer = noise;
  frictionSource.loop = true;
  const frictionBand = context.createBiquadFilter();
  frictionBand.type = "bandpass";
  frictionBand.frequency.value = 1100;
  frictionBand.Q.value = 0.7;
  const frictionGain = context.createGain();
  frictionGain.gain.value = 0;
  frictionSource.connect(frictionBand).connect(frictionGain).connect(master);
  frictionSource.start();

  // A short, airy echo shared by the chime of the dot.
  const echo = context.createDelay(1);
  echo.delayTime.value = 0.11;
  const echoFeedback = context.createGain();
  echoFeedback.gain.value = 0.32;
  const echoTone = context.createBiquadFilter();
  echoTone.type = "lowpass";
  echoTone.frequency.value = 5200;
  echo.connect(echoTone).connect(echoFeedback).connect(echo);
  echoTone.connect(master);

  let last: Point | undefined;
  const burst = (
    at: number,
    length: number,
    frequency: number,
    level: number,
    type: BiquadFilterType = "bandpass",
  ) => {
    const source = context.createBufferSource();
    source.buffer = noise;
    const filter = context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = 1.2;
    const gain = context.createGain();
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
    source.connect(filter).connect(gain).connect(master);
    source.start(at, Math.random());
    source.stop(at + length + 0.02);
  };
  const thump = (at: number, frequency: number, level: number, length: number) => {
    const oscillator = context.createOscillator();
    oscillator.frequency.setValueAtTime(frequency, at);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, at + length);
    const gain = context.createGain();
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
    oscillator.connect(gain).connect(master);
    oscillator.start(at);
    oscillator.stop(at + length + 0.02);
  };

  return {
    resume() {
      void context.resume();
    },
    seal() {
      void context.resume();
      const now = context.currentTime + 0.01;
      // Wax snaps in two small cracks, then the folded paper gives way.
      burst(now, 0.05, 2600, 0.5, "highpass");
      thump(now, 120, 0.35, 0.12);
      burst(now + 0.045, 0.035, 1800, 0.35);
      burst(now + 0.12, 0.5, 700, 0.08, "lowpass");
    },
    pen(x, y) {
      const time = context.currentTime;
      // A long jump means the pen moved on to the next letter in the air.
      const jump = last ? Math.hypot(x - last.x, y - last.y) > 45 : false;
      if (last && !jump && time > last.time) {
        const elapsed = time - last.time;
        const speed = Math.hypot(x - last.x, y - last.y) / elapsed;
        // Speed is in signature units per second (the signature is ~900 wide).
        const amount = Math.min(1, speed / 700);
        // A steel nib does not hiss: it catches on the paper fibres in tiny
        // grains. More speed, more grains, a little brighter.
        const grains = Math.round(amount * 9 * Math.min(elapsed, 0.05) / 0.016);
        for (let i = 0; i < grains; i++)
          burst(
            time + Math.random() * Math.min(elapsed, 0.05),
            0.004 + Math.random() * 0.01,
            2600 + Math.random() * 3600 + amount * 1200,
            (0.05 + Math.random() * 0.09) * (0.4 + amount * 0.6),
          );
        frictionGain.gain.setTargetAtTime(amount * 0.018, time, 0.04);
      }
      last = { x, y, time };
    },
    lift() {
      last = undefined;
      frictionGain.gain.setTargetAtTime(0, context.currentTime, 0.06);
    },
    dot() {
      // "Plim": a small glass bell, slightly inharmonic, with a short echo.
      const now = context.currentTime + 0.005;
      const partials: Array<[number, number, number]> = [
        [2093, 0.16, 1.6],
        [2093 * 2.01, 0.07, 0.9],
        [2093 * 2.99, 0.035, 0.5],
        [2093 * 4.17, 0.018, 0.3],
      ];
      partials.forEach(([frequency, level, length]) => {
        const oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(level, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
        oscillator.connect(gain);
        gain.connect(master);
        gain.connect(echo);
        oscillator.start(now);
        oscillator.stop(now + length + 0.05);
      });
      burst(now, 0.012, 3800, 0.08);
    },
    dispose() {
      const time = context.currentTime;
      master.gain.setTargetAtTime(0, time, 0.1);
      window.setTimeout(() => void context.close(), 400);
    },
  };
}

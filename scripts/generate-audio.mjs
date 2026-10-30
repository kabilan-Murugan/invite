import fs from 'node:fs';
import path from 'node:path';

// Generate a valid WAV file with traditional Indian flute / shehnai soothing pentatonic tones,
// then save it as song.mp3 (browsers play WAV-encoded buffers inside audio tags effortlessly,
// or we can write a clean RIFF header).
const AUDIO_PATH = path.resolve('public/audio/song.mp3');

function generateHarmonicAudio() {
  const sampleRate = 22050;
  const durationSeconds = 12; // 12-second peaceful looping melody
  const numSamples = sampleRate * durationSeconds;
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // "fmt " subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34); // BitsPerSample (16)

  // "data" subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Raag Mohanam / Bilawal auspicious scale: C4, D4, E4, G4, A4, C5 (261.63, 293.66, 329.63, 392.00, 440.00, 523.25)
  const notes = [
    261.63, 329.63, 392.00, 440.00,
    523.25, 440.00, 392.00, 329.63,
    293.66, 329.63, 392.00, 261.63,
  ];

  const noteDuration = durationSeconds / notes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.min(Math.floor(t / noteDuration), notes.length - 1);
    const freq = notes[noteIndex];
    const noteTime = t % noteDuration;

    // Gentle envelope: attack and smooth release
    const attack = Math.min(1, noteTime / 0.08);
    const release = Math.max(0, 1 - noteTime / noteDuration);
    const envelope = attack * Math.pow(release, 0.7);

    // Flute/Harmonium harmonic blend: fundamental + 2nd + 3rd harmonics + gentle vibrato
    const vibrato = 1 + 0.006 * Math.sin(2 * Math.PI * 5 * t);
    const sample =
      0.65 * Math.sin(2 * Math.PI * freq * vibrato * t) +
      0.22 * Math.sin(2 * Math.PI * 2 * freq * vibrato * t) +
      0.08 * Math.sin(2 * Math.PI * 3 * freq * vibrato * t) +
      0.05 * Math.sin(2 * Math.PI * 0.5 * freq * t); // soothing drone base

    const intSample = Math.floor(sample * envelope * 12000); // 16-bit safe limit
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  fs.writeFileSync(AUDIO_PATH, buffer);
  console.log(`🎵 Generated relaxing instrumental audio at ${AUDIO_PATH}`);
}

generateHarmonicAudio();


import puppeteer from 'puppeteer';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const config = {
  url: 'http://localhost:5173',
  output: 'output.mp4',
  viewport: {
    width: 1280,
    height: 720,
  },
  fps: 30,
};

const tempDir = path.join(__dirname, 'temp_frames');

async function main() {
  // 1. Setup
  console.log('Setting up...');
  await fs.rm(tempDir, { recursive: true, force: true });
  await fs.mkdir(tempDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport(config.viewport);

  // 2. Navigate and prepare page
  console.log(`Navigating to ${config.url}...`);
  await page.goto(config.url, { waitUntil: 'networkidle0' });

  let resolveAnimation: () => void;
  const animationPromise = new Promise<void>(resolve => {
    resolveAnimation = resolve;
  });

  await page.exposeFunction('onAnimationComplete', () => {
    console.log('Animation complete signal received from page.');
    resolveAnimation();
  });

  // 3. Start recording
  console.log('Starting recording...');
  await page.evaluate(() => {
    const playButton = document.querySelector('button'); // Simple selector for the first button
    if (playButton) {
      playButton.click();
    } else {
      throw new Error('Play button not found');
    }
  });

  let frame = 0;
  const interval = 1000 / config.fps;
  const recorder = setInterval(async () => {
    const framePath = path.join(tempDir, `frame_${String(frame++).padStart(5, '0')}.png`);
    await page.screenshot({ path: framePath });
  }, interval);

  // 4. Wait for completion
  await animationPromise;
  clearInterval(recorder);
  console.log('Recording finished.');

  await browser.close();

  // 5. FFmpeg conversion
  console.log('Converting frames to video with FFmpeg...');
  const ffmpegCommand = `ffmpeg -framerate ${config.fps} -i ${path.join(tempDir, 'frame_%05d.png')} -c:v libx264 -pix_fmt yuv420p -y ${config.output}`;
  
  await new Promise((resolve, reject) => {
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`FFmpeg error: ${error.message}`);
        console.error(`FFmpeg stderr: ${stderr}`);
        return reject(error);
      }
      console.log('FFmpeg conversion successful.');
      resolve(stdout);
    });
  });

  // 6. Cleanup
  console.log('Cleaning up temporary files...');
  await fs.rm(tempDir, { recursive: true, force: true });

  console.log(`\n✅ Video saved to ${config.output}`);
}

main().catch(console.error);

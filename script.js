
const screens = [...document.querySelectorAll('.screen')];

function showScreen(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'promise') confetti(90);
}

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.next));
});

// Balloon wishes
let popped = 0;
const balloons = [...document.querySelectorAll('.balloon')];

balloons.forEach(balloon => {
  balloon.addEventListener('click', () => {
    if (balloon.classList.contains('popped')) return;

    playClickSound('pop');
    balloon.classList.add('popped');
    popped++;

    document.getElementById('balloonMessage').textContent =
      balloon.dataset.message;

    document.getElementById('balloonProgress').style.width =
      `${popped / balloons.length * 100}%`;

    confetti(12);

    if (popped === balloons.length) {
      document.getElementById('balloonMessage').textContent +=
        ' 🎉 Saari wishes aapki!';
    }
  });
});

// Birthday candles
let candlesOut = 0;

document.querySelectorAll('.candle').forEach(candle => {
  candle.addEventListener('click', () => {
    if (candle.classList.contains('off')) return;

    candle.classList.add('off');
    candlesOut++;

    document.getElementById('cakeStatus').textContent =
      candlesOut === 3
        ? 'Yay! Saari candles bujh gayi. Ab cake cut kijiye! 🎉'
        : `Beautiful! ${3 - candlesOut} candle(s) aur baaki hain. Wish maangna mat bhooliyega. ✨`;

    if (candlesOut === 3) confetti(35);
  });
});

// Cut birthday cake
document.getElementById('cutCake').addEventListener('click', () => {
  if (candlesOut < 3) {
    document.getElementById('cakeStatus').textContent =
      'Pehle teeno candles bujhaiye, phir cake cut hoga. 🕯️';
    return;
  }

  document.querySelector('.cake-scene').classList.add('cut');

  document.getElementById('cakeCelebration')
    .classList.remove('hidden');

  document.getElementById('cakeStatus').textContent =
    'Cake cut ho gaya! Ab ek pyaari si smile ho jaaye. ❤️';

  confetti(70);
});

// Restart all surprises
document.getElementById('restart').addEventListener('click', () => {
  popped = 0;

  balloons.forEach(b => b.classList.remove('popped'));

  document.getElementById('balloonProgress').style.width = '0%';
  document.getElementById('balloonMessage').textContent =
    'Kisi balloon ko tap kijiye… 🎈';

  candlesOut = 0;

  document.querySelectorAll('.candle').forEach(c => {
    c.classList.remove('off');
  });

  document.querySelector('.cake-scene').classList.remove('cut');

  document.getElementById('cakeCelebration')
    .classList.add('hidden');

  document.getElementById('cakeStatus').textContent =
    'Har candle par tap karke wish maangiye. 🕯️';

  showScreen('welcome');
});

// Confetti animation
function confetti(count = 35) {
  const layer = document.getElementById('confettiLayer');

  const colors = [
    '#ff8db5',
    '#ffd58a',
    '#c4a4ff',
    '#fff2e8',
    '#89d8dc'
  ];

  for (let i = 0; i < count; i++) {
    const bit = document.createElement('i');

    bit.className = 'confetti';
    bit.style.left = Math.random() * 100 + '%';

    bit.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    bit.style.animationDelay = Math.random() * .7 + 's';

    bit.style.transform =
      `rotate(${Math.random() * 180}deg)`;

    layer.appendChild(bit);

    setTimeout(() => bit.remove(), 3300);
  }
}

// Click sounds
let audioContext;

function playClickSound(kind = 'tap') {
  try {
    audioContext = audioContext ||
      new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.type = kind === 'pop' ? 'sine' : 'triangle';

    osc.frequency.setValueAtTime(
      kind === 'pop' ? 620 : 740, now
    );

    osc.frequency.exponentialRampToValueAtTime(
      kind === 'pop' ? 180 : 1050,
      now + (kind === 'pop' ? .13 : .18)
    );

    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.12, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .2);

    osc.start(now);
    osc.stop(now + .21);

  } catch (e) {
    // Website will work even if sound is unavailable.
  }
}

// Button click sounds
document.addEventListener('click', event => {
  const target = event.target.closest('button, .photo-slot');

  if (target && !target.classList.contains('balloon')) {
    playClickSound('tap');
  }
});

// Falling flowers
const petalLayer = document.getElementById('petalLayer');

function dropPetals(count = 26) {
  const symbols = ['🌸', '🌺', '✿', '❀', '🌼'];
  const tones = ['pink', 'white', 'gold'];

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');

    petal.className =
      'petal ' + tones[Math.floor(Math.random() * tones.length)];

    petal.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    petal.style.left = Math.random() * 100 + '%';

    petal.style.fontSize =
      (15 + Math.random() * 19) + 'px';

    petal.style.animationDuration =
      (4 + Math.random() * 5) + 's';

    petal.style.animationDelay =
      (Math.random() * 1.8) + 's';

    petal.style.setProperty(
      '--drift',
      (Math.random() * 220 - 110) + 'px'
    );

    petalLayer.appendChild(petal);

    setTimeout(() => petal.remove(), 11000);
  }
}

// Start flower shower
document.querySelector('[data-next="balloons"]')
  ?.addEventListener('click', () => dropPetals(65));

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => dropPetals(16));
});

document.getElementById('restart')
  ?.addEventListener('click', () => dropPetals(35));

// Photo fullscreen preview
const lightbox = document.getElementById('photoLightbox');
const lightboxImage = document.getElementById('lightboxImage');

document.querySelectorAll('.photo-button').forEach(btn => {
  btn.addEventListener('click', () => {
    lightboxImage.src = btn.dataset.photo;
    lightbox.classList.remove('hidden');
  });
});

function closePhoto() {
  lightbox.classList.add('hidden');
  lightboxImage.src = '';
}

document.getElementById('closeLightbox')
  .addEventListener('click', closePhoto);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closePhoto();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePhoto();
});

// Background birthday music
// MP3 is stored in the GitHub repository root.
const birthdayMusic = document.getElementById('birthdayMusic');
const musicToggle = document.getElementById('musicToggle');

let musicStarted = false;

musicToggle.addEventListener('click', async () => {
  if (!musicStarted || birthdayMusic.paused) {
    try {
      await birthdayMusic.play();

      musicStarted = true;
      musicToggle.textContent = '♫ Pause Darkhaast';

    } catch (e) {
      musicToggle.textContent = '♫ Play Darkhaast';

      alert(
        'Music play nahi ho raha. GitHub repository mein darkhaast.mp3 file check karein.'
      );
    }

  } else {
    birthdayMusic.pause();
    musicToggle.textContent = '♫ Play Darkhaast';
  }
});

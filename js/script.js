// === Affichage des règles (page d’accueil) ===
const rulesBtn = document.getElementById('rulesBtn');
const rulesText = document.getElementById('rulesText');

if (rulesBtn && rulesText) {
  rulesBtn.addEventListener('click', () => {
    rulesText.classList.toggle('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('level-overlay');
  const startButton = document.getElementById('start-level-btn');
  const gameUI = document.getElementById('game-ui');
  const targetYokaiImg = document.getElementById('target-yokai');
  const gameBoard = document.getElementById('game-board');
  const background = document.body;
  const restartBtn = document.getElementById('restart-btn');
  const gameOverDiv = document.getElementById('game-over');

  const yokaiList = [
    '../Images/Yokai/akaname.svg', '../Images/Yokai/akaneko.svg', '../Images/Yokai/amabi.svg',
    '../Images/Yokai/amenonna.svg', '../Images/Yokai/aoandon.svg', '../Images/Yokai/ashiarai.svg',
    '../Images/Yokai/azukiarai.svg', '../Images/Yokai/bakekujira.svg', '../Images/Yokai/betobeto.svg',
    '../Images/Yokai/cyclope.svg', '../Images/Yokai/dodomeki.svg', '../Images/Yokai/enenra.svg',
    '../Images/Yokai/futakuchi.svg', '../Images/Yokai/gashadokuro.svg', '../Images/Yokai/gazuhyaki.svg',
    '../Images/Yokai/gyuki.svg', '../Images/Yokai/hitotsumekozo.svg', '../Images/Yokai/hyosube.svg',
    '../Images/Yokai/inugami.svg', '../Images/Yokai/jinmenken.svg', '../Images/Yokai/jorugomu.svg',
    '../Images/Yokai/kamikiri.svg', '../Images/Yokai/kappa.svg', '../Images/Yokai/karasutengu.svg',
    '../Images/Yokai/kasaobake.svg', '../Images/Yokai/kawanokami.svg', '../Images/Yokai/kitsune.svg',
    '../Images/Yokai/korainobozu.svg', '../Images/Yokai/kudan.svg', '../Images/Yokai/kurobozu.svg',
    '../Images/Yokai/mokumokuren.svg', '../Images/Yokai/namahage.svg', '../Images/Yokai/noderabo.svg',
    '../Images/Yokai/nue.svg', '../Images/Yokai/nuppepo.svg', '../Images/Yokai/nurarihyon.svg',
    '../Images/Yokai/nyudo.svg', '../Images/Yokai/okiku.svg', '../Images/Yokai/onamazu.svg',
    '../Images/Yokai/oni.svg', '../Images/Yokai/orochi.svg', '../Images/Yokai/ouni.svg',
    '../Images/Yokai/rokurokubi.svg', '../Images/Yokai/sankai.svg', '../Images/Yokai/shirime.svg',
    '../Images/Yokai/shojo.svg', '../Images/Yokai/sunekosuri.svg', '../Images/Yokai/tengu.svg',
    '../Images/Yokai/tenonne.svg', '../Images/Yokai/tofukozo.svg', '../Images/Yokai/tsukumogami.svg',
    '../Images/Yokai/tsushigumo.svg', '../Images/Yokai/ubagabi.svg', '../Images/Yokai/ubume.svg',
    '../Images/Yokai/umibozu.svg', '../Images/Yokai/ushioni.svg', '../Images/Yokai/wanyudo.svg',
    '../Images/Yokai/yamachichi.svg', '../Images/Yokai/yamamba.svg', '../Images/Yokai/yamawarara.svg',
    '../Images/Yokai/yamawaro.svg', '../Images/Yokai/yukionna.svg'
  ];

  function getNonOverlappingPosition(usedPositions, minDistance = 60) {
    let maxAttempts = 100;
    while (maxAttempts--) {
      const left = Math.random() * 88;
      const top = Math.random() * 85;
      const isTooClose = usedPositions.some(pos => {
        const dx = pos.left - left;
        const dy = pos.top - top;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });
      if (!isTooClose) return { left, top };
    }
    return { left: Math.random() * 88, top: Math.random() * 85 }; // fallback
  }

  let lives = 3;
  let found = false;

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function getRandomBackground() {
    const backgrounds = [
      '../Images/Background/Niveau1.png', '../Images/Background/Niveau2.png',
      '../Images/Background/Niveau3.png', '../Images/Background/Niveau4.png',
      '../Images/Background/Niveau5.png', '../Images/Background/Niveau6.png',
      '../Images/Background/Niveau7.png', '../Images/Background/Niveau8.png',
      '../Images/Background/Niveau9.png', '../Images/Background/Niveau10.png'
    ];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }

  function generateLevel(level, yokaiCount, nextLevelLabel) {
    lives = 3;
    found = false;
    document.getElementById('lives').textContent = '❤️❤️❤️';
    gameBoard.innerHTML = '';
    document.getElementById('level-label').textContent = `Level ${level}`;
    const usedPositions = [];

    const shuffled = shuffleArray([...yokaiList]);
    const target = shuffled.splice(Math.floor(Math.random() * shuffled.length), 1)[0];
    targetYokaiImg.src = target;

    const targetImg = document.createElement('img');
    targetImg.src = target;
    targetImg.classList.add('yokai-img');
    targetImg.alt = 'yokai';
    const targetPos = getNonOverlappingPosition(usedPositions);
    usedPositions.push(targetPos);
    targetImg.style.position = 'absolute';
    targetImg.style.left = targetPos.left + '%';
    targetImg.style.top = targetPos.top + '%';
    targetImg.style.zIndex = '5';
    targetImg.style.pointerEvents = 'auto';
    targetImg.style.width = '70px';

    targetImg.addEventListener('click', () => {
      if (found) return;
      targetImg.classList.add('yokai-correct');
      found = true;

      const msg = document.createElement('div');
      msg.classList.add('level-message');

      if (level < 5) {
        localStorage.setItem('nextLevel', nextLevelLabel);
        msg.innerHTML = `🎉 You found the yōkai!<br>`;
        const nextBtn = document.createElement('button');
        nextBtn.textContent = `Start Level ${nextLevelLabel}`;
        nextBtn.classList.add('next-level-btn');
        nextBtn.addEventListener('click', () => {
          msg.remove();
          switch (nextLevelLabel) {
            case 2: generateLevel2(); break;
            case 3: generateLevel3(); break;
            case 4: generateLevel4(); break;
            case 5: generateLevel5(); break;
          }
        });
        msg.appendChild(nextBtn);
      } else {
        localStorage.removeItem('nextLevel');
        msg.innerHTML = `🎉 You completed the final level!<br>`;
        const restartBtn = document.createElement('button');
        restartBtn.textContent = `Play Again`;
        restartBtn.classList.add('next-level-btn');
        restartBtn.addEventListener('click', () => {
          generateLevel1();
          msg.remove();
        });
        msg.appendChild(restartBtn);
      }

      gameBoard.appendChild(msg);
    });

    gameBoard.appendChild(targetImg);

    const others = shuffleArray([...shuffled]).slice(0, yokaiCount - 1);
    const doubled = shuffleArray([...others, ...others]);

    doubled.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.classList.add('yokai-img');
      img.alt = 'yokai';
      const pos = getNonOverlappingPosition(usedPositions);
      usedPositions.push(pos);
      img.style.position = 'absolute';
      img.style.left = pos.left + '%';
      img.style.top = pos.top + '%';
      img.style.zIndex = '5';
      img.style.pointerEvents = 'auto';
      img.style.width = '68px';

      img.addEventListener('click', () => {
        if (found) return;
        if (src === target) {
          img.classList.add('yokai-correct');
          found = true;
        } else {
          img.classList.add('yokai-wrong');
          lives--;
          document.getElementById('lives').textContent = '❤️'.repeat(lives);
          if (lives === 0) showGameOver();
        }
      });

      gameBoard.appendChild(img);
    });

    background.style.backgroundImage = `url('${getRandomBackground()}')`;
  }

  function generateLevel1() { generateLevel(1, 19, 2); }
  function generateLevel2() { generateLevel(2, 31, 3); }
  function generateLevel3() { generateLevel(3, 43, 4); }
  function generateLevel4() { generateLevel(4, 52, 5); }
  function generateLevel5() { generateLevel(5, 62, null); }

  startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    gameUI.classList.remove('hidden');
    const savedLevel = parseInt(localStorage.getItem('nextLevel')) || 1;
    document.getElementById('level-label').textContent = `Level ${savedLevel}`;
    switch (savedLevel) {
      case 2: generateLevel2(); break;
      case 3: generateLevel3(); break;
      case 4: generateLevel4(); break;
      case 5: generateLevel5(); break;
      default: generateLevel1();
    }
  });

  function showGameOver() {
    gameOverDiv.classList.remove('hidden');
  }

  function resetGame() {
    localStorage.setItem('nextLevel', '1');
    lives = 3;
    found = false;
    document.getElementById('lives').textContent = '❤️❤️❤️';
    gameBoard.innerHTML = '';
    gameOverDiv.classList.add('hidden');
    document.getElementById('level-label').textContent = 'Level 1';
    overlay.style.display = 'flex';
    gameUI.classList.add('hidden');
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', resetGame);
  }
});

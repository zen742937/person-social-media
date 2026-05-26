// ==========================================================
// Header 滾動時加上不透明背景 + 模糊
// ==========================================================
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.style.background = 'rgba(10, 10, 10, 0.92)';
    header.style.backdropFilter = 'blur(8px)';
  } else {
    header.style.background = 'linear-gradient(to bottom, rgba(10, 10, 10, 0.6), transparent)';
    header.style.backdropFilter = 'none';
  }
});

// ==========================================================
// Reveal 動畫
// 元素加 .reveal 類別後，捲入視窗會自動 fade + 上滑
// 用 Intersection Observer，比 scroll event 省效能
// ==========================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // 動畫只跑一次，跑完就停止觀察這個元素
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,        // 元素出現 15% 時觸發
  rootMargin: '0px 0px -80px 0px', // 提早 80px 觸發，視覺更自然
});

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

// ==========================================================
// Works 篩選器
// 點 tab 切換 active，並依 data-category 顯示／隱藏卡片
// ==========================================================
const filterTabs = document.querySelectorAll('.filter-tab');
const workCards = document.querySelectorAll('.work-card');
const worksEmpty = document.querySelector('.works-empty');

function setFilter(category) {
  let visibleCount = 0;

  workCards.forEach((card) => {
    const matches = category === 'all' || card.dataset.category === category;
    card.classList.toggle('is-hidden', !matches);
    if (matches) visibleCount++;
  });

  filterTabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.filter === category);
  });

  // 沒有作品時顯示空狀態
  if (worksEmpty) worksEmpty.hidden = visibleCount > 0;
}

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => setFilter(tab.dataset.filter));
});

document.querySelectorAll('.service-link[data-filter]').forEach((link) => {
  link.addEventListener('click', () => {
    setFilter(link.dataset.filter);
  });
});

// ==========================================================
// Lightbox 彈窗
// 點作品卡 → 開 lightbox 顯示縮圖 + 標題 + IG 連結
// ==========================================================
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxTag = lightbox?.querySelector('.lightbox-tag');
const lightboxTitle = lightbox?.querySelector('.lightbox-title');
const lightboxClient = lightbox?.querySelector('.lightbox-client');
const lightboxLink = lightbox?.querySelector('.lightbox-link');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

function openLightbox(card) {
  if (!lightbox) return;

  lightboxImage.src = card.dataset.thumb;
  lightboxImage.alt = card.dataset.title;
  lightboxTag.textContent = card.dataset.tag;
  lightboxTitle.textContent = card.dataset.title;
  lightboxClient.textContent = card.dataset.client;
  lightboxLink.href = card.dataset.ig;

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

workCards.forEach((card) => {
  card.addEventListener('click', () => openLightbox(card));
});

lightboxClose?.addEventListener('click', closeLightbox);

// 點背景（非 content）關閉
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ESC 關閉
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox?.classList.contains('is-open')) {
    closeLightbox();
  }
});

  // ==========================================================
  // Stat 數字滾動動畫
  // 元素進入視窗時、數字從 0 跳到目標
  // ==========================================================

  // Step 1：把所有 .stat-number 抓出來
  const statNumbers = document.querySelectorAll('.stat-number');

  // Step 2：解析每個元素的「目標數字」跟「後綴」
  // 例如 "60+" → 目標數字 60、後綴 "+"
  statNumbers.forEach((el) => {
    const text = el.textContent;
    const target = parseInt(text, 10);          // "60+" → 60
    const suffix = text.replace(/[\d-]/g, '');  // 抓非數字 → "+"

    el.dataset.target = target;        // 把目標數字存在元素上（之後動畫用）
    el.dataset.suffix = suffix;        // 把後綴也存著
    el.textContent = '0' + suffix;     // 一開始先顯示 0 + 後綴
  });

  // Step 3：動畫單個元素的 function
  function animateNumber(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix;
    const duration = 1500;                    // ← 填 1：動畫總時長(ms)、建議 1500 (1.5 秒)
    const steps = 25;                        // 分幾步完成
    const stepValue = target / steps;        // 每步增加多少
    const stepTime = duration / steps;       // 每步間隔幾毫秒

    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= target) {
        el.textContent = target + suffix;    // 最後一步、確保顯示精確值
        clearInterval(timer);                // 停止 timer
      } else {
        el.textContent = Math.floor(current) + suffix;       // ← 填 2：current 變成「整數」再顯示（提示：Math.floor）
      }
    }, stepTime);
  }

  // Step 4：用 IntersectionObserver 偵測元素進入畫面、觸發動畫
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        statObserver.unobserve(entry.target);   // 只跑一次、跑完就停止觀察
      }
    });
  }, {
    threshold: 0.5,   // 元素出現 50% 時觸發
  });

  statNumbers.forEach((el) => statObserver.observe(el));
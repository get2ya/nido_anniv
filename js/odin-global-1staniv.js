document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       Version Selector
    ========================= */

    const VERSION_KEY = 'odinSelectedVersion';
    const versionOverlay = document.getElementById('version-selector');

    function applyVersion(version) {
        document.body.classList.remove('v-0409', 'v-0423');
        document.body.classList.add('v-' + version);
        try { localStorage.setItem(VERSION_KEY, version); } catch (e) {}
    }

    function hideVersionOverlay() {
        if (!versionOverlay) return;
        versionOverlay.classList.add('hidden');
        setTimeout(function () { versionOverlay.style.display = 'none'; }, 500);
        document.body.style.overflow = '';
    }

    // Check saved preference
    var savedVersion = null;
    try { savedVersion = localStorage.getItem(VERSION_KEY); } catch (e) {}

    if (savedVersion) {
        applyVersion(savedVersion);
        if (versionOverlay) versionOverlay.style.display = 'none';
    } else if (versionOverlay) {
        document.body.style.overflow = 'hidden';
    }

    // Version button click handlers
    document.querySelectorAll('[data-select-version]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var version = btn.getAttribute('data-select-version');
            applyVersion(version);
            hideVersionOverlay();
        });
    });

    // Re-open version selector
    var switchBtn = document.getElementById('version-switch-btn');
    if (switchBtn) {
        switchBtn.addEventListener('click', function () {
            if (versionOverlay) {
                versionOverlay.style.display = '';
                versionOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    /* =========================
       기본 요소
    ========================= */

    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".nav a[data-target]");

    /* 🔥 추가 */
    const logoLink = document.querySelector("h1 a[data-target]");

    const header = document.querySelector("#header");
    const toggleBtn = document.querySelector(".nav-toggle");

    let current = 0;
    let isScrolling = false;

    /* =========================
       섹션 이동
    ========================= */

    function goToSection(index) {

        if (index < 0 || index >= sections.length) return;

        sections[index].scrollIntoView({
            behavior: "smooth"
        });

    }

    /* =========================
       PC 휠 스크롤
    ========================= */

if (document.body.classList.contains("snap-mode")) {

  let current = 0;
  let isLocked = false;

  let accumulatedDelta = 0;
  let wheelEndTimer;

  const TRIGGER_THRESHOLD = 80;   // 스크롤 힘 임계값
  const GESTURE_END_DELAY = 180;  // 제스처 종료 판단 시간
  const ANIMATION_TIME = 800;     // 섹션 이동 시간

  /* =========================
     섹션 이동 함수
  ========================= */
  function move(direction) {
    if (isLocked) return;

    isLocked = true;

    current += direction;

    if (current < 0) current = 0;
    if (current >= sections.length) current = sections.length - 1;

    goToSection(current);

    // 🔥 애니메이션 끝나야 다시 허용
    setTimeout(() => {
      isLocked = false;
    }, ANIMATION_TIME);
  }

  /* =========================
     휠 (핵심)
  ========================= */
  window.addEventListener("wheel", (e) => {
// 🔥 추가 (모달 열려있으면 무시)
  if (modal.classList.contains("active")) return;
    // 🔥 기본 스크롤 차단 (필수)
    e.preventDefault();

    if (isLocked) return;

    accumulatedDelta += e.deltaY;

    // 🔥 일정 이상 쌓이면 딱 1번만 실행
    if (Math.abs(accumulatedDelta) >= TRIGGER_THRESHOLD) {

      if (accumulatedDelta > 0) {
        move(1);
      } else {
        move(-1);
      }

      accumulatedDelta = 0;
    }

    // 🔥 제스처 끝 감지
    clearTimeout(wheelEndTimer);
    wheelEndTimer = setTimeout(() => {
      accumulatedDelta = 0;
    }, GESTURE_END_DELAY);

  }, { passive: false });

}
    /* =========================
       nav 클릭
    ========================= */

    navLinks.forEach(link => {

        link.addEventListener("click", (e) => {

            e.preventDefault();

            const index = parseInt(e.currentTarget.dataset.target);

            current = index;

            goToSection(index);

        });

    });

    /* =========================
       🔥 h1 로고 클릭 (해시 제거)
    ========================= */

    if (logoLink) {

        logoLink.addEventListener("click", (e) => {

            e.preventDefault();

            const index = parseInt(e.currentTarget.dataset.target);

            current = index;

            goToSection(index);

        });

    }

    /* =========================
       헤더 토글
    ========================= */

    if (toggleBtn && header) {

        toggleBtn.addEventListener("click", () => {

            const isOpen = header.classList.toggle("on");

            toggleBtn.setAttribute("aria-expanded", isOpen);

            document.body.classList.toggle("menu-open", isOpen);

        });

    }

    /* =========================
       nav 클릭 시 메뉴 닫기
    ========================= */

    navLinks.forEach(link => {
        link.addEventListener("click", () => {

            header.classList.remove("on");
            toggleBtn.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");

        });
    });

    /* =========================
       active + aria-current
    ========================= */

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                sections.forEach(s => s.classList.remove("active"));

                navLinks.forEach(n => {
                    n.classList.remove("active");
                    n.removeAttribute("aria-current");
                });

                entry.target.classList.add("active");

                const index = [...sections].indexOf(entry.target);

                navLinks.forEach(n => {
                    if (parseInt(n.dataset.target) === index) {
                        n.classList.add("active");
                        n.setAttribute("aria-current", "true");
                    }
                });

                current = index;

            }

        });

    }, {
        threshold: 0.6
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    //resize
    function resizeBox() {
        const baseHeight = 1080;
        const winHeight = window.innerHeight;
        const winWidth = window.innerWidth;

        const box = document.querySelector('.resize_box');

        if (winWidth > 1181) {
            const scale = winHeight / baseHeight;

            box.style.transform = `translateX(-50%) scale(${scale})`;
        } else {
            box.style.transform = `translateX(-50%) scale(1)`;
        }
    }

    resizeBox();
    window.addEventListener('resize', resizeBox);

    //sns btn cookie
    const buttons = document.querySelectorAll('.close-btn');
    const DAY = 24 * 60 * 60 * 1000;

    buttons.forEach((btn) => {
        const parent = btn.closest('.odin-item');
        if (!parent) return;

        const id = parent.dataset.id;
        const key = `odinClosed_${id}`;

        const saved = localStorage.getItem(key);
        const now = Date.now();

        // 초기 숨김 처리
        if (saved && now < parseInt(saved, 10)) {
            parent.style.display = 'none';
            return;
        } else {
            localStorage.removeItem(key);
        }

        // 닫기 클릭
        btn.addEventListener('click', () => {
            const expire = Date.now() + DAY;
            localStorage.setItem(key, expire);

            parent.classList.add('hide');

            // 애니메이션 끝나고 제거
            setTimeout(() => {
                parent.style.display = 'none';
            }, 300);
        });
    });

    //skipnav
    document.querySelectorAll('.skip-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);

            if (!target) return;

            // 스크롤 이동
            target.scrollIntoView({ behavior: 'smooth' });

            // 접근성: 포커스 이동
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });

    //youtube
    const links = document.querySelectorAll('.yt-popup');
    const modal = document.getElementById('yt-modal');
    const frameWrap = modal.querySelector('.yt-frame');
    const closeBtn = modal.querySelector('.yt-close');
    const dim = modal.querySelector('.yt-dim');

    // 유튜브 ID 추출 함수
    function getYoutubeId(url) {
        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // 열기
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const url = link.getAttribute('href');
            const videoId = getYoutubeId(url);
            if (!videoId) return;

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`;
            iframe.allow = 'autoplay; fullscreen';
            iframe.setAttribute('allowfullscreen', '');

            frameWrap.innerHTML = '';
            frameWrap.appendChild(iframe);

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // 닫기 함수
    function closeModal() {
        modal.classList.remove('active');

        // 👉 영상 완전 제거 (중요)
        frameWrap.innerHTML = '';
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    dim.addEventListener('click', closeModal);

    /*다시보지않기 클릭시 홈페이지 이동
    (() => {
        const checkbox = document.getElementById('dontShow');
        if (!checkbox) return;

        const KEY = 'odinRedirect';
        const URL = 'https://odinvalhallarising.kakaogames.com';
        const EXPIRE = 24 * 60 * 60 * 1000;

        const now = Date.now();
        const saved = localStorage.getItem(KEY);

        if (saved && now < parseInt(saved, 10)) {
            window.location.href = URL;
            return;
        }

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                localStorage.setItem(KEY, Date.now() + EXPIRE);
                window.location.href = URL;
            }
        });
    })();
    */

});


window.addEventListener('load', function () {
    setTimeout(function () {
        document.querySelector('#section1').classList.add('main_active');
    }, 300); // 0.3초 후
});
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const logo = document.getElementById('logo');
if (logo && window.lottie) {
  const animation = lottie.loadAnimation({
    container: logo,
    renderer: 'svg',
    loop: false,
    autoplay: !reducedMotion,
    path: '/assets/animation/logo.json',
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  });
  if (reducedMotion) {
    animation.addEventListener('DOMLoaded', () => animation.goToAndStop(animation.totalFrames - 1, true));
  }
}

const contact = document.getElementById('contact');
if (contact?.showModal) {
  for (const button of document.querySelectorAll('[data-open="contact"]')) {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      contact.showModal();
    });
  }
  contact.querySelector('.close').addEventListener('click', () => contact.close());
  contact.addEventListener('click', (event) => {
    if (event.target === contact) contact.close();
  });
  if (location.hash === '#contact') contact.showModal();

  const form = contact.querySelector('form.contact-form');
  if (form) {
    const ts = form.elements.ts;
    const status = form.querySelector('.status');
    const submit = form.querySelector('button[type="submit"]');
    const show = (text, state) => {
      status.textContent = text;
      status.className = state ? `status ${state}` : 'status';
    };
    ts.value = Date.now();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      show(form.dataset.sending);
      submit.disabled = true;
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const ok = response.ok && (await response.json()).ok;
        show(ok ? form.dataset.sent : form.dataset.error, ok ? 'is-ok' : 'is-failed');
        if (ok) {
          form.reset();
          ts.value = Date.now();
        }
      } catch {
        show(form.dataset.error, 'is-failed');
      } finally {
        submit.disabled = false;
      }
    });
  }
}

const toggle = document.querySelector('[data-toggle-all]');
if (toggle) {
  const jobs = [...document.querySelectorAll('details.job')];
  const allOpen = () => jobs.every((job) => job.open);
  const refresh = () => {
    toggle.textContent = allOpen() ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
    toggle.setAttribute('aria-expanded', String(allOpen()));
  };
  toggle.addEventListener('click', () => {
    const open = !allOpen();
    for (const job of jobs) job.open = open;
    refresh();
  });
  for (const job of jobs) job.addEventListener('toggle', refresh);
  refresh();
}

const demos = document.querySelectorAll('video.demo');
if (demos.length && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    }
  }, { threshold: 0.5 });
  for (const video of demos) {
    video.removeAttribute('controls');
    video.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
    observer.observe(video);
  }
}

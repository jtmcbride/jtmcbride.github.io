(function () {
  'use strict';
  if (!window.HTMLDialogElement) return;
  var dialog = document.createElement('dialog');
  dialog.className = 'project-viewer';
  dialog.setAttribute('aria-label', 'Project screenshots');
  dialog.innerHTML = '<div class="project-viewer-controls"><button type="button" data-direction="-1" aria-label="Previous screenshot">← Previous</button><button type="button" data-close>Close ×</button><button type="button" data-direction="1" aria-label="Next screenshot">Next →</button></div><figure><img alt=""><figcaption aria-live="polite"></figcaption></figure>';
  document.body.appendChild(dialog);
  var shots = [], index = 0, trigger;
  function show(next) {
    index = (next + shots.length) % shots.length;
    var link = shots[index];
    dialog.querySelector('img').src = link.href;
    dialog.querySelector('img').alt = link.querySelector('img').alt;
    dialog.querySelector('figcaption').textContent = link.dataset.caption + ' · ' + (index + 1) + ' / ' + shots.length;
  }
  document.querySelectorAll('.project-shot').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      shots = Array.from(link.closest('.project-gallery').querySelectorAll('.project-shot'));
      show(shots.indexOf(link));
      dialog.showModal();
      document.body.classList.add('project-viewer-open');
      dialog.querySelector('[data-close]').focus();
    });
  });
  dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
  dialog.querySelectorAll('[data-direction]').forEach(function (button) {
    button.addEventListener('click', function () { show(index + Number(button.dataset.direction)); });
  });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () {
    document.body.classList.remove('project-viewer-open');
    if (trigger) trigger.focus();
  });
})();

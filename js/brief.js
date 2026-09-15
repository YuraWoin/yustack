(function () {
  var form = document.getElementById('brief');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('b-name');
    var niche = document.getElementById('b-niche');
    var pain = document.getElementById('b-pain');

    var missing = [];
    if (!name.value.trim()) missing.push(name);
    if (!niche.value.trim()) missing.push(niche);
    if (!pain.value.trim()) missing.push(pain);

    if (missing.length) {
      missing.forEach(function (el) {
        el.style.borderColor = '#ff5f5f';
        el.style.boxShadow = '0 0 0 3px rgba(255,95,95,.12)';
      });
      return;
    }

    var msg = 'Привіт, Юра! Хочу бота для бізнесу.' +
      '\n\nІм\u2019я / назва: ' + name.value.trim() +
      '\nНіша: ' + niche.value.trim() +
      '\n\nЩо зараз робимо руками:\n' + pain.value.trim();

    var url = 'https://t.me/YuraWoin?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener');
  });

  form.addEventListener('input', function (e) {
    if (e.target && e.target.style && e.target.style.borderColor === 'rgb(255, 95, 95)') {
      e.target.style.borderColor = '';
      e.target.style.boxShadow = '';
    }
  });
})();
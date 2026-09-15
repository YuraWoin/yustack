(function () {
  var target = document.getElementById('typeline');
  if (!target) return;

  var words = [
    'Салон записує клієнтів без дзвінків.',
    'Кафе приймає замовлення вночі.',
    'Магазин відповідає «скільки коштує?» сам.',
    'Експерт не губить заявку, поки спить.'
  ];

  var SPEED = 46;     // type
  var PAUSE = 1800;   // hold full
  var fadeCSS = 'css-fade';

  var w = 0, i = 0, deleting = false;

  function loop() {
    var word = words[w];
    if (!deleting) {
      i++;
      target.textContent = word.slice(0, i);
      if (i >= word.length) { deleting = true; setTimeout(loop, PAUSE); return; }
      setTimeout(loop, SPEED);
    } else {
      i -= 2;
      if (i <= 0) { deleting = false; i = 0; w = (w + 1) % words.length; }
      target.textContent = word.slice(0, Math.max(0, i));
      setTimeout(loop, SPEED);
    }
  }
  loop();
})();
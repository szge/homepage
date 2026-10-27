(function () {
  var root = document.getElementById('square-demo');
  var vals = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var grid = document.createElement('div');
  grid.className = 'grid';
  var btn = document.createElement('button');
  btn.textContent = 'Random permutation';
  var msg = document.createElement('div');
  msg.className = 'msg';
  root.append(grid, document.createElement('br'), btn, msg);

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
  }

  function render() {
    var rows = [0, 0, 0], cols = [0, 0, 0];
    vals.forEach(function (v, i) { rows[Math.floor(i / 3)] += v; cols[i % 3] += v; });
    var all = rows.concat(cols);
    var win = all.every(function (s) { return s === all[0]; });
    grid.innerHTML = '';
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var el = document.createElement('div');
        if (r < 3 && c < 3) {
          el.className = 'cell num';
          el.dataset.i = r * 3 + c;
          el.textContent = vals[r * 3 + c];
        } else if (r < 3 || c < 3) {
          var s = r < 3 ? rows[r] : cols[c];
          el.className = 'cell sum' + (win ? ' match' : '');
          el.textContent = s;
        }
        grid.appendChild(el);
      }
    }
    msg.textContent = win ? 'Every row and column sums to ' + all[0] + '. Nice work!' : '';
  }

  var drag = null;

  grid.addEventListener('pointerdown', function (e) {
    var el = e.target.closest('.num');
    if (!el) return;
    e.preventDefault();
    var ghost = el.cloneNode(true);
    ghost.classList.add('ghost');
    root.appendChild(ghost);
    el.classList.add('dragging');
    drag = { from: +el.dataset.i, el: el, ghost: ghost, over: null };
    move(e);
  });

  function move(e) {
    if (!drag) return;
    drag.ghost.style.left = e.clientX - 36 + 'px';
    drag.ghost.style.top = e.clientY - 36 + 'px';
    var t = document.elementFromPoint(e.clientX, e.clientY);
    var over = t && t.closest ? t.closest('#square-demo .num') : null;
    if (drag.over && drag.over !== over) drag.over.classList.remove('over');
    if (over && over !== drag.el) over.classList.add('over');
    drag.over = over;
  }

  function end(e) {
    if (!drag) return;
    var d = drag;
    drag = null;
    d.ghost.remove();
    if (d.over && d.over !== d.el) {
      var to = +d.over.dataset.i;
      var t = vals[d.from]; vals[d.from] = vals[to]; vals[to] = t;
    }
    render();
  }

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);

  btn.addEventListener('click', function () { shuffle(vals); render(); });
  render();
})();

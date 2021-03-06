var names = document.getElementById('names');
var shuffle = document.getElementById('shuffle');
var clear = document.getElementById('clear');

shuffle.addEventListener('click', function() {
  shuffleChildren(names);
  save(names);
}, false);

clear.addEventListener('click', function() {
  names.innerHTML = '';
  save(names);
  addBox(names);
}, false);

names.addEventListener('input', function() {
  save(names);
}, false);

names.addEventListener('keydown', function(e) {
  if (e.which == 13) {
    e.preventDefault();
    if (e.target.innerHTML != '') {
      addBox(names, e.target);
    }
  }
  if (e.which == 9) {
    if (!e.shiftKey && e.target == names.lastChild && e.target.innerHTML != '') {
      e.preventDefault();
      addBox(names);
    }
    if (e.shiftKey && e.target == names.firstChild) {
      e.preventDefault();
    }
  }
}, false);

names.addEventListener('blur', function(e) {
  if (names.children.length > 1 && e.target.innerHTML == '') {
    names.removeChild(e.target);
  }
}, true);

function shuffleChildren(node) {
  var children = node.children;
  var currentIndex = children.length;
  // While there remain elements to shuffle...
  while (currentIndex) {
    // Pick a remaining element...
    var randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    var cur = children[currentIndex];
    var swap = children[randomIndex];
    node.insertBefore(swap, cur);
    node.insertBefore(cur, children[randomIndex]);
  }
}

function addBox(node, after) {
  var box = document.createElement('div');
  box.setAttribute('contenteditable', 'true');
  if (after) {
    node.insertBefore(box, after.nextSibling);
  }
  else {
    node.appendChild(box);
  }
  box.focus();
  return box;
}

function save(node) {
  var children = node.children;
  var items = [];
  for (var i = 0; i < children.length; i++) {
    if (children[i].innerHTML) {
      items[i] = children[i].innerHTML;
    }
  }
  localStorage['saved'] = JSON.stringify({items:items});
  var newurl = location.protocol + "//" + location.host + location.pathname + '?items=' + items.join(',');
  history.replaceState(null, null, newurl);
}

function load(node) {
  var qs = location.search.substring(1).split('&').map(function(e) {
    return e.split('=')
  }).reduce(function(o, e){
    o[e[0]] = decodeURI(e[1]);
    return o
  }, {});
  var items = [];
  if (qs.items) {
    items = qs.items.split(',');
  }
  else {
    var savedJSON = localStorage['saved'];
    if (savedJSON) {
      var saved = JSON.parse(savedJSON);
      if (saved && saved.items) {
        items = saved.items;
      }
    }
  }
  node.innerHTML = '';
  items.forEach(function(item) {
    addBox(node).innerHTML = item;
  });
  if (!node.children.length) {
    addBox(node);
  }
}

load(names);

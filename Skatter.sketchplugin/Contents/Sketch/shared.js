function randomRotate(layer) {
  layer.setRotation(Math.random() * 360);
}

function removeItems(_items) {
    for (var i = 0; i < _items.count(); i++) {
      _items[i].remove();
    }
}

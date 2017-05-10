//
// This is no way near finished
//
// todo:
//    figure out cocoa so a dialog to manage randomness and entropy can be developed

@import 'shared.js'

var _w = 1600
var _h = 640
var maxDimension = 0
var entropy = 50
var spaceScale = 1.5
var selection = []
var artboards = []
var artboard = null
var layers = []
var container = null

function onRun(context) {
  var sketch = context.api()
  var doc = context.document

  selection = sketch.selectedDocument.selectedLayers
  layers = selection.nativeLayers

  if (layers.count() == 0) {
    doc.showMessage('Hey stoops! You need to select some layers to arrange.')
    return;
  }

  selection.iterate(function(layer){
    if (layer.container.isArtboard) {
      container = layer.container
    }
  })

  for (var i = 0; i < layers.count(); i++) {
    maxDimension = Math.max(maxDimension, Math.max(layers[i].frame().width(), layers[i].frame().height()))
    parent = layers
  }

  maxDimension *= spaceScale

  // log('maxDimension: ' + maxDimension)

  grid()

  selection.iterate(function(layer){
    layer.remove()
  })
}

function grid() {
  var group = null
  var prevLayerName = ''

  if (container != null) {
    _w = container.sketchObject.frame().width();
    _h = container.sketchObject.frame().height();

    group = container.newGroup();
  }

  var cols = Math.floor(_w / maxDimension)
  var rows = Math.floor(_h / maxDimension)

  log('cols: ' + cols + ', rows: ' + rows)

  var rowCount = 0
  var colCount = 0
  var units = cols * rows
  var item = getRandomLayer();

  for (var i = 0; i < units; i++) {

    while(item.name() == prevLayerName) {
      item = getRandomLayer();
    }

    prevLayerName = item.name()

    var dupe = item.duplicate();

    var posX = colCount * maxDimension + Math.floor(Math.random() * (Math.round(Math.random())?-entropy:entropy))
    var posY = rowCount * maxDimension + Math.floor(Math.random() * (Math.round(Math.random())?-entropy:entropy))

    // log('posX: ' + posX + ', posY: ' + posY)

    if (colCount == cols - 1) {
      colCount = 0
      rowCount++;
    }
    else {
      colCount++
    }

    dupe.frame().setX(posX + maxDimension / 2)
    dupe.frame().setY(posY + maxDimension / 2)

    randomRotate(dupe)
  }
}

function getRandomLayer() {
  return layers[Math.floor(Math.random() * layers.length)]
}

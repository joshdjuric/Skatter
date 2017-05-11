//
// This is no way near finished
//
// todo:
//    figure out cocoa so a dialog to manage randomness and entropy can be developed

@import 'shared.js'

var _w = 1600
var _h = 640
var maxDimension = 0
var entropy = 0
var spaceScale = 1 // NEVER SET THIS TO ZERO todo: error handling
var selection = []
var artboards = []
var artboard = null
var layers = []
var container = null

function onRun(context) {
  var sketch = context.api()
  var doc = context.document
  spaceScale = [doc askForUserInput:"Extra space scale %" initialValue:"0"]
  spaceScale = 1 + spaceScale / 100

  entropy = [doc askForUserInput:"Entropy % (the larger the number the more random the Skatter)" initialValue:"0"]

  selection = sketch.selectedDocument.selectedLayers
  layers = selection.nativeLayers

  if (layers.count() == 0) {
    doc.showMessage('Hey stoops! You need to select some layers to arrange.')
    return;
  }

  selection.iterate(function(layer){
    if (layer.container.isArtboard ||
        layer.container.isGroup) {
      container = layer.container
    }
  })

  for (var i = 0; i < layers.count(); i++) {
    maxDimension = Math.ceil(Math.max(maxDimension, Math.max(layers[i].frame().width(), layers[i].frame().height())))
    parent = layers
  }

  maxDimension *= spaceScale

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

    // group = container.newGroup();
  }

  var cols = Math.ceil(_w / maxDimension)
  var rows = Math.ceil(_h / maxDimension)

  var rowCount = 0
  var colCount = 0
  var unitX = _w / cols
  var unitY = _h / rows
  var units = (cols + 1) * (rows + 1)
  var item = getRandomLayer();

  for (var i = 0; i < units; i++) {
    if (layers.count() > 1) {
      while(item.name() == prevLayerName) {
        item = getRandomLayer()
      }
    }

    prevLayerName = item.name()

    var dupe = item.duplicate()
    dupe.name = 'col: ' + colCount + ', row:' + rowCount
    // dupe.moveToBack()

    var posX = applyEntropy(colCount * unitX)
    var posY = applyEntropy(rowCount * unitY)

    if (colCount == cols) {
      colCount = 0
      rowCount++;
    }
    else {
      colCount++
    }

    dupe.frame().setX(posX - dupe.frame().width() / 2)
    dupe.frame().setY(posY - dupe.frame().height() / 2)

    randomRotate(dupe)
  }
}

function applyEntropy(value) {
  return value + Math.floor(Math.random() * (Math.round(Math.random())?-entropy:entropy))
}

function getRandomLayer() {
  return layers[Math.floor(Math.random() * layers.length)]
}

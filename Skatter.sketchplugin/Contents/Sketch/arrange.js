//
// This is no way near finished
//
// todo:
//    figure out cocoa so a dialog to manage randomness and entropy can be developed

@import 'shared.js'

//  Base dimensions (if no artboard or parent group present)
var _w = 1600
var _h = 640

//  This will be the longest dimension of the selected layers
var maxDimension = 0

//  Handles
var positionEntropy = 0
var spaceScale = 1 // NEVER SET THIS TO ZERO todo: error handling
var sizeEntropy = 0

//  Layers and groups
var selection = []
var layers = []
var container = null

function onRun(context) {
  var sketch = context.api()
  var doc = context.document

  //  Get selection
  selection = sketch.selectedDocument.selectedLayers
  layers = selection.nativeLayers

  //  Ensure there is anything selected in the first place
  if (layers.count() == 0) {
    doc.showMessage('Hey stoops! You need to select some layers to arrange. Using zero instead.')
    return;
  }

  //  Find a parent container (this could be smarter; at the moment it just gets the last found container)
  selection.iterate(function(layer){
    if (layer.container.isArtboard ||
        layer.container.isGroup) {
      container = layer.container
    }
  })

  //  Ask for scale handle value
  spaceScale = parseInt([doc askForUserInput:"Extra space scale %" initialValue:"0"])

  //  Make sure scale is set correctly
  if (isNaN(spaceScale)) {
    doc.showMessage('Hey stoops! Space scale needs to be a number. Using 1 instead.')
    spaceScale = 1
  }
  else {
    spaceScale = 1 + spaceScale / 100
  }

  //  Ask for entropy handle value
  positionEntropy = parseInt([doc askForUserInput:"Entropy % (the larger the number the more random the Skatter)" initialValue:"0"])

  //  Make sure entropy is set correctly
  if (isNaN(positionEntropy)) {
    doc.showMessage('Hey stoops! Entropy needs to be a number.')
    positionEntropy = 0;
  }

  //  Ask for size entropy handle value
  sizeEntropy = parseInt([doc askForUserInput:"Size entropy % (the larger the number the more random the sizes)" initialValue:"0"])

  //  Make sure entropy is set correctly
  if (isNaN(sizeEntropy)) {
    doc.showMessage('Hey stoops! Size entropy needs to be a number.')
    sizeEntropy = 0;
  }

  //  Determine maxDimension based on largest dimension of selected layers
  for (var i = 0; i < layers.count(); i++) {
    maxDimension = Math.ceil(Math.max(maxDimension, Math.max(layers[i].frame().width(), layers[i].frame().height())))
    parent = layers
  }

  //  Adjust maxDimension by specified scale handle
  maxDimension *= spaceScale

  //  We're ready to Skatter
  skatter()

  //  Remove originals
  selection.iterate(function(layer){
    layer.remove()
  })
}

function skatter() {

  //  I'd like the skatterings to a new group eventually
  var group = null

  //  This variable is for ensuring limited consectutive skatterings
  var prevLayerName = ''

  //  Determine dimensions to skatter in
  if (container != null) {
    _w = container.sketchObject.frame().width();
    _h = container.sketchObject.frame().height();
  }

  //  Determine grid
  //  Using ceil roughly uses max dimension but divides the space equally
  var cols = Math.ceil(_w / maxDimension)
  var rows = Math.ceil(_h / maxDimension)

  //  Loop vars
  var rowCount = 0
  var colCount = 0

  // The proper unit space
  var unitX = _w / cols
  var unitY = _h / rows

  //  Number of units required to fill grid
  var units = (cols + 1) * (rows + 1)
  var item = getRandomLayer();

  //  Let's skatter
  for (var i = 0; i < units; i++) {
    //  Limit consectutive skatterings (if more than one item in selection)
    //  This only works horizontally for now
    if (layers.count() > 1) {
      while(item.name() == prevLayerName) {
        item = getRandomLayer()
      }
    }

    prevLayerName = item.name()

    //  Duplicate randomly selected item
    var dupe = item.duplicate()

    //  Update name
    dupe.name = 'col: ' + colCount + ', row:' + rowCount

    //  Apply size entropy
    var scaleWithEntropy = getSizeEntropyScale()
    dupe.frame().width = scaleWithEntropy * dupe.frame().width()
    dupe.frame().height = scaleWithEntropy * dupe.frame().height()

    //  Determine position of new duplicate and apply any entropy
    var posX = applyPositionEntropy(colCount * unitX)
    var posY = applyPositionEntropy(rowCount * unitY)

    //  Apply position
    dupe.frame().setX(posX - dupe.frame().width() / 2)
    dupe.frame().setY(posY - dupe.frame().height() / 2)

    //  Apply rotation
    //  This should be adjusted by a handle in future
    randomRotate(dupe)

    //  Row/column counter
    if (colCount == cols) {
      colCount = 0
      rowCount++;
    }
    else {
      colCount++
    }
  }
}

//  Entropy algorithm
function applyPositionEntropy(value) {
  return value + Math.floor(Math.random() * (Math.round(Math.random())?-positionEntropy:positionEntropy))
}

function getSizeEntropyScale() {
  var rand = (sizeEntropy / 100) * Math.random()
  return (1 + (Math.round(Math.random())?-rand:rand))
}

//  Get next layer to duplicate
//  Managing consectutive skatterings should probably happen here in future
function getRandomLayer() {
  return layers[Math.floor(Math.random() * layers.length)]
}

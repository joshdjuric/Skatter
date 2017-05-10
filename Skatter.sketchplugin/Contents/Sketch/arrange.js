//
// This is no way near finished
//
// todo: determine artboard of selected layers
//    use artboard width and height as basis for area to Skatterify
//    duplicate selected layers at grid points based on the largest dimenion of the largest shape in the artboard area
//    figure out cocoa so a dialog to manage randomness and entropy can be developed

@import 'shared.js'

var _w = 1600
var _h = 640
var maxDimension = 0;

// var artboard = null
var layers = []

function onRun(context) {
  var doc = context.document;
  var selection = context.selection;

  if (selection.count() == 0) {
    doc.showMessage('Hey stoops! You need to select some layers to arrange.');
    return;
  }

  for (var i = 0; i < selection.count(); i++) {
    layers.push(selection[i]);
    maxDimension = Math.max(maxDimension, Math.max(selection[i].frame().width(), selection[i].frame().height()))
  }

  // if (!artboard) {
  //   doc.showMessage('Hey stoops! You need to select an artboard to arrange on.');
  //   return;
  // }

  doc.showMessage('maxDimension: ' + maxDimension)

  grid()
}

function grid() {
  var cols = Math.floor(_w / maxDimension);
  var rows = Math.floor(_h / maxDimension);
  var rowCount = 0
  var colCount = 0
  var units = cols * rows

  for (var i = 0; i < units; i++) {
    var item = layers[Math.floor(Math.random() * layers.length)]
    var dupe = item.duplicate();
    var posX = colCount * maxDimension
    var poxY = rowCount * maxDimension

    if (colCount == cols - 1) {
      colCount = 0
      rowCount++;
    }

    dupe.frame().setX(posX);
    dupe.frame().setY(poxY);
    // randomRotate(dupe);
  }
}

@import 'shared.js'

function onRun(context) {

  var doc = context.document;
  var selection = context.selection
  var sketch = context.api()

  if (selection.count() > 0) {
    for (var i = 0; i < selection.count(); i++) {
      randomRotate(selection.objectAtIndex(i))
    }
  }
  else {
    doc.showMessage("Hey stoops! You need to select something first.");
  }
};

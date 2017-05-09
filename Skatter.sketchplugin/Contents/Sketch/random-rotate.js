function onRun(context) {

  // We are passed a context variable when we're run.
  // We use this to get hold of a javascript object
  // which we can use in turn to manipulate Sketch.
  var selection = context.selection
  var sketch = context.api()

  // Now let's create a new text layer, using a large font, and a traditional value...
  if (selection.count() > 0) {
    for (var i = 0; i < selection.count(); i++) {
      selection.objectAtIndex(i).setRotation(Math.random() * 360);
    }
  }
};

# Skatter
Currently a work in progress. I'd like Skatter to be a plugin with tools to assist with creating randomised patterns out of pre-determined shapes. 

## Arrange skatter
Select the layers you'd like to Skatter and it will fill the artboard.

Shortcut key -> alt cmd A :tada:

Todo:
  - Better artboard support
  - Add UI to adjust entropy, spacing and rotation handles
  
Eventually, I'd like to implement some kind of dialog to adjust certain variables. Perhaps even extend the group class to allow adjusting handles after skattering. For the meantime; you can hack the plugin and edit the entropy and spaceScale variables for extra space and random positioning. 

![PreviewArrange](https://raw.githubusercontent.com/joshdjuric/Skatter/master/docs/preview-arrange.gif "Preview arrange")

## Random rotate
Select your layers and rotate them... randomly.

Shortcut key -> alt cmd R :boom: 

Todo:
  - add entropy handle
  
![PreviewRotation](https://raw.githubusercontent.com/joshdjuric/Skatter/master/docs/preview-rotation.gif "Preview rotation")

## Beware
This is currently kinda shit and largely un-tested. Seems to work with groups, text layers, shapes. However, many apologies if it crashes Sketch for you.

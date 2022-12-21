var sketch = require('sketch');

var onRun = function(context) {
    
    //references
	var doc = context.document;

	//reference what is selected
	var selection = context.selection;

	//required iconsizes
	var iconsize = [12, 14, 16, 20, 28, 32, 40, 48, 64];

	//make sure something is selected
	if(selection.count() == 0){
		doc.showMessage("Please select one or more 24dp icon symbols.");
	}else{

		//initial vertical alignment
		initialAlignment(selection);

		//loop through the selected layers
		for(var i = 0; i < selection.count(); i++){
			var allIcons = [];

			//checks to see if the layer is an artboard
			if(selection[i].class() == "MSSymbolMaster"){

				//reference the selection
				var selectedIcon = selection[i];
				symbolName = selectedIcon.name();
				symbolPosX = selectedIcon.frame().x();
				symbolPosY = selectedIcon.frame().y();

				for(j=0; j < iconsize.length; j++) {
					//duplicate symbol
					var newSymbol = selectedIcon.duplicate();

		            //set scale and border width
		            var newSymbolScale = iconsize[j]/24;
		            var newSymbolBorderWidth = iconsize[j]/16+0.5;

		            //scale new symbol
					newSymbol.multiplyBy(newSymbolScale);

					//set new border thickness
		            var newSymbolPaths = newSymbol.children();
		            for(k=0; k < newSymbolPaths.length; k++){		            	
		            	if(newSymbolPaths[k].name() == 'stroke') {
		            		var newSymbolBorder = newSymbolPaths[k].style().borders();
							newSymbolBorder[0].thickness = newSymbolBorderWidth;
		            	}
		            }

		            //change name of new symbol
		            var newSymbolName = symbolName.replace(24, iconsize[j]);
		            newSymbol.name = newSymbolName;
		            allIcons.push(newSymbol);

				}
				allIcons.splice(4, 0, selectedIcon);
				iconAlignment(allIcons, symbolPosX, symbolPosY);

				doc.showMessage("All icon sizes were created ⭐️");

			}else{
				doc.showMessage("Please select an 24dp symbol.");
			}
		}
	}
}

function initialAlignment(selection) {
	var offset = 100;
	var PosX = selection[0].frame().x();
	var firstPosY = selection[0].frame().y();
	var symbolPosY = firstPosY;

	for(l=0; l < selection.length; l++) {
		var symbolHeight = selection[l].frame().height();
		if(l > 0) {
			symbolPosY = selection[l-1].frame().y() + symbolHeight + offset;
		}
		selection[l].frame().x = PosX;
		selection[l].frame().y = symbolPosY;
	}
}

function iconAlignment(allIcons, symbolPosX, symbolPosY) {
	var offsetX = 20;

	for(l=0; l < allIcons.length; l++) {
		if(l > 0) {
			var preSymbolWidth = allIcons[l-1].frame().width();	
			symbolPosX = symbolPosX + preSymbolWidth + offsetX;
		}
		allIcons[l].frame().x = symbolPosX;
		allIcons[l].frame().y = symbolPosY;
	}
}
var sketch = require('sketch');

var onRun = function(context) {
    
    //references
	var doc = context.document;

	//reference what is selected
	var selection = context.selection;

	//required iconsizes
	var iconsize = [10, 12, 14, 16, 20, 28, 32, 40, 48, 64, 80, 96, 120];

	//make sure something is selected
	if(selection.count() == 0){
		doc.showMessage("📍 Please select one or more 24dp icon symbols");
	}else{

		//check icon sizes and layer type
		if(initialCheck(selection)){

			//initial vertical alignment
			initialAlignment(selection);

			//loop through the selected layers
			for(var i = 0; i < selection.count(); i++){
				var allIcons = [];

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
		            var newSymbolBorderWidthStroke = iconsize[j]/15+0.38;
		            var newSymbolBorderWidthCutout = iconsize[j]/12-0.2+(iconsize[j]*0.01);

		            //scale new symbol
					newSymbol.multiplyBy(newSymbolScale);

					//set new border thickness
		            var newSymbolPaths = newSymbol.children();
		            for(k=0; k < newSymbolPaths.length; k++){		            	
		            	if(newSymbolPaths[k].name() == 'border-outline') {
		            		var newSymbolBorder = newSymbolPaths[k].style().borders();
							var newSymbolOutlineWidth = newSymbolBorderWidthStroke.toFixed(1);
							newSymbolBorder[0].thickness = newSymbolOutlineWidth;
      
		            	}
		            	if(newSymbolPaths[k].name() == 'border-cutout') {
		            		var newSymbolBorder = newSymbolPaths[k].style().borders();
		            		var newSymbolCutoutWith = newSymbolBorderWidthCutout.toFixed(1);
							newSymbolBorder[0].thickness = newSymbolCutoutWith;
		            	}
		            }

		            //change name of new symbol
		            var newSymbolName = symbolName.replace(24, iconsize[j]);
		            newSymbol.name = newSymbolName;
		            allIcons.push(newSymbol);

				}
				allIcons.splice(5, 0, selectedIcon);
				iconAlignment(allIcons, symbolPosX, symbolPosY);

				doc.showMessage("All icon sizes were created ⭐️");

			}
		}else{
			doc.showMessage("📍 Please select one or more 24dp icon symbols");
		}

	}
}

function initialCheck(selection) {
	var check = true;
	for(i=0; i < selection.length; i++) {
		if (selection[i].class() != "MSSymbolMaster" || selection[i].frame().width() != 24 || selection[i].frame().height() != 24){
			check = false;
		}
	}
	return check;
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
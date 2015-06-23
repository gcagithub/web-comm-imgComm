/*
	Tooltipster module.

	imports:
		getTagNameImgHashId()
		getLocalizeString(String)
		clickShowPopupWebCommForm()

	exports:
		toggleImgCommTooltips(true|false)
*/
var MODULE = (function(scope) {
	var getTagNameHashId = scope.getTagNameImgHashId();
	var toolTipsterOpenForm;

	this.toggleImgCommTooltips = function (isEnable) {
		if (isEnable) {
			if(!$('img[' + getTagNameHashId + ']').hasClass('tooltipstered')) {
				var title = scope.getLocalizeString('tooltip_create_comment');
				console.log(title);
				toolTipsterOpenForm = $('img[' + getTagNameHashId + ']').tooltipster({
						content: $("<span><a href='create_comment'></a></span>").children().text(title),
						position: 'bottom-left',
						interactive : true,
						multiple: true,
						theme: "tooltipster-noir",
						functionReady: onTooltipeReady
				});
			}
			tooltipsEnable ();
		} else {
			tooltipsDisable ();
		}
	}

	scope.toggleImgCommTooltips = this.toggleImgCommTooltips;

	function tooltipsEnable () {
	 	for(i in toolTipsterOpenForm){
	 		toolTipsterOpenForm[i].enable();
	 	}

		// var tips = _imgCommData['webCommTooltips'];
		// for(i in tips) {
		// 	tips[i].enabled = true;
		// }
	}

	function tooltipsDisable () {
	 for(i in toolTipsterOpenForm){
	 		toolTipsterOpenForm[i].hide();
	 		toolTipsterOpenForm[i].disable();
	 	}

		// var tips = _imgCommData['webCommTooltips'];
		// for(i in tips) {
		// 	tips[i].enabled = false;
		// }
	}

	function onTooltipeReady (origin, tooltip) {
		scope.clickShowPopupWebCommForm (origin, tooltip);
	}

	return scope;
}(MODULE || {}));

/**
 * Slithery jQuery Plugin v0.1-dev
 * Date: 2012-03-16
 * Info: <GITHUB URL GOES HERE>
 *
 * Usage:
 *		Simple:
 *		$('#element').slithery();
 *
 *		With settings:
 *		$('#element').slithery({
			position: 'left',
 *			top: 500,
 *			speed: 1000
 *		});
 *
 * (optional) Position:	The position of the element, valid arguments: top, right, left, bottom. (default: top).
 * (optional) Top:		The amount of pixels from the top of the page before the element will be displayed.
 * (optional) Speed:	The time (in miliseconds) it takes for the element to be fully displayed.
 * (optional) onShow:	Function to be run each time the element has been fully shown.
 * (optional) onHide:	Function to be run each time the element has been fully hidden.
 */

(function($) {
	$.fn.extend({
		slithery: function(settings) {
			return this.each(function() {
				var obj = $(this);
				var animShow = {};
				var animHide = {};
				var posCss, posAnim;
				var animating = false; // Flag to check if we're already in the middle of an animation
				var position = obj.position()['top']; // Position of the element from the top of the page in pixels
				
				// Default values
				var defaults = {
					top: 0,
					speed: 300
				}
				
				// Settings should be defaults if none are given
				if(typeof settings === 'undefined') {
					alert("hurr");
					settings = {};
				}
				
				var vars = {}
				
				// Set values if they're set, otherwise fall back to defaults
				vars['position'] = ((settings['position'] !== undefined) ? settings['position'] : defaults['position']);
				vars['top'] = ((settings['top'] !== undefined) ? settings['top'] : defaults['top']);
				vars['speed'] = ((settings['speed'] !== undefined) ? settings['speed'] : defaults['speed']);
				
				if(settings['onHide'] !== undefined) vars['onHide'] = settings['onHide'];
				if(settings['onShow'] !== undefined) vars['onShow'] = settings['onShow'];
				
				
				switch(vars['position']) {
					default:
					case 'top':
						posCss	= 'margin-top';
						posAnim = 'marginTop';
						objSize = obj.outerHeight();
						break;
						
					case 'left':
						posCss	= 'margin-left';
						posAnim = 'marginLeft';
						objSize = obj.outerWidth();
						break;
						
					case 'right':
						posCss	= 'margin-right';
						posAnim = 'marginRight';
						objSize = obj.outerWidth();
						break;
						
					case 'bottom':
						posCss	= 'margin-bottom';
						posAnim = 'marginBottom';
						objSize = obj.outerHeight();
						break;
				}
				
				animShow[posAnim] = 0;
				animHide[posAnim] = -objSize;
				
				// Trigger a check each time the user scrolls
				$(window).bind('scroll', function() {
					// Update position of the element
					position = obj.position()['top'];
					
					// If the element is further down than we want
					if(position > (vars['top'] + objSize)) {
						// is not in the middle of an animation and not visible
						if(!animating && !obj.is(':visible')) {
							animating = true;
							
							// Show our element
							obj.css(posCss, -objSize);
							obj.show();
							obj.animate(animShow, {
								duration: vars['speed'],
								complete: function() {
									animating = false;
									
									// Run onShow if set by user
									if(vars['onShow'] !== undefined) {
										vars['onShow']();
									}
								}
							});
						}
					} else if(position < (vars['top'] - objSize)) {
						// We should hide it if it's visible and not already being hidden
						if(!animating && obj.is(':visible')) {
							animating = true;
							
							// Hide element
							obj.animate(animHide, {
								'duration': vars['speed'],
								'complete': function() {
									obj.hide();
									animating = false;
									
									// Run onHide if set by user
									if(vars['onHide'] !== undefined) {
										vars['onHide']();
									}
								}
							});
						}
					}
				});
			});
		}
	});
})(jQuery);

/**
 * Slithery jQuery Plugin v0.2
 * Date: 2012-03-17
 * Info: https://github.com/Goosk/jQuery-Slithery
 */

(function($) {
	$.fn.extend({
		slithery: function(settings) {
			return this.each(function() {
				var obj = $(this);
				var animShow = {};
				var animHide = {};
				var $window = $(window);
				var posCss, posAnim;
				var animating = false; // Flag to check if we're already in the middle of an animation
				var position = obj.position()['top']; // Position of the element from the top of the page in pixels
				
				// Default values
				var defaults = {
					position: 'top',
					easing: 'linear',
					top: 300,
					speed: 250
				};
				
				// Settings should be defaults if none are given
				if(typeof settings === 'undefined') {
					settings = {};
				}
				
				var vars = {};
				
				// Set values if they're set, otherwise fall back to defaults
				vars['position'] = ((settings['position'] !== undefined) ? settings['position'] : defaults['position']);
				vars['easing'] = ((settings['easing'] !== undefined) ? settings['easing'] : defaults['easing']);
				vars['top'] = ((settings['top'] !== undefined) ? settings['top'] : defaults['top']);
				vars['speed'] = ((settings['speed'] !== undefined) ? settings['speed'] : defaults['speed']);
				
				if(settings['onHide'] !== undefined) vars['onHide'] = settings['onHide'];
				if(settings['onShow'] !== undefined) vars['onShow'] = settings['onShow'];
				
				// Set the right values for animations
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
				
				animShow[posAnim] = [0, vars['easing']];
				animHide[posAnim] = [-objSize, vars['easing']];
				
				var update = function() {
					// Update position of the element
					position = $window.scrollTop();
					
					// If the element is further down than we want
					if(position > vars['top']) {
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
					} else if(position < (vars['top'] + 5)) {
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
				}
				
				// Trigger a check each time the user scrolls
				$window.bind('scroll', function() {
					update();
					
					// @TODO: Replace with animation check instead
					setTimeout(update, vars['speed']);
				});
			});
		}
	});
})(jQuery);

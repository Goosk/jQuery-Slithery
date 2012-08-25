/**
 * Slithery jQuery Plugin v0.2.1
 * Date: 2012-08-25
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
				var posCss, posAnim, objSize;
				var animating = false; // Flag to check if we're already in the middle of an animation
				var position = obj.position()['top']; // Position of the element from the top of the page in pixels

				// Settings should be defaults if none are given
				if(typeof settings === 'undefined') {
					settings = {};
				}
				
				// Default values
				var vars = {
					position: 'top',
					easing: 'linear',
					top: 300,
					speed: 250
				};
				
				$.extend(vars, settings);

				// Set positions and animations so the objects will animate correctly
				posCss = 'margin-'+ vars['position'];
				posAnim = 'margin'+ vars['position'].charAt(0).toUpperCase() + vars['position'].slice(1);
				
				if(vars['position'] == 'top' || vars['position'] == 'bottom') {
					objSize = obj.outerHeight();
				} else if (vars['position'] == 'left' || vars['position'] == 'right') {
					objSize = obj.outerWidth();
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

							// Trigger onShow function if set
							if(vars['onShow'] !== undefined) {
								vars['onShow']();
							}
							
							// Show our element
							obj.css(posCss, -objSize);
							obj.show();
							obj.animate(animShow, {
								duration: vars['speed'],
								complete: function() {
									animating = false;
									
									// Run onFullyShown if set
									if(vars['onFullyShown'] !== undefined) {
										vars['onFullyShown']();
									}
								}
							});
						}
					} else if(position < (vars['top'] + 5)) {

						// We should hide it if it's visible and not already being hidden
						if(!animating && obj.is(':visible')) {
							animating = true;

							// Run onHide if set
							if(vars['onHide'] !== undefined) {
								vars['onHide']();
							}
							
							// Hide element
							obj.animate(animHide, {
								'duration': vars['speed'],
								'complete': function() {
									obj.hide();
									animating = false;
									
									// Run onHide if set
									if(vars['onFullyHidden'] !== undefined) {
										vars['onFullyHidden']();
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

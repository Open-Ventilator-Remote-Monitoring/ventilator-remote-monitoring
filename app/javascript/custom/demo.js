// Demo Page
document.addEventListener('turbolinks:load', () => {

	function generateRandomValueBetween(lower, upper) {
		return Math.round(Math.random()*(upper-lower)+lower);
	};

	/*
	Ranges:
	ventilator-1-status
	ventilator-1-tidal-volume		300 - 800
	ventilator-1-resp-rate			8 - 35
	ventilator-1-peak-insp-press	60 - 80
	ventilator-1-ie-ratio			1:1 - 1:4
	ventilator-1-peep 				5 - 10
	*/

	function updateValues() {
		for(i=1; i<=6; i++) {

			$('#ventilator-' + i + '-tidal-volume').html(generateRandomValueBetween(300, 800));
			$('#ventilator-' + i + '-resp-rate').html(generateRandomValueBetween(8, 35));
			$('#ventilator-' + i + '-peak-insp-press').html(generateRandomValueBetween(60, 80));
			$('#ventilator-' + i + '-ie-ratio').html("1:" + generateRandomValueBetween(1, 4));
			$('#ventilator-' + i + '-peep').html(generateRandomValueBetween(5, 10));

		}
	}

	// Blink one status indicator
	window.setInterval(function () {
		$('#ventilator-2-status').html('<i class="fas fa-lg fa-exclamation-triangle" style="color: red;">');
		window.setTimeout(function() {
			$('#ventilator-2-status').html('');
		}, 1000)
	}, 2000);

	updateValues();
	window.setInterval(updateValues, 3000);

});
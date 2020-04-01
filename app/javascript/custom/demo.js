// Demo Page
document.addEventListener('turbolinks:load', () => {

	if($('#index-demo-container').length) {
		console.log('index-demo-container found');

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

	} else if($('#demo-container').length) {

		console.log('demo-container found');

		class Ventilator {
			constructor(id, hostname) {
				this.id = id;
				this.hostname = hostname;
			}
			updateDOM(status, tidalVolume, respiratoryRate, peakInspiratoryPressure, ieRatio, peep) {
				if (status == "Connected") {
					var id = this.id;
					$('#ventilator-' + id + '-status').html('<i class="fas fa-lg fa-circle" style="color: LimeGreen;"></i>');
					$('#ventilator-' + id + '-tidal-volume').html(tidalVolume);
					$('#ventilator-' + id + '-resp-rate').html(respiratoryRate);
					$('#ventilator-' + id + '-peak-insp-press').html(peakInspiratoryPressure);
					$('#ventilator-' + id + '-ie-ratio').html(ieRatio);
					$('#ventilator-' + id + '-peep').html(peep);

				} else if (status == "Disconnected") {
					var id = this.id;
					$('#ventilator-' + id + '-status').html('<i class="fas fa-lg fa-exclamation-triangle" style="color: red;">');
					$('#ventilator-' + id + '-tidal-volume').html('');
					$('#ventilator-' + id + '-resp-rate').html('');
					$('#ventilator-' + id + '-peak-insp-press').html('');
					$('#ventilator-' + id + '-ie-ratio').html('');
					$('#ventilator-' + id + '-peep').html('');

				}
			}
			poll() {
				var hostname = this.hostname
				$.ajax({
					url: hostname + '/api/ventilator',
					type: 'GET',
					contentType: 'application/json',
					context: this,
					success: function(result) {
						console.log('Success connecting to: ' + hostname);
						console.log('result: ' + JSON.stringify(result));
						// console.log('result: ' + JSON.stringify(result.ventilator[0].tidalVolume));
						var tidalVolume = result.ventilator[0].tidalVolume;
						var respiratoryRate = result.ventilator[0].respiratoryRate;
						var peakInspiratoryPressure = result.ventilator[0].peakInspiratoryPressure;
						var ieRatio = result.ventilator[0].ieRatio;
						var peep = result.ventilator[0].peep;

						console.log('tidalVolume: ' + tidalVolume);
						console.log('respiratoryRate: ' + respiratoryRate);
						console.log('peakInspiratoryPressure: ' + peakInspiratoryPressure);
						console.log('ieRatio: ' + ieRatio);
						console.log('peep: ' + peep);

						this.updateDOM("Connected", tidalVolume, respiratoryRate, peakInspiratoryPressure, ieRatio, peep);
					},
					error: function(result) {
						console.log('Error connecting to: ' + hostname);
						this.updateDOM("Disconnected");
					}
				});
			}
		}

		ventilator1 = new Ventilator(1, 'http://ventilator-1.local');

		ventilator1.poll();

		var self = ventilator1;
		setInterval(function() { self.poll() }, 2000);


	}


});
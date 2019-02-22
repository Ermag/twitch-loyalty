$(document).ready(function() {
	$.urlParam = function(name) {
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

		if (results == null) {
			return null;
		}

		return decodeURI(results[1]) || 0;
	}

	var URL = 'https://4lter.com/';
	var chid = $.urlParam('chid');
	var env = $.urlParam('env');
	var hasSound = $.urlParam('sound');
	var screenTime = $.urlParam('screenTime');
	var time = new Date();
	var alerts = [];
	var sound = new Audio('default.wav');

	var rewardName = $('#alert-reward-name');
	var rewardPoints = $('#alert-reward-points');
	var rewardImage = $('#alert-reward-image');
	var rewardMessage = $('#alert-reward-message');
	var pointsImage = $('#alert-points-image');
	var userAvatar = $('#alert-user-avatar');
	var userName = $('#alert-user-name');
	var userLevel = $('#alert-user-level');

	if (env === 'dev') {
		URL = 'https://localhost/';
	}

	function getAlerts() {
		$.get(URL + 'claim?cid=' + chid + '&afterDate=' + time.getTime(), function(data) {
			time = new Date();
			alerts = alerts.concat(data)
		})
	}

	function showAlert(alert) {
		rewardName.text(alert.reward.name)
		rewardPoints.text(Math.abs(alert.points))
		rewardImage.attr('src', alert.reward.image || 'default.png')
		rewardMessage.text(alert.msg || 'No message')
		pointsImage.attr('src', alert.channel.pointsImg || 'coins.png')

		if (alert.user) {
			userAvatar.attr('src', alert.user.avatar)
			userName.text(alert.user.displayName)
			userLevel.text(alert.user.level)
		} else {
			userAvatar.attr('src', 'avatar.jpg')
			userName.text('Somebody')
			userLevel.text('1')
		}

		$('#app .alert-wrapper').addClass('show');

		if (hasSound === 'yes') {
			sound.volume = 0.3;
			sound.play();
		}

		setTimeout(function() {
			$('#app .alert-wrapper').removeClass('show');
		}, parseInt(screenTime) * 1000 || 8000);
	}

	setInterval(function() {
		getAlerts();
	}, 30000);

	setInterval(function() {
		if (alerts.length > 0) {
			showAlert(alerts[0]);
			alerts.shift();
		}
	}, 3000);

	getAlerts();
});

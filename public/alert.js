$(document).ready(function() {
	$.urlParam = function(name) {
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

		if (results == null) {
			return null;
		}

		return decodeURI(results[1]) || 0;
	}

	var chid = $.urlParam('chid');
	var hasSound = $.urlParam('sound');
	var screenTime = $.urlParam('screenTime');
	var time = new Date();
	var alerts = [];
	var sound = null;

	var rewardName = $('#alert-reward-name');
	var rewardPoints = $('#alert-reward-points');
	var rewardImage = $('#alert-reward-image');
	var rewardMessage = $('#alert-reward-message');
	var pointsImage = $('#alert-points-image');
	var userAvatar = $('#alert-user-avatar');
	var userName = $('#alert-user-name');
	var userLevel = $('#alert-user-level');

	screenTime = parseInt(screenTime) * 1000 || 8000;

	function getAlerts() {
		$.get('/claim?cid=' + chid + '&afterDate=' + time.getTime(), function(data) {
			time = new Date();

			for (var i = data.length - 1; i >= 0; --i) {
				if (data[i].reward.alert) {
					alerts.push(data[i]);
				}
			}
		})
	}

	function showAlert(alert) {
		rewardName.text(alert.reward.name);
		rewardPoints.text(Math.abs(alert.points));
		rewardImage.attr('src', alert.reward.image || 'default.png');
		rewardMessage.text(alert.msg || 'No message');
		pointsImage.attr('src', alert.channel.pointsImg || 'coins.png');

		if (alert.user) {
			userAvatar.attr('src', alert.user.avatar);
			userName.text(alert.user.displayName);
			userLevel.text(alert.user.level);
		} else {
			userAvatar.attr('src', 'avatar.jpg');
			userName.text('Somebody');
			userLevel.text('1');
		}

		$('#app .alert-wrapper').addClass('show');

		if (hasSound === 'yes') {
			sound = new Audio(alert.reward.sound || 'default.wav');
			sound.autoplay = true;
			sound.volume = 0.25;
		}

		setTimeout(function() {
			$('#app .alert-wrapper').removeClass('show');
		}, screenTime);
	}

	if (chid) {
		setInterval(function() {
			getAlerts();
		}, 30000);

		setInterval(function() {
			if (alerts.length > 0) {
				showAlert(alerts[0]);
				alerts.shift();
			}
		}, screenTime * 2);

		getAlerts();
	}
});

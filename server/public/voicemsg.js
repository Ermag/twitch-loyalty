navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
	var mediaRecorder = new MediaRecorder(stream);
	var audioChunks = [];

	console.log(mediaRecorder)
}).catch(function(err) {
  /* handle the error */
  console.log(err)
});

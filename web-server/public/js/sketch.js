function initSocketConnection () {
	const socket = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`);

	const redLightToggleBtn = document.getElementById('red-light-toggle');
	const greenLightToggleBtn = document.getElementById('green-light-toggle');
	const blueLightToggleBtn = document.getElementById('blue-light-toggle');
	let initialized = false;

	const toggleBtns = [redLightToggleBtn, greenLightToggleBtn, blueLightToggleBtn];

	function onToggleBtnChange (btn) {
		if (!initialized) return;

		const lights = toggleBtns.map(btn => btn.checked ? 1 : 0);

		toggleBtns[btn].checked = !toggleBtns[btn];

		socket.send(JSON.stringify({ lights }));
	}

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);

		if (data.lights) {
			redLightToggleBtn.checked = data.lights[0];
			greenLightToggleBtn.checked = data.lights[1];
			blueLightToggleBtn.checked = data.lights[2];

			initialized = true;
		}
	}

	socket.onopen = () => {
		console.log('Connected');

		toggleBtns.forEach((btn, index) => {
			btn.addEventListener('change', () => {
				onToggleBtnChange(index);
			});
		});
	};

	socket.onerror = (error) => {
		console.error('WS Error');
	};
}

initSocketConnection();

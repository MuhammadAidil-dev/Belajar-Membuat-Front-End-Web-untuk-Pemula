document.addEventListener('DOMContentLoaded', function () {
	const inputMaxLengthOnLoad = document.getElementById('inputNama').maxLength;
	document.getElementById('sisaKarakter').innerText = inputMaxLengthOnLoad;

	// get elements input
	const inputNama = document.getElementById('inputNama');
	const inputChaptcha = document.getElementById('inputCaptcha');

	// munculkan notifikasi sisa karakter ketika input nama focus
	inputNama.addEventListener('focus', function(){
		console.log('inputNama: focus');
		document.getElementById('notifikasiSisaKarakter').style.visibility = 'visible';
	})

	// hilangkan notifikasi sisa karakter ketika input nama blur/tidak focus
	inputNama.addEventListener('blur', function () {
		console.log('inputNama: blur');
		document.getElementById('notifikasiSisaKarakter').style.visibility = 'hidden';
	});

	// handle notifikasi sisa karakter ketika element input nama di input
	inputNama.addEventListener('input', function () {
		const jumlahKarakterDiketik = inputNama.value.length;
		const jumlahKarakterMaksimal = inputNama.maxLength;

		console.log('jumlahKarakterDiketik: ', jumlahKarakterDiketik);
		console.log('jumlahKarakterMaksimal: ', jumlahKarakterMaksimal);
		const sisaKarakterUpdate = jumlahKarakterMaksimal - jumlahKarakterDiketik;
		document.getElementById('sisaKarakter').innerText = sisaKarakterUpdate.toString();

		if (sisaKarakterUpdate === 0) {
			document.getElementById('sisaKarakter').innerText = 'Batas maksimal tercapai!';
		} else if (sisaKarakterUpdate <= 5) {
			document.getElementById('notifikasiSisaKarakter').style.color = 'red';
		} else {
			document.getElementById('notifikasiSisaKarakter').style.color = 'black';
		}
	});

	inputChaptcha.addEventListener('change', function (){
		const submitButton = document.getElementById('submitButton');
		const chaptcha = inputChaptcha.value;
		
		if(chaptcha === 'PRNU'){
			submitButton.removeAttribute('disabled');
		} else {
			submitButton.setAttribute('disabled', '');
		}
	})

	document.getElementById('formDataDiri').addEventListener('submit', function (event) {
		const inputCaptcha = document.getElementById('inputCaptcha').value;
		if (inputCaptcha === 'PRNU') {
			alert('Selamat! Captcha Anda lolos :D');
		} else {
			alert('Captcha Anda belum tepat :(');
			document.getElementById('submitButton').setAttribute('disabled', '');
		}
		event.preventDefault();
	});

	// event oncopy
	document.getElementById('inputCopy').addEventListener('copy', function () {
		alert('Anda telah men-copy sesuatu...');
	});

	// event onpaste
	document.getElementById('inputPaste').addEventListener('paste', function () {
		alert('Anda telah mem-paste sebuah teks...');
	});
});
document.addEventListener('DOMContentLoaded', function(){

	const bookForm = document.getElementById('bookForm');
	const searchBookForm = document.getElementById('searchBook');
	const booksList = [];
	const RENDER_EVENT = 'render_app';
	const STORAGE_KEY = 'bookshelf_app';

	// custom event
	document.addEventListener(RENDER_EVENT, () => {
		const incompleteBookList = document.getElementById('incompleteBookList');
		incompleteBookList.innerHTML = '';

		const completeBookList = document.getElementById('completeBookList');
		completeBookList.innerHTML = '';

		for(const book of booksList){
			const bookCard = makeBookCard(book);
			if(book.isComplete){
				completeBookList.appendChild(bookCard);
			} else {
				incompleteBookList.appendChild(bookCard);
			}
		}
	})

	bookForm.addEventListener('submit', (event) => {
		event.preventDefault();
		addBook();
	});

	searchBookForm.addEventListener('submit', (event) => {
		event.preventDefault();
		searchBook();
	})

	// load data
	if(isStorageExist()){
		loadStorage();
	}

	function loadStorage(){
		const serializedData = localStorage.getItem(STORAGE_KEY);
		let data = JSON.parse(serializedData);
		if (data !== null) {
			for (const item of data) {
				booksList.push(item);
			}
		}

		document.dispatchEvent(new Event(RENDER_EVENT));
	}

	function addBook(){
		const bookId = generateId();
		const inputBookTitle = document.getElementById('bookFormTitle').value.trim();
		const inputBookAuthor = document.getElementById('bookFormAuthor').value.trim();
		const inputBookYear = parseInt(document.getElementById('bookFormYear').value);
		const inputBookIsComplete = document.getElementById('bookFormIsComplete').checked;

		const bookObject = generateObject(bookId, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
		booksList.push(bookObject);

		// trigger custom event
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
		resetInput();
	}

	// fungsi search book sesuai title
	function searchBook(){
		const inputSearch = document.getElementById('searchBookTitle').value.trim().toLowerCase();
		const bookSearch = booksList.find(book => book.title.toLowerCase() === inputSearch);
		const incompleteBookList = document.getElementById('incompleteBookList');
		const completeBookList = document.getElementById('completeBookList');
		if(bookSearch){
			const bookCard = makeBookCard(bookSearch);
			if(bookSearch.isComplete){
				completeBookList.innerHTML = '';
				completeBookList.appendChild(bookCard);
			} else {
				incompleteBookList.innerHTML = '';
				incompleteBookList.appendChild(bookCard);
			}
		}
	}

	// fungsi untuk menyimpan data ke local storage
	function saveData() {
		if (isStorageExist()) {
			const parsed = JSON.stringify(booksList);
			localStorage.setItem(STORAGE_KEY, parsed);
		}
	}

	// fungsi untuk membersihkan form input
	function resetInput(){
		document.getElementById('bookFormTitle').value = '';
		document.getElementById('bookFormAuthor').value = '';
		document.getElementById('bookFormYear').value = '';
		document.getElementById('bookFormIsComplete').checked = false;
	}

	// fungsi untuk membuat id
	function generateId(){
		return new Date().getTime();
	}

	// fungsi membuat object
	function generateObject(id, title, author, year, isComplete){
		return {
			id,
			title,
			author,
			year,
			isComplete,
		};
	}

	// fungsi membuat book card
	function makeBookCard(bookObj){
		// Membuat div utama dengan kelas dan atribut data
		const bookCard = document.createElement('div');
		bookCard.className = 'bookCard';
		bookCard.setAttribute('data-bookid', bookObj.id);
		bookCard.setAttribute('data-testid', 'bookItem');

  		// Membuat elemen h3 untuk judul buku
		const bookTitle = document.createElement('h3');
		bookTitle.className = 'bookTitle';
		bookTitle.setAttribute('data-testid', 'bookItemTitle');
		bookTitle.textContent = bookObj.title;

  		// Membuat elemen p untuk penulis buku
		const bookAuthor = document.createElement('p');
		bookAuthor.className = 'bookAuthor';
		bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
		bookAuthor.textContent = `Penulis: ${bookObj.author}`;

  		// Membuat elemen p untuk tahun rilis buku
		const bookRelease = document.createElement('p');
		bookRelease.className = 'bookRelease';
		bookRelease.setAttribute('data-testid', 'bookItemYear');
		bookRelease.textContent = `Tahun: ${bookObj.year}`;

  		// Membuat div untuk tombol
		const buttonWrapper = document.createElement('div');
		buttonWrapper.className = 'buttonWrapper';

  		// Membuat tombol "Selesai dibaca"
		const doneButton = document.createElement('button');
		doneButton.className = 'doneButton';
		doneButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
		if(bookObj.isComplete){
			doneButton.textContent = 'Belum selesai dibaca';
		} else {
			doneButton.textContent = 'Selesai dibaca';
		}

		// handle done button di click
		doneButton.addEventListener('click', () => {
			updateStatusBook(bookObj.id);
		})


  		// Membuat tombol "Hapus Buku"
		const deleteButton = document.createElement('button');
		deleteButton.className = 'deleteButton';
		deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
		deleteButton.textContent = 'Hapus Buku';

		// handle delete button
		deleteButton.addEventListener('click', () => {
			deleteBook(bookObj.id);
		})

  		// Membuat tombol "Edit Buku"
		const editButton = document.createElement('button');
		editButton.className = 'editButton';
		editButton.setAttribute('data-testid', 'bookItemEditButton');
		editButton.textContent = 'Edit Buku';

		// handle edit button
		editButton.addEventListener('click', () => {
			// open modal box edit
			openModalBox(bookObj.id);
		})

  		// Menambahkan tombol ke dalam wrapper tombol
		buttonWrapper.appendChild(doneButton);
		buttonWrapper.appendChild(deleteButton);
		buttonWrapper.appendChild(editButton);

  		// Menyusun elemen-elemen ke dalam bookCard
		bookCard.appendChild(bookTitle);
		bookCard.appendChild(bookAuthor);
		bookCard.appendChild(bookRelease);
		bookCard.appendChild(buttonWrapper);

		return bookCard;
	}

	function updateStatusBook(bookId){
		const bookTarget = findBook(bookId);
		if(bookTarget === null) return;
		bookTarget.isComplete = !bookTarget.isComplete;
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	}

	function deleteBook(bookId){
		const bookTarget = booksList.findIndex((book) => book.id === bookId);
		if(bookTarget === -1) return;

		booksList.splice(bookTarget, 1);
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	}

	function findBook(bookId){
		for(const book of booksList){
			if(book.id === bookId){
				return book;
			}
		}

		return null;
	}

	const modalBox = document.getElementById('modalBox');
	// fungsi untuk edit book
	function editBook(bookId){
		const bookTarget = findBook(bookId);
		if(bookTarget === null) return;

		const editBookForm = document.getElementById('editBookForm');

		document.getElementById('inputTitle').value = bookTarget.title;
		document.getElementById('inputAuthor').value = bookTarget.author;
		document.getElementById('inputYear').value = bookTarget.year;
		document.getElementById('inputIsComplete').checked = bookTarget.isComplete;

		editBookForm.addEventListener('submit', (event) => {
			event.preventDefault();
			updateBook(bookTarget);
		})
	}

	function updateBook(bookObj){
		const inputTitle = document.getElementById('inputTitle').value;
		const inputAuthor = document.getElementById('inputAuthor').value;
		const inputYear = document.getElementById('inputYear').value;
		const inputIsComplete = document.getElementById('inputIsComplete').checked;

		bookObj.title = inputTitle;
		bookObj.author = inputAuthor;
		bookObj.year = inputYear;
		bookObj.isComplete = inputIsComplete;

		// close modal box
		modalBox.style.display = 'none';
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	}

	// fungsi untuk menampilkan modal box edit
	function openModalBox(bookId){
		modalBox.style.display = 'flex';
		editBook(bookId);

		// close modal box
		document.getElementById('cancleButton').addEventListener('click', () => {
			modalBox.style.display = 'none';
		})
	}

	// fungsi check browser supported
	function isStorageExist(){
		if (typeof (Storage) === undefined) {
			alert('Browser kamu tidak mendukung local storage');
			return false;
		}
		return true;
	}
});
const submitBtn = document.querySelector('.add');
const updateBtn = document.querySelector('.update');
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

if (submitBtn) {
	const imageInput = document.getElementById('image');
	const fileLabel = document.querySelector('.custom-file-label');
	submitBtn.addEventListener('click', (event) => {
		// Validates image overload on camp creation.
		if (imageInput && imageInput.files.length > 3) {
			event.preventDefault();
			imageInput.classList.add('invalid');
			fileLabel.classList.add('invalid-text');
			fileLabel.innerText = 'Maximum of 3 photos only.';
		}
		// Validates maximum file size on camp creation.
		for (const file of imageInput.files) {
			if (file.size > MAX_FILE_SIZE) {
				event.preventDefault();
				imageInput.classList.add('invalid');
				fileLabel.classList.add('invalid-text');
				fileLabel.innerText = 'File must not exceed 1MB!';
			}
		}
	});
}

if (updateBtn) {
	let checkboxes = document.querySelectorAll("input[name='deleteImages[]']");
	let arr = Array.from(checkboxes);
	const imageDisplay = document.querySelectorAll('label>div');
	const fileLabel = document.querySelector('.custom-file-label');
	for (let container of imageDisplay) {
		container.addEventListener('click', (event) => {
			container.lastElementChild.classList.toggle('hidden');
		});
	}
	// Validates that all images are not deleted on camp update.
	updateBtn.addEventListener('click', (event) => {
		if (arr.every((box) => box.checked)) {
			event.preventDefault();
			for (let container of imageDisplay) {
				container.classList.add('invalid');
			}
			fileLabel.classList.add('invalid-text');
			fileLabel.innerText = "You can't remove all images!";
		}
	});
}

// Validate delete request
const deleteBtn = document.getElementById('del-btn');
if (deleteBtn) {
	deleteBtn.addEventListener('click', (event) => {
		const willDelete = confirm(
			'Are you sure you want to delete this campground?'
		);
		if (!willDelete) event.preventDefault();
	});
}

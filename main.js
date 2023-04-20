const API = 'https://api.thecatapi.com/v1';
const API_KEY =
    'live_nLCkjwyz1NWCSLlj8eMoL1NfWFWPkifJLHUfed6L4SR92KX45sn77ZZ5cwe7DJbK';

const spnError = document.querySelector('#error');

const generatedImgs = document.querySelector('#generatedImgs');
const favoritesImgs = document.querySelector('#favoritesImgs');
const uploadedImgs = document.querySelector('#uploadedImgs');
const myUploadsSection = document.querySelector('#myUploads');
const uploadKittySection = document.querySelector('#uploadKitties');
const imgUpload = document.querySelector('#imgUpload');

async function fetchData(urlApi, method = 'GET', headers, body) {
    const response = await fetch(urlApi, {
        method: method,
        headers: {
            ...headers,
            'X-API-KEY': API_KEY,
        },
        body: body,
    });
    if (response.status < 200 || response.status >= 300) {
        throw new Error(
            `An error ocurred: ${response.status} ${response.statusText}`
        );
    }
    return response;
}

async function loadRandomKitties() {
    try {
        generatedImgs.textContent = '';
        const response = await fetchData(`${API}/images/search?limit=7`);
        const data = await response.json();
        console.log(data);
        data.forEach((cat) => {
            /*
        <div class="card">
            <img src="" alt="" class="card__img">
            <button class="card__btn">Add to Favorites</button>
        </div>
        */
            const img = document.createElement('img');
            img.src = cat.url;
            img.classList.add('card__img');

            const btn = document.createElement('button');
            btn.classList.add('card__btn');
            btn.textContent = 'Add to Favorites';
            btn.addEventListener('click', addToFavorites);

            const div = document.createElement('div');
            div.classList.add('card');
            div.id = cat.id;

            div.append(img, btn);
            generatedImgs.appendChild(div);
        });
    } catch (error) {
        console.log(error.message);
        spnError.innerText = error.message;
    }
}

async function loadFavoritesKitties() {
    try {
        favoritesImgs.textContent = '';
        const response = await fetchData(`${API}/favourites`);
        const data = await response.json();
        console.log(data);

        data.forEach((cat) => {
            const img = document.createElement('img');
            img.src = cat.image.url;
            img.classList.add('card__img');

            const btn = document.createElement('button');
            btn.classList.add('card__btn');
            btn.textContent = 'Delete';
            btn.addEventListener('click', removeFromFavorites);

            const div = document.createElement('div');
            div.classList.add('card');
            div.id = cat.id;

            div.append(img, btn);
            favoritesImgs.appendChild(div);
        });
    } catch (error) {
        console.log(error.message);
        spnError.innerText = error.message;
    }
}

async function addToFavorites(event) {
    try {
        const btnPressed = event.target;
        const card = btnPressed.parentElement;
        const response = await fetchData(
            `${API}/favourites`,
            'POST',
            { 'Content-Type': 'application/json' },
            JSON.stringify({ image_id: card.id })
        );
        generatedImgs.removeChild(card);
        loadFavoritesKitties();

        /*TODO: Show success message */
    } catch (error) {
        console.log(error);
        spnError.innerText = error.message;
    }
}

async function removeFromFavorites(event) {
    try {
        const btnPressed = event.target;
        const card = btnPressed.parentElement;
        const response = await fetchData(
            `${API}/favourites/${card.id}`,
            'DELETE'
        );
        console.log(response);
        favoritesImgs.removeChild(card);

        /*TODO: Show success message */
    } catch (error) {
        console.log(error);
        spnError.innerText = error.message;
    }
}

async function loadMyUploads() {
    try {
        uploadedImgs.innerText = '';
        const response = await fetchData(`${API}/images?limit=15`);
        const data = await response.json();
        console.log(data);
        data.forEach((cat) => {
            /*
            <div class="card">
                <img src="" alt="" class="card__img">
                <button class="card__btn">Delete</button>
            </div>
        */
            const img = document.createElement('img');
            img.src = cat.url;
            img.classList.add('card__img');

            const btn = document.createElement('button');
            btn.classList.add('card__btn');
            btn.textContent = 'Delete';
            btn.addEventListener('click', deleteUploadedImg);

            const div = document.createElement('div');
            div.classList.add('card');
            div.id = cat.id;

            div.append(img, btn);
            uploadedImgs.appendChild(div);
        });
    } catch (error) {
        console.log(error.message);
        spnError.innerText = error.message;
    }
}

async function deleteUploadedImg(event) {
    try {
        const btnPressed = event.target;
        const card = btnPressed.parentElement;
        const response = await fetchData(`${API}/images/${card.id}`, 'DELETE');
        console.log(response);
        uploadedImgs.removeChild(card);

        /*TODO: Show success message */
    } catch (error) {
        console.log(error);
        spnError.innerText = error.message;
    }
}

async function uploadKittyPhoto() {
    try {
        const form = document.getElementById('uploadingForm');
        const formData = new FormData(form);

        console.log(formData.get('file'));

        const res = await fetchData(
            `${API}/images/upload`,
            'POST',
            ...Array(1), // Avoid third argument
            formData
        );
        console.log(res);
        imgUpload.src = '';
        loadMyUploads();

        /*TODO: Show success message */
    } catch (error) {
        console.log(error);
        spnError.innerText = error.message;
    }
}

function openMyUploads() {
    myUploadsSection.classList.remove('inactive');
}
function closeMyUploads() {
    myUploadsSection.classList.add('inactive');
}

function openUploadMenu() {
    uploadKittySection.classList.remove('inactive');
}
function closeUploadMenu() {
    uploadKittySection.classList.add('inactive');
}
function loadImage(event) {
    imgUpload.src = URL.createObjectURL(event.target.files[0]);
}

loadRandomKitties();
loadFavoritesKitties();
loadMyUploads();

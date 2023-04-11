const API = 'https://api.thecatapi.com/v1';
const API_KEY =
    'live_nLCkjwyz1NWCSLlj8eMoL1NfWFWPkifJLHUfed6L4SR92KX45sn77ZZ5cwe7DJbK';

const spnError = document.querySelector('#error');

const generatedImgs = document.querySelector('#generatedImgs');
const favoritesImgs = document.querySelector('#favoritesImgs');
const uploadSection = document.querySelector('#uploadKitties');
const imgUpload = document.querySelector('#imgUpload');

async function fetchData(urlApi) {
    const response = await fetch(urlApi, {
        headers: {
            'X-API-KEY': API_KEY,
        },
    });
    if (response.status !== 200) {
        throw new Error(
            `An error ocurred: ${response.status} ${response.statusText}`
        );
    }
    return response.json();
}

async function loadRandomKitties() {
    try {
        generatedImgs.textContent = '';
        const data = await fetchData(`${API}/images/search?limit=7`);
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
        const data = await fetchData(`${API}/favourites`);
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
        const response = await fetch(`${API}/favourites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY,
            },
            body: JSON.stringify({
                image_id: card.id,
            }),
        });
        if (response.status !== 200) {
            throw new Error(
                `An error ocurred: ${response.status} ${response.statusText}`
            );
        }
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
        const response = await fetch(`${API}/favourites/${card.id}`, {
            method: 'DELETE',
            headers: {
                'X-API-KEY': API_KEY,
            },
        });
        if (response.status !== 200) {
            throw new Error(
                `An error ocurred: ${response.status} ${response.statusText}`
            );
        }
        console.log(response);
        favoritesImgs.removeChild(card);

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

        const res = await fetch(`${API}/images/upload`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'X-API-KEY': API_KEY,
            },
            body: formData,
        });
        if (res.status < 200 || res.status >= 300) {
            throw new Error(
                `An error ocurred: ${res.status} ${res.statusText}`
            );
        }
        console.log(res);
        imgUpload.src = '';
        /*TODO: Show success message */
    } catch (error) {
        console.log(error);
        spnError.innerText = error.message;
    }
}

function openMenu() {
    uploadSection.classList.remove('inactive');
}
function closeMenu() {
    uploadSection.classList.add('inactive');
}
function loadImage(event) {
    imgUpload.src = URL.createObjectURL(event.target.files[0]);
}

loadRandomKitties();
loadFavoritesKitties();

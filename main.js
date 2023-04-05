const API = 'https://api.thecatapi.com/v1';
const API_KEY =
    'api_key=live_nLCkjwyz1NWCSLlj8eMoL1NfWFWPkifJLHUfed6L4SR92KX45sn77ZZ5cwe7DJbK';

const spnError = document.querySelector('#error');

const btnReload = document.querySelector('#btnReload');
btnReload.addEventListener('click', loadRandomKitties);

const generatedImgs = document.querySelector('#generatedImgs');
const favoritesImgs = document.querySelector('#favoritesImgs');

async function fetchData(urlApi) {
    const response = await fetch(urlApi);
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
        const data = await fetchData(`${API}/images/search?limit=7&${API_KEY}`);
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
        const data = await fetchData(`${API}/favourites?${API_KEY}`);
        console.log(data);

        data.forEach((cat) => {
            const img = document.createElement('img');
            img.src = cat.image.url;
            img.classList.add('card__img');

            const btn = document.createElement('button');
            btn.classList.add('card__btn');
            btn.textContent = 'Delete';
            // btn.addEventListener('click', addToFavorites);

            const div = document.createElement('div');
            div.classList.add('card');
            div.id = cat.image_id;

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
        const response = await fetch(`${API}/favourites?${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    } catch (error) {
        console.log(error);
        spnError.innerText = error.message;
    }
}

// function removeFromFavorites(e) {
//     const card = e.target.parentElement;
//     favoritesImgs.removeChild(card);
// }

loadRandomKitties();
loadFavoritesKitties();

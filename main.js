const API = 'https://api.thecatapi.com/v1';
const API_KEY =
    'api_key=live_nLCkjwyz1NWCSLlj8eMoL1NfWFWPkifJLHUfed6L4SR92KX45sn77ZZ5cwe7DJbK';

const btnReload = document.querySelector('#btnReload');
btnReload.addEventListener('click', loadRandomKitties);

const generatedImgs = document.querySelector('#generatedImgs');
const favoritesImgs = document.querySelector('#favoritesImgs');

async function fetchData(urlApi) {
    const response = await fetch(urlApi);
    return response.json();
}

async function loadRandomKitties() {
    generatedImgs.textContent = '';
    const data = await fetchData(`${API}/images/search?limit=7&${API_KEY}`);
    // console.log(data);

    data.forEach((cat, index) => {
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
        // btn.addEventListener('click', addToFavorites);

        const div = document.createElement('div');
        div.classList.add('card');
        div.id = `cat${index}`;

        div.append(img, btn);
        generatedImgs.appendChild(div);
    });
}

async function loadFavoritesKitties() {
    const data = await fetchData(`${API}/favourites?limit=7&${API_KEY}`);
    data.forEach((cat, index) => {
        const img = document.createElement('img');
        img.src = cat.url;
        img.classList.add('card__img');

        const btn = document.createElement('button');
        btn.classList.add('card__btn');
        btn.textContent = 'Delete';
        // btn.addEventListener('click', addToFavorites);

        const div = document.createElement('div');
        div.classList.add('card');
        div.id = `cat${index}`;

        div.append(img, btn);
        favoritesImgs.appendChild(div);
    });
}

loadRandomKitties();

// function addToFavorites(event) {
//     // console.log(event);
//     /*
//     <div class="card">
//         <img src="" alt="" class="card__img">
//         <button class="card__btn">Delete</button>
//     </div>
//     */

//     const btnPressed = event.target;
//     btnPressed.textContent = 'Delete';
//     btnPressed.removeEventListener('click', addToFavorites);
//     btnPressed.addEventListener('click', removeFromFavorites);
//     const card = btnPressed.parentElement;

//     favoritesImgs.appendChild(card);
// }

// function removeFromFavorites(e) {
//     const card = e.target.parentElement;
//     favoritesImgs.removeChild(card);
// }

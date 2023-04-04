const API =
    'https://api.thecatapi.com/v1/images/search?limit=7&api_key=live_nLCkjwyz1NWCSLlj8eMoL1NfWFWPkifJLHUfed6L4SR92KX45sn77ZZ5cwe7DJbK';

const btnReload = document.querySelector('#btnReload');
btnReload.addEventListener('click', reload);

const generatedImgs = document.querySelector('#generatedImgs');
const favoritesImgs = document.querySelector('#favoritesImgs');

async function fetchData() {
    const response = await fetch(API);
    return response.json();
}

async function reload() {
    generatedImgs.textContent = '';
    const data = await fetchData();
    console.log(data);

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
        btn.addEventListener('click', addToFavorites);

        const div = document.createElement('div');
        div.classList.add('card');
        div.id = `cat${index}`;

        div.append(img, btn);
        generatedImgs.appendChild(div);
    });
}

reload();

function addToFavorites(event) {
    // console.log(event);
    /*
    <div class="card">
        <img src="" alt="" class="card__img">
        <button class="card__btn">Delete</button>
    </div>
    */

    const btnPressed = event.target;
    btnPressed.textContent = 'Delete';
    btnPressed.removeEventListener('click', addToFavorites);
    btnPressed.addEventListener('click', removeFromFavorites);
    const card = btnPressed.parentElement;

    favoritesImgs.appendChild(card);
}

function removeFromFavorites(e) {
    const card = e.target.parentElement;
    favoritesImgs.removeChild(card);
}

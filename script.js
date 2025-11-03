// Nama file: pokeberry.js

// URL endpoint untuk daftar Beri
const BERRY_LIST_API = "https://pokeapi.co/api/v2/berry?limit=64" 

// Elemen DOM
const pokemonList = document.getElementById('pokemon-list');
const pokemonImg = document.getElementById('pokemon-img');
const pokemonTypes = document.getElementById('pokemon-types');
const pokemonDescription = document.getElementById('pokemon-description');

// --- Fungsi Utilitas ---
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function setInfoDisplay(htmlContent) {
    pokemonTypes.innerHTML = ''; 
    pokemonDescription.innerHTML = htmlContent;
}

function setActiveButton(clickedButton) {
    document.querySelectorAll('.pokemon-name').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedButton.classList.add('active');
}

// --- Logika Pengambilan Data Beri ---

async function loadBerryList() {
    pokemonList.innerHTML = '<div class="loading">Memuat daftar Beri...</div>';

    try {
        const response = await fetch(BERRY_LIST_API);
        if (!response.ok) throw new Error('Gagal mengambil daftar Beri');

        const data = await response.json();
        pokemonList.innerHTML = ''; 

        data.results.forEach((berry, index) => {
            const button = document.createElement('div');
            button.className = 'pokemon-name';
            button.id = index + 1; 
            button.textContent = (index + 1) + ". " + capitalize(berry.name);
            button.dataset.url = berry.url; 
            
            button.addEventListener('click', (e) => {
                displayBerryDetails(berry.url, capitalize(berry.name));
                setActiveButton(e.target);
            });
            
            pokemonList.appendChild(button);
        });
        
        if (data.results.length > 0) {
            const firstButton = document.querySelector('.pokemon-name');
            displayBerryDetails(data.results[0].url, capitalize(data.results[0].name));
            setActiveButton(firstButton);
        }

    } catch (error) {
        console.error("Error loading berry list:", error);
        pokemonList.innerHTML = '<div class="error">Gagal memuat daftar.</div>';
        setInfoDisplay(`<h2>Koneksi Gagal</h2><p class="error">Gagal memuat daftar Beri dari API.</p>`);
    }
}

async function displayBerryDetails(url, name) {
    setInfoDisplay(`<div class="loading">Memuat detail ${name}...</div>`);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal mengambil detail Beri');

        const berry = await response.json();
        
        // --- GAMBAR BERRY DARI ASET EKSTERNAL ---
        const imageName = berry.name.toLowerCase() + '-berry.png';
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${imageName}`;
        
        pokemonImg.style.display = 'block'; 
        pokemonImg.src = imageUrl;
        pokemonImg.alt = name + " Berry";
        // ----------------------------------------

        let detailsHtml = `<h2>${name} Berry</h2>`;
        
        detailsHtml += `
            <p><strong>Ukuran (Size):</strong> ${berry.size} cm</p>
            <p><strong>Kekerasan (Firmness):</strong> ${capitalize(berry.firmness.name)}</p>
            <p><strong>Waktu Tumbuh Dasar (Growth Time):</strong> ${berry.growth_time * 4} jam</p>
            <p><strong>Kekuatan Efek (Potency):</strong> ${berry.natural_gift_power}</p>
        `;
        
        detailsHtml += '<h3>Rasa (Flavors):</h3><ul>';
        let flavorFound = false;
        berry.flavors.forEach(flavor => {
            if (flavor.potency > 0) {
                 detailsHtml += `<li>${capitalize(flavor.flavor.name)}: **${flavor.potency}**</li>`;
                 flavorFound = true;
            }
        });
        detailsHtml += flavorFound ? '</ul>' : '<li>Tidak ada rasa yang signifikan.</li></ul>';

        setInfoDisplay(detailsHtml);

    } catch (error) {
        console.error(`Error loading details for ${name}:`, error);
        pokemonImg.style.display = 'none'; 
        setInfoDisplay(`<h2>${name} Berry</h2><p class="error">Gagal memuat detail Beri. (Cek URL API atau koneksi)</p>`);
    }
}

document.addEventListener('DOMContentLoaded', loadBerryList);
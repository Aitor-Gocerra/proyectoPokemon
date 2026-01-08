class Pokemon {

    constructor() {
        this.contenedor = document.getElementById('pokedex-contenedor');
    }

    async mostrarPokemon() {
        try {
            console.log("Intentando fetching: https://pokeapi.co/api/v2/pokemon?limit=151");
            const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
            const datos = await respuesta.json();

            for (const item of datos.results) {
                const respuestaDetalle = await fetch(item.url.replace('http:', 'https:'));
                const pokemonDetalle = await respuestaDetalle.json();

                this.crearTarjeta(pokemonDetalle);
            }
        } catch (error) {
            console.error("Hubo un error cargando los pokemons", error);
        }
    }

    crearTarjeta(pokemon) {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('pokemon-tarjeta');

        const tipos = pokemon.types.map(tipo => tipo.type.name).join(', ');

        tarjeta.innerHTML = `
            <div class="contenedor-imagen">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="informacion">
                <span class="numero">#${pokemon.id.toString().padStart(3, '0')}</span>
                <h3 class="nombre">${pokemon.name}</h3>
                <small class="type">Tipo: <span>${tipos}</span></small>
        `;

        this.contenedor.appendChild(tarjeta);
    }
}

const miPokedex = new Pokemon();
miPokedex.mostrarPokemon();
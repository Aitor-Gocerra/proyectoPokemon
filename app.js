class Pokemon {

    mostrarPokemon() {
        fetch('https://pokeapi.co/api/v2/pokemon')
        .then(response => response.json())
        .then(datos => {
            const contenedor = document.getElementById('pokemons');
            datos.results.forEach(pokemon => {
                const div = document.createElement('div');
                div.textContent = pokemon.name;
                contenedor.appendChild(div);
            });
        })
        .catch(error => console.error('Error:', error));
    }
}

const miPokedex = new Pokemon();
miPokedex.mostrarPokemon();
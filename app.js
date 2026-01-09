class Pokedex {

    constructor() {
        //Elementos del formulario
        this.divResultados = document.getElementById('pokedex-contenedor');
        this.divColeccion = document.getElementById('coleccion-contenedor');
        this.seccionColeccion = document.getElementById('coleccion-seccion');

        // Coleccion
        this.coleccion = [];
    }

    // EJERCICIO 1: FETCH y ASYNC/AWAIT

    async cargarPokemonsIniciales() {
        try {
            // Petición a la API para obtener la lista
            const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
            const datos = await respuesta.json(); // Convertimos a JSON

            // Lista de resultados
            for (const pokemonResumen of datos.results) {
                // 3. Obtenemos los detalles de cada Pokémon individualmente
                const respuestaDetalle = await fetch(pokemonResumen.url);
                const pokemonDetalle = await respuestaDetalle.json();

                // Pokémon en pantalla
                this.crearTarjeta(pokemonDetalle);
            }
        } catch (error) {
            console.error("Error al cargar iniciales:", error);
        }
    }

    crearTarjeta(pokemon, contenedor = this.divResultados) {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('pokemon-tarjeta');

        // Mapeamos los tipos (ej: "fire, flying")
        const tipos = pokemon.types.map(tipo => tipo.type.name).join(', ');

        tarjeta.innerHTML = `
            <div class="contenedor-imagen">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="info">
                <span class="numero">#${pokemon.id}</span>
                <h3 class="nombre">${pokemon.name}</h3>
                <small class="tipo">Tipo: ${tipos}</small>
            </div>
        `;

        // Añadimos el botón para atraparlo
        const boton = document.createElement('button');
        boton.textContent = "Atrapalo!";
        boton.onclick = () => this.agregarAColeccion(pokemon); // () es una funcion anonima
        tarjeta.appendChild(boton);

        contenedor.appendChild(tarjeta);
    }

    // EJERCICIO 2: PROMESAS (THEN / CATCH)

    buscarPokemon(nombre) {
        if (!nombre) return; // Si está vacío, no hacemos nada

        // Usamos fetch normal, que devuelve una "Promesa"
        fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error("Pokémon no encontrado");
                }
                return respuesta.json(); // Convertimos a JSON
            })
            .then(pokemon => {
                // Aqui tenemos los datos del Pokémon listos
                this.divResultados.innerHTML = ''; // Limpiamos resultados anteriores
                this.crearTarjeta(pokemon); // Mostramos el nuevo
            })
            .catch(error => {
                console.error(error);
                alert("Error: " + error.message);
                this.divResultados.innerHTML = `<p class="error">Lo sentimos, no encontramos el Pokémon "${nombre}"</p>`;
            });
    }

    // EJERCICIO 3: JQUERY AJAX
    buscarPokemonJQuery(nombre) {
        if (!nombre) return;

        // $.ajax es la forma de jQuery de hacer peticiones
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`,
            method: 'GET',
            success: (pokemon) => {
                // Si tiene éxito, jQuery ya nos da el objeto 'pokemon' parseado
                this.divResultados.innerHTML = '';
                this.crearTarjeta(pokemon);
            },
            error: (error) => {
                console.error(error);
                this.divResultados.innerHTML = `<p class="error">Error AJAX: No encontrado.</p>`;
            }
        });
    }

    // EJERCICIO 4: COLECCIÓN
    agregarAColeccion(pokemon) {
        // True si encuentra coincidencia
        const yaExiste = this.coleccion.some(poke => poke.id === pokemon.id);

        if (yaExiste) {
            alert("¡Ya tienes este Pokémon!");
            return;
        }

        // Guardamos solo los datos necesarios en nuestro array
        this.coleccion.push(pokemon);
        alert(`${pokemon.name} agregado a tu colección.`);
    }

    mostrarColeccion() {
        // Ocultamos buscadores
        this.divResultados.style.display = 'none'; 
        document.getElementById('seccion-buscador').style.display = 'none'; 

        this.seccionColeccion.style.display = 'block'; // Mostrar colección
        this.divColeccion.innerHTML = ''; // Limpiar previo

        // Recorremos nuestro array y creamos tarjetas
        this.coleccion.forEach(p => {
            // Pasamos 'true' al final para indicar que NO queremos botón de "Agregar"
            this.crearTarjeta(p, this.divColeccion, true);
        });
    }

    volverAlInicio() {
        this.seccionColeccion.style.display = 'none';
        this.divResultados.style.display = 'grid'; // Mostrar resultados (grid es su display original)
        document.getElementById('seccion-buscador').style.display = 'block';
    }

    // EJERCICIO 5: PROMISE.ALL (FILTRO)

    filtrarPorTipo(tipo) {
        console.log(`Buscando tipo: ${tipo}...`);

        // Pedimos la lista de pokemons de ese tipo
        fetch(`https://pokeapi.co/api/v2/type/${tipo}`)
            .then(respuesta => respuesta.json())
            .then(datos => {
                
                const primeros5 = datos.pokemon.slice(0, 5);

                // Creamos un array de PROMESAS (peticiones pendientes)
                // Usamos .map para transformar cada elemento en una petición fetch
                const peticiones = primeros5.map(item =>
                    fetch(item.pokemon.url)
                    .then(respu => respu.json())
                );

                // Promise.all espera a que TODAS las peticiones terminen
                return Promise.all(peticiones);
            })
            .then(listaPokemonsCompletos => {
                // Aquí ya tenemos un array con los 5 pokemons completos
                this.divResultados.innerHTML = '';
                listaPokemonsCompletos.forEach(pokemon => this.crearTarjeta(pokemon));
            })
            .catch(error => {
                alert("Error filtrando: " + error.message);
            });
    }

}

// ==========================================
// INICIALIZACIÓN Y EVENTOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new Pokedex();

    // Cargar iniciales al entrar
    app.cargarPokemonsIniciales();

    // Referencias a botones
    const input = document.getElementById('buscador');

    // Evento: Botón Buscar (Fetch)
    document.getElementById('btn-buscar').addEventListener('click', () => {
        app.buscarPokemon(input.value);
    });

    // Evento: Botón Buscar (jQuery)
    const btnJquery = document.getElementById('btn-buscar-jquery');
    if (btnJquery) {
        btnJquery.addEventListener('click', () => {
            app.buscarPokemonJQuery(input.value);
        });
    }

    // Evento: Botón Filtrar por Tipo
    const btnFiltrar = document.getElementById('btn-filtrar-tipo');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', () => {
            const tipoSeleccionado = document.getElementById('filtro-tipo').value;
            app.filtrarPorTipo(tipoSeleccionado);
        });
    }

    // Eventos: Colección
    const btnVerColeccion = document.getElementById('btn-ver-coleccion');
    if (btnVerColeccion) {
        btnVerColeccion.addEventListener('click', () => app.mostrarColeccion());
    }

    const btnVolver = document.getElementById('btn-volver');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => app.volverAlInicio());
    }
});
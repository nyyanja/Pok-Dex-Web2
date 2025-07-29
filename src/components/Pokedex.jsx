import React, { useState, useEffect } from 'react';

// Composant pour une carte Pokémon individuelle
const PokemonCard = ({ pokemon, onClick }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        setPokemonData(data);
      } catch (error) {
        console.error('Erreur lors du chargement du Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPokemonData();
  }, [pokemon.url]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl p-6 animate-pulse">
        <div className="h-24 w-24 bg-gray-400 rounded-lg mb-4 mx-auto"></div>
        <div className="h-4 bg-gray-400 rounded mb-2"></div>
        <div className="h-3 bg-gray-400 rounded w-2/3 mx-auto"></div>
      </div>
    );
  }

  if (!pokemonData) return null;

  const pokemonId = pokemonData.id.toString().padStart(3, '0');
  
  return (
    <div 
      onClick={() => onClick(pokemonData)}
      className="bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-indigo-100 
                 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 
                 shadow-lg hover:shadow-2xl border border-blue-100 hover:border-blue-300"
    >
      <div className="text-center">
        <div className="relative mb-4">
          <img 
            src={pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default}
            alt={pokemonData.name}
            className="w-24 h-24 mx-auto drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300"
          />
        </div>
        <h3 className="font-bold text-gray-800 capitalize text-lg mb-2">
          {pokemonData.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 font-mono">#{pokemonId}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {pokemonData.types.map((type) => (
            <span 
              key={type.type.name}
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm
                ${getTypeColor(type.type.name)}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fonction pour obtenir la couleur d'un type
const getTypeColor = (type) => {
  const colors = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-600',
    fairy: 'bg-pink-300',
  };
  return colors[type] || 'bg-gray-500';
};

// Modal pour afficher les détails d'un Pokémon
const PokemonModal = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  const pokemonId = pokemon.id.toString().padStart(3, '0');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b border-gray-100 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold capitalize text-gray-800">
              {pokemon.name}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-bold w-10 h-10 
                       flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="relative mb-4">
              <img 
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-40 h-40 mx-auto drop-shadow-2xl"
              />
            </div>
            <p className="text-xl text-gray-600 mb-4 font-mono">#{pokemonId}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {pokemon.types.map((type) => (
                <span 
                  key={type.type.name}
                  className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg
                    ${getTypeColor(type.type.name)}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Informations physiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium">Taille</p>
                  <p className="font-bold text-lg text-blue-700">{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium">Poids</p>
                  <p className="font-bold text-lg text-green-700">{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Statistiques de combat</h3>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => {
                  const statNames = {
                    'hp': 'PV',
                    'attack': 'Attaque',
                    'defense': 'Défense',
                    'special-attack': 'Att. Spé.',
                    'special-defense': 'Déf. Spé.',
                    'speed': 'Vitesse'
                  };
                  
                  return (
                    <div key={stat.stat.name} className="flex items-center">
                      <div className="w-20 text-sm text-gray-700 font-medium">
                        {statNames[stat.stat.name] || stat.stat.name}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 mx-4 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ease-out
                            ${stat.base_stat >= 100 ? 'bg-green-500' : 
                              stat.base_stat >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ 
                            width: `${Math.min((stat.base_stat / 150) * 100, 100)}%`,
                            transition: 'width 1s ease-out'
                          }}
                        ></div>
                      </div>
                      <div className="w-12 text-sm font-bold text-right text-gray-800">
                        {stat.base_stat}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Capacités</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span 
                    key={ability.ability.name}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium capitalize"
                  >
                    {ability.ability.name.replace('-', ' ')}
                    {ability.is_hidden && (
                      <span className="ml-1 text-xs text-purple-600">(cachée)</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal du Pokédex
const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [types, setTypes] = useState([]);
  
  const pokemonPerPage = 20;

  // Charger la liste des types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type/');
        const data = await response.json();
        setTypes(data.results.filter(type => 
          !['unknown', 'shadow'].includes(type.name)
        ));
      } catch (error) {
        console.error('Erreur lors du chargement des types:', error);
      }
    };

    fetchTypes();
  }, []);

  // Charger la liste des Pokémon
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151&offset=0`);
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error('Erreur lors du chargement des Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  // Filtrer les Pokémon selon le terme de recherche
  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const startIndex = currentPage * pokemonPerPage;
  const endIndex = startIndex + pokemonPerPage;
  const currentPokemon = filteredPokemon.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-white opacity-20"></div>
          </div>
          <p className="text-white text-2xl font-bold animate-pulse">Chargement du Pokédex...</p>
          <p className="text-blue-200 text-sm mt-2">Connexion à PokéAPI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Pokédex
            </h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Explorez l'univers des Pokémon de la première génération. 
            Découvrez leurs statistiques, types et capacités !
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher un Pokémon par nom..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border-0 shadow-lg text-gray-700 
                           placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30
                           text-lg bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Résultats de recherche */}
        {searchTerm && (
          <div className="text-center mb-6">
            <p className="text-white text-lg">
              {filteredPokemon.length} Pokémon trouvé{filteredPokemon.length > 1 ? 's' : ''} 
              {searchTerm && ` pour "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Grille des Pokémon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
          {currentPokemon.map((pokemon) => (
            <PokemonCard 
              key={pokemon.name} 
              pokemon={pokemon} 
              onClick={setSelectedPokemon}
            />
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredPokemon.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white text-xl mb-2">Aucun Pokémon trouvé</p>
            <p className="text-blue-200">Essayez avec un autre nom</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-6">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       hover:bg-gray-100 hover:scale-105
                       transition-all duration-200 shadow-lg"
            >
              ← Précédent
            </button>
            
            <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-xl">
              <span className="text-white font-bold text-lg">
                {currentPage + 1} / {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       hover:bg-gray-100 hover:scale-105
                       transition-all duration-200 shadow-lg"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>

      {/* Modal des détails */}
      <PokemonModal 
        pokemon={selectedPokemon} 
        onClose={() => setSelectedPokemon(null)} 
      />
    </div>
  );
};

export default Pokedex;
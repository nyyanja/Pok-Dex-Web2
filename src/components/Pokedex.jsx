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
      <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 animate-pulse border border-cyan-400/30">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-2xl animate-pulse"></div>
        <div className="relative z-10">
          <div className="h-28 w-28 bg-slate-600 rounded-xl mb-4 mx-auto animate-pulse"></div>
          <div className="h-4 bg-slate-600 rounded mb-2 animate-pulse"></div>
          <div className="h-3 bg-slate-600 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!pokemonData) return null;

  const pokemonId = pokemonData.id.toString().padStart(3, '0');
  
  return (
    <div 
      onClick={() => onClick(pokemonData)}
      className="group relative bg-slate-800/90 backdrop-blur-xl border border-cyan-400/40 
                 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-500 
                 shadow-2xl hover:shadow-cyan-400/30 overflow-hidden"
    >
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/8 to-purple-400/8 
                      group-hover:from-cyan-400/20 group-hover:to-purple-400/20 
                      transition-all duration-500 rounded-2xl"></div>
      
      {/* Bordure lumineuse au hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                      bg-gradient-to-r from-cyan-400/60 to-purple-400/60 blur-sm -z-10
                      transition-opacity duration-500"></div>
      
      <div className="relative z-10 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 
                          rounded-full blur-lg opacity-0 group-hover:opacity-100 
                          transition-opacity duration-500"></div>
          <img 
            src={pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default}
            alt={pokemonData.name}
            className="relative w-28 h-28 mx-auto drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] 
                       transition-all duration-500 group-hover:scale-110"
          />
        </div>
        
        <h3 className="font-bold text-white capitalize text-xl mb-3 group-hover:text-cyan-300 
                       transition-colors duration-300">
          {pokemonData.name}
        </h3>
        
        <p className="text-sm text-slate-400 mb-4 font-mono tracking-wider">#{pokemonId}</p>
        
        <div className="flex flex-wrap justify-center gap-2">
          {pokemonData.types.map((type) => (
            <span 
              key={type.type.name}
              className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg
                border border-white/20 backdrop-blur-sm transition-all duration-300
                hover:shadow-lg hover:scale-105 ${getTypeColor(type.type.name)}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fonction pour obtenir la couleur d'un type avec des tons plus vifs
const getTypeColor = (type) => {
  const colors = {
    normal: 'bg-gradient-to-r from-gray-600 to-gray-500',
    fire: 'bg-gradient-to-r from-red-600 to-orange-500',
    water: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    electric: 'bg-gradient-to-r from-yellow-500 to-yellow-400',
    grass: 'bg-gradient-to-r from-green-600 to-emerald-500',
    ice: 'bg-gradient-to-r from-blue-400 to-cyan-300',
    fighting: 'bg-gradient-to-r from-red-700 to-red-600',
    poison: 'bg-gradient-to-r from-purple-600 to-violet-500',
    ground: 'bg-gradient-to-r from-yellow-700 to-amber-600',
    flying: 'bg-gradient-to-r from-indigo-500 to-blue-400',
    psychic: 'bg-gradient-to-r from-pink-600 to-rose-500',
    bug: 'bg-gradient-to-r from-green-500 to-lime-400',
    rock: 'bg-gradient-to-r from-yellow-800 to-amber-700',
    ghost: 'bg-gradient-to-r from-purple-800 to-indigo-700',
    dragon: 'bg-gradient-to-r from-indigo-700 to-purple-600',
    dark: 'bg-gradient-to-r from-gray-800 to-gray-700',
    steel: 'bg-gradient-to-r from-gray-600 to-slate-500',
    fairy: 'bg-gradient-to-r from-pink-400 to-rose-300',
  };
  return colors[type] || 'bg-gradient-to-r from-gray-600 to-gray-500';
};

// Modal pour afficher les détails d'un Pokémon
const PokemonModal = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  const pokemonId = pokemon.id.toString().padStart(3, '0');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center p-6 z-50">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-400/40 rounded-3xl 
                      max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl shadow-cyan-400/30">
        
        {/* Header avec effet de fond */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-xl rounded-t-3xl p-8 
                        border-b border-cyan-400/30 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold capitalize bg-gradient-to-r from-cyan-400 to-purple-400 
                           bg-clip-text text-transparent">
              {pokemon.name}
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white text-4xl font-bold w-12 h-12 
                       flex items-center justify-center rounded-full hover:bg-red-500/20 
                       hover:border-red-400/50 border border-transparent transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-8">
          {/* Section image et infos de base */}
          <div className="text-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                              rounded-full blur-2xl"></div>
              <img 
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="relative w-48 h-48 mx-auto drop-shadow-[0_0_50px_rgba(34,211,238,0.3)]"
              />
            </div>
            
            <p className="text-2xl text-slate-400 mb-6 font-mono tracking-widest">#{pokemonId}</p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {pokemon.types.map((type) => (
                <span 
                  key={type.type.name}
                  className={`px-6 py-3 rounded-2xl text-lg font-bold text-white shadow-2xl
                    border border-white/20 backdrop-blur-sm ${getTypeColor(type.type.name)}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Informations physiques */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
              <h3 className="font-bold text-2xl mb-6 text-cyan-300 border-b border-cyan-500/30 pb-3">
                Informations Physiques
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-xl 
                                border border-blue-500/30 backdrop-blur-sm">
                  <p className="text-blue-300 font-bold mb-2">TAILLE</p>
                  <p className="font-bold text-3xl text-white">{(pokemon.height / 10).toFixed(1)}m</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-6 rounded-xl 
                                border border-green-500/30 backdrop-blur-sm">
                  <p className="text-green-300 font-bold mb-2">POIDS</p>
                  <p className="font-bold text-3xl text-white">{(pokemon.weight / 10).toFixed(1)}kg</p>
                </div>
              </div>
            </div>

            {/* Statistiques de combat */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
              <h3 className="font-bold text-2xl mb-6 text-cyan-300 border-b border-cyan-500/30 pb-3">
                Statistiques de Combat
              </h3>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => {
                  const statNames = {
                    'hp': 'POINTS DE VIE',
                    'attack': 'ATTAQUE',
                    'defense': 'DÉFENSE',
                    'special-attack': 'ATT. SPÉCIALE',
                    'special-defense': 'DÉF. SPÉCIALE',
                    'speed': 'VITESSE'
                  };
                  
                  return (
                    <div key={stat.stat.name} className="flex items-center">
                      <div className="w-32 text-sm text-gray-300 font-bold tracking-wide">
                        {statNames[stat.stat.name] || stat.stat.name.toUpperCase()}
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-4 mx-6 overflow-hidden border border-gray-600">
                        <div 
                          className={`h-4 rounded-full transition-all duration-1500 ease-out relative overflow-hidden
                            ${stat.base_stat >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 
                              stat.base_stat >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
                              'bg-gradient-to-r from-red-500 to-pink-400'}`}
                          style={{ 
                            width: `${Math.min((stat.base_stat / 150) * 100, 100)}%`,
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-16 text-lg font-bold text-right text-white">
                        {stat.base_stat}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Capacités */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
              <h3 className="font-bold text-2xl mb-6 text-cyan-300 border-b border-cyan-500/30 pb-3">
                Capacités
              </h3>
              <div className="flex flex-wrap gap-3">
                {pokemon.abilities.map((ability) => (
                  <span 
                    key={ability.ability.name}
                    className="px-4 py-3 bg-gradient-to-r from-purple-800/50 to-indigo-800/50 
                               text-white rounded-xl text-sm font-bold capitalize border border-purple-500/30
                               backdrop-blur-sm hover:scale-105 transition-transform duration-300"
                  >
                    {ability.ability.name.replace('-', ' ')}
                    {ability.is_hidden && (
                      <span className="ml-2 text-xs text-purple-300 bg-purple-500/30 px-2 py-1 rounded-full">
                        CACHÉE
                      </span>
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

// Composant principal du Pokédx
const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const pokemonPerPage = 20;

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
      <div className="fixed inset-0 bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-900 
                      flex items-center justify-center overflow-hidden">
        {/* Effet d'arrière-plan animé */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r 
                          from-cyan-400/15 to-purple-400/15 rotate-12 animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l 
                          from-blue-400/15 to-pink-400/15 -rotate-12 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative mb-12">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent 
                            bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto p-1">
              <div className="bg-slate-800 rounded-full h-full w-full flex items-center justify-center">
                <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 
                            border-4 border-cyan-400/50 mx-auto"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 
                         bg-clip-text text-transparent mb-4 animate-pulse">
            Initialisation du Pokédex
          </h1>
          <p className="text-slate-300 text-lg animate-pulse">Connexion à l'univers Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-900 overflow-hidden">
      {/* Effets d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="container mx-auto px-6 py-8 min-h-full">
          {/* Header Futuriste */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <h1 className="text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 
                             bg-clip-text text-transparent mb-6 drop-shadow-2xl tracking-wider">
                POKÉDEX
              </h1>
              <div className="w-32 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full 
                              shadow-lg shadow-cyan-500/50"></div>
            </div>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Base de données interactive des créatures Pokémon - Nouvelle Génération 
            </p>
          </div>

          {/* Barre de recherche futuriste */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                              rounded-2xl blur-lg"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 
                              rounded-2xl p-8 shadow-2xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un Pokémon..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-8 py-6 rounded-xl bg-slate-700/60 border border-cyan-400/40 
                             text-white placeholder-slate-300 focus:outline-none focus:border-cyan-400
                             text-xl backdrop-blur-sm focus:bg-slate-700/80 transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full 
                                    flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats de recherche */}
          {searchTerm && (
            <div className="text-center mb-8">
              <p className="text-cyan-300 text-xl font-bold">
                {filteredPokemon.length} CRÉATURE{filteredPokemon.length > 1 ? 'S' : ''} DÉTECTÉE{filteredPokemon.length > 1 ? 'S' : ''}
                {searchTerm && (
                  <span className="text-purple-300"> • FILTRE: "{searchTerm.toUpperCase()}"</span>
                )}
              </p>
            </div>
          )}

          {/* Grille des Pokémon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
                          2xl:grid-cols-6 gap-8 mb-12">
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
            <div className="text-center py-20">
              <div className="mb-8">
                <svg className="w-24 h-24 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-white text-3xl mb-4 font-bold">AUCUNE CRÉATURE DÉTECTÉE</p>
              <p className="text-slate-400 text-xl">Modifiez les paramètres de recherche</p>
            </div>
          )}

          {/* Pagination futuriste */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-8 pb-8">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl 
                         font-bold disabled:opacity-30 disabled:cursor-not-allowed 
                         hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg
                         hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-500/30"
              >
                ← PRÉCÉDENT
              </button>
              
              <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 
                              px-8 py-4 rounded-xl">
                <span className="text-white font-bold text-xl">
                  {currentPage + 1} / {totalPages}
                </span>
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl 
                         font-bold disabled:opacity-30 disabled:cursor-not-allowed 
                         hover:from-purple-500 hover:to-pink-500 hover:scale-105 hover:shadow-lg
                         hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/30"
              >
                SUIVANT →
              </button>
            </div>
          )}
        </div>
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
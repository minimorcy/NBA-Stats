import { useState } from 'react';
import PlayerSearch from './PlayerSearch';
import StatFilterSidebar from './StatFilterSidebar';
import { translations } from '../utils/translations';

const orderedStats = [
    'MIN', 'PTS', 'REB', 'AST', 'FGM', 'FGA', 'FG_PCT', 'FG3M', 'FG3A', 'FG3_PCT', 
    'FTM', 'FTA', 'FT_PCT', 'OREB', 'DREB', 'BLK', 'TOV', 'PF', 'STL', 'PLUS_MINUS'
];

export default function PlayerStats() {
	const [stats, setStats] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [noResults, setNoResults] = useState(false);
	const [playerName, setPlayerName] = useState('');
	const [visibleStats, setVisibleStats] = useState(['MIN', 'PTS', 'AST', 'REB']);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleStat = (stat) => {
		setVisibleStats((prev) =>
			prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
		);
	};

	const translationsKey = (clave) => translations[clave] || clave;

	const searchPlayer = async (nombre) => {
		setPlayerName(nombre);
		setIsLoading(true);
		setNoResults(false);

		try {
			const res = await fetch(`http://localhost:8000/player-stats?name=${encodeURIComponent(nombre)}`);
			const data = await res.json();
			if (data && Object.keys(data).length > 0) {
				setStats(data);
			} else {
				setNoResults(true);
			}
		} catch (error) {
			console.error("Error al obtener los datos:", error);
			setNoResults(true);
		} finally {
			setIsLoading(false);
		}
	};

	// Ordenamos las estadísticas visibles según el orden en `orderedStats`
	const getOrderedStats = (sectionStats) => {
		return Object.entries(sectionStats)
			.filter(([key]) => visibleStats.includes(key)) // Filtrar las estadísticas visibles
			.sort(([keyA], [keyB]) => orderedStats.indexOf(keyA) - orderedStats.indexOf(keyB)); // Ordenar según el arreglo `orderedStats`
	};

	return (
		<div className="relative max-w-3xl mx-auto p-6">
			<div className="flex justify-between items-center mb-4">
				<PlayerSearch onPlayerSelect={(player) => searchPlayer(player.full_name)} />
				<button
					onClick={() => setSidebarOpen(true)}
					className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Filtrar estadísticas
				</button>
			</div>

			{isLoading && (
				<div className="flex justify-center items-center py-6">
					<div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
				</div>
			)}

			{noResults && !isLoading && (
				<div className="text-center text-red-600">
					<p>No se encontraron resultados.</p>
				</div>
			)}

			{playerName && !isLoading && (
				<div className="text-center text-2xl font-semibold text-gray-800 mb-6">
					Mostrando estadísticas de <span className="text-blue-700">{playerName}</span>
				</div>
			)}

			{stats && !isLoading && (
				<div className="space-y-6 flex flex-col">
					{Object.entries(stats).map(([sectionTitle, sectionStats]) => (
						<section
							key={sectionTitle}
							className="bg-white rounded-xl shadow p-6 border border-gray-100"
						>
							<h2 className="text-xl font-semibold mb-4 text-blue-700">
								{{
									season_avg: 'Media de la temporada',
									last_5_games_avg: 'Media últimos 5 partidos',
									last_10_games_avg: 'Media últimos 10 partidos'
								}[sectionTitle] || sectionTitle}
							</h2>

							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
								{getOrderedStats(sectionStats).map(([key, value]) => (
									<div key={key} className="bg-gray-50 rounded p-3 shadow-sm">
										<p className="text-sm text-gray-500">{translationsKey(key)}</p>
										<p className="text-lg font-medium text-gray-800">
											{Number(value).toFixed(2)}
										</p>
									</div>
								))}
							</div>
						</section>
					))}
				</div>
			)}

			{/* Sidebar de filtros */}
			<StatFilterSidebar
				visibleStats={visibleStats}
				toggleStat={toggleStat}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
		</div>
	);
}

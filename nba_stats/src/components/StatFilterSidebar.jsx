// components/StatFilterSidebar.jsx
import { translations } from '../utils/translations';

export default function StatFilterSidebar({ visibleStats, toggleStat, isOpen, onClose }) {
    return (
        <aside className={`fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Filtrar estadísticas</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-lg font-bold">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
                <div className="space-y-3">
                    {Object.entries(translations).map(([stat, label]) => (
                        <label key={stat} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={visibleStats.includes(stat)}
                                onChange={() => toggleStat(stat)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}

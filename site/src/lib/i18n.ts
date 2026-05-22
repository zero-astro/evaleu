export type Language = 'eu' | 'en';

// Translation dictionary
const translations: Record<string, Partial<Record<Language, string>>> = {
	// +page.svelte
	'title': { eu: 'Evaleu — Ebaluazioa LLM Euskal Herriko', en: 'Evaleu — Basque LLM Evaluation Dashboard' },
	'hero_sub': { eu: 'LLM Euskarazko Ebaluazioa', en: 'Basque LLM Evaluation Dashboard' },
	'top_performer': { eu: '⭐ Errendimendu Onena', en: '⭐ Top Performer' },
	'leaderboard_title': { eu: '🏆 Sailkapen-orria', en: '🏆 Leaderboard' },
	'evolution_title': { eu: '📈 Bilakaera Denboran', en: '📈 Evolution Over Time' },
	'comparison_title': { eu: '⚔️ Modeloen Konparaketa', en: '⚔️ Model Comparison' },

	// Leaderboard.svelte
	'search_placeholder': { eu: 'Bilatu modeloak...', en: 'Search models...' },
	'all_families': { eu: 'Familia guztiak', en: 'All Families' },
	'overall_mean': { eu: 'Bataz Besteko Orora', en: 'Overall Mean' },
	'params_label': { eu: 'Parametroak', en: 'Params' },
	'quantization': { eu: 'Kuantizazioa', en: 'Quantization' },
	'family_label': { eu: 'Familia', en: 'Family' },
	'name_column': { eu: 'Izena', en: 'Name' },
	'rank_column': { eu: '#', en: '#' },
	'row_hint': { eu: 'models erakusten · Egin klik xehetasunetarako', en: 'models shown · Click a row for details' },

	// ComparisonTool.svelte
	'compare_models': { eu: 'Konparatu Modeloak', en: 'Compare Models' },
	'select_models': { eu: 'Aukeratu 2–4 modelo konparatzeko', en: 'Select 2–4 models to compare' },
	'more_needed': { eu: 'Hautatu gutxienez beste modelo bat konpara dezazun.', en: 'Select at least one more model to compare.' },

	// ModelDetailModal.svelte
	'modal_close': { eu: 'Itxi', en: 'Close' },
	'modal_title': { eu: 'Modeloaren xehetasunak', en: 'Model Details' },
	'family_meta': { eu: 'Familia', en: 'Family' },
	'params_meta': { eu: 'Parametroak', en: 'Params' },
	'quantization_meta': { eu: 'Kuantizazioa', en: 'Quantization' },
	'release_date': { eu: 'Argitaratze data', en: 'Release date' },
	'description': { eu: 'Deskribapena', en: 'Description' },
	'scores_title': { eu: '📊 Puntuazioak', en: '📊 Scores' },
	'overall_mean_score': { eu: 'Bataz Besteko Orora:', en: 'Overall Mean:' },
	'std_dev': { eu: 'Desbideratze Estándarra:', en: 'Std Dev:' },
	'min_score': { eu: 'Puntuazio minimoa:', en: 'Min Score:' },
	'max_score': { eu: 'Puntuazio maximoa:', en: 'Max Score:' },

	// ExportButton.svelte
	'export_csv': { eu: '📄 CSV', en: '📄 CSV' },
	'export_json': { eu: '📋 JSON', en: '📋 JSON' },

	// TimelineChart.svelte
	'timeline_title': { eu: 'Argitaratze Data vs Akurturia', en: 'Release Date vs Accuracy' },
	'date_label': { eu: 'Argitaratze data', en: 'Release Date' },
	'acc_label': { eu: 'Akurturia (%)', en: 'Accuracy (%)' },

	// RadarPlot.svelte
	'radar_title': { eu: 'Benchmark-en arabera errendimendua', en: 'Performance by Benchmark' },

	// Theme selector
	'theme_auto': { eu: 'Automatikoa', en: 'Auto' },
	'theme_dark': { eu: 'Iluna', en: 'Dark' },
	'theme_light': { eu: 'Argia', en: 'Light' },

	// Language selector
	'lang_eu': { eu: 'EU', en: 'EU' },
	'lang_en': { eu: 'EN', en: 'EN' },
};

export function t(key: string, lang: Language): string {
	return translations[key]?.[lang] ?? key;
}

// Theme mode type and state
export type ThemeMode = 'auto' | 'dark' | 'light';

function getSystemDark(): boolean {
	try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch { return false; }
}

let _themeMode: ThemeMode = 'auto';
const _subscribers: Set<() => void> = new Set();

export function getThemeMode(): ThemeMode { return _themeMode; }

export function setThemeMode(mode: ThemeMode): void {
	_themeMode = mode;
	const isDark = mode === 'dark' ? true : mode === 'light' ? false : getSystemDark();
	document.documentElement.classList.toggle('dark', isDark);
	try { localStorage.setItem('evaleu-theme-mode', mode); } catch {}
	for (const fn of _subscribers) fn();
}

export function subscribe(fn: () => void): () => void {
	_subscribers.add(fn);
	return () => { _subscribers.delete(fn); };
}

// Language state
let _language: Language = 'en';

export function getLanguage(): Language { return _language; }

export function setLanguage(lang: Language): void {
	_language = lang;
	try { localStorage.setItem('evaleu-lang', lang); } catch {}
	document.documentElement.setAttribute('data-lang', lang);
	for (const fn of _subscribers) fn();
}

// Initialize from localStorage on load
function init() {
	try {
		const theme = localStorage.getItem('evaleu-theme-mode');
		if (theme === 'auto' || theme === 'dark' || theme === 'light') {
			_themeMode = theme;
		}
		const lang = localStorage.getItem('evaleu-lang');
		if (lang === 'eu' || lang === 'en') {
			_language = lang;
		} else {
			const navLang = navigator.language?.toLowerCase();
			_language = navLang?.startsWith('eu') ? 'eu' : 'en';
		}
		document.documentElement.setAttribute('data-lang', _language);

		// Apply theme on init
		const isDark = _themeMode === 'dark' ? true : _themeMode === 'light' ? false : getSystemDark();
		document.documentElement.classList.toggle('dark', isDark);
	} catch {}

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
		if (_themeMode === 'auto') {
			const isDark = getSystemDark();
			document.documentElement.classList.toggle('dark', isDark);
		}
	});
}

init();

import { writable } from 'svelte/store';

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
	'overall_mean_comp': { eu: 'Bataz Besteko Orora', en: 'Overall Mean' },

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

	// ModelDetailModal extra
	'meta_kv_cache': { eu: 'KV Cache', en: 'KV Cache' },
	'meta_hf': { eu: 'HuggingFace', en: 'HuggingFace' },
	'scores_section': { eu: '📊 Puntuazioak', en: '📊 Scores' },
	'breakdown_title': { eu: '📋 Benchmark Banaketa', en: '📋 Benchmark Breakdown' },
	'runs_title': { eu: '🔄 Seed Exekuzioak', en: '🔄 Seed Runs' },
	'seed_col': { eu: 'Seed', en: 'Seed' },

	// TimelineChart extra
	'timeline_chart_title': { eu: 'Argitaratze Data vs Akurturia', en: 'Release Date vs Accuracy' },

	// ComparisonTool - table header
	'benchmark_col': { eu: 'Benchmark', en: 'Benchmark' },

	// ScoreBar tier labels
	'tier_excellent': { eu: 'Ziurra', en: 'Excellent' },
	'tier_good': { eu: 'Ona', en: 'Good' },
	'tier_needs_work': { eu: 'Hobe hobetu', en: 'Needs Work' },

	// TimelineChart axis labels + hover
	'timeline_x_label': { eu: 'Argitaratze data', en: 'Release Date' },
	'timeline_y_label': { eu: 'Akurturia (%)', en: 'Accuracy (%)' },
	'timeline_hover': { eu: '{label}<br>Akurturia: {value}%', en: '{label}<br>Accuracy: {value}%' },

	// RadarPlot hover template
	'radar_hover': { eu: '<b>%{{label}}</b><br>Akurturia: %{r:.1f}%<extra></extra>', en: '<b>%{{label}}</b><br>Accuracy: %{r:.1f}%<extra></extra>' },

	// ModelDetailModal - metadata labels (dt/dd pairs)
	'meta_family': { eu: 'Familia', en: 'Family' },
	'meta_params': { eu: 'Parametroak', en: 'Parameters' },
	'meta_weights_quant': { eu: 'Weights / Quant', en: 'Weights / Quant' },
	'meta_release_date': { eu: 'Argitaratze data', en: 'Release Date' },
	'meta_hf': { eu: 'HuggingFace', en: 'HuggingFace' },

	// ModelDetailModal - scores section
	'scores_overall_mean_label': { eu: 'Overall Mean:', en: 'Overall Mean:' },
	'scores_std_dev_label': { eu: 'Std Dev:', en: 'Std Dev:' },

	// ModelDetailModal - benchmark breakdown
	'breakdown_title': { eu: '📋 Benchmark Banaketa', en: '📋 Benchmark Breakdown' },

	// ModelDetailModal - runs section
	'runs_seed_col': { eu: 'Seed', en: 'Seed' },
	'runs_overall_col': { eu: 'Overall', en: 'Overall' },
};

// Export the raw translations dict for direct access (e.g. RadarPlot with Plotly placeholders)
export const i18n = translations;

export function t(key: string, lang: Language, params?: Record<string, string>): string {
	let result = translations[key]?.[lang] ?? key;
	if (params) {
		for (const [k, v] of Object.entries(params)) {
			result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
		}
	}
	return result;
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

// Language store — reactive with Svelte writable
let _language: Language = 'en';

const languageStore = writable<Language>('en');

export function getLanguage(): Language { return _language; }
export const lang = languageStore; // export for $lang usage in components

export function setLanguage(lang: Language): void {
	_language = lang;
	languageStore.set(lang);
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
		languageStore.set(_language);
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

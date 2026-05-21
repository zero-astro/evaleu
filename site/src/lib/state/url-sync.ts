import { writable, derived } from 'svelte/store';

export interface FilterState {
	sortKey: string;
	sortDir: 'asc' | 'desc';
	familyFilter: string;
	search: string;
}

function getInitialFilter(): FilterState {
	const params = new URLSearchParams(window.location.search);
	return {
		sortKey: params.get('sort') || 'overallMean',
		sortDir: (params.get('dir') as 'asc' | 'desc') || 'desc',
		familyFilter: params.get('family') || 'all',
		search: params.get('search') || '',
	};
}

function syncUrl(state: FilterState) {
	try {
		const params = new URLSearchParams();
		if (state.sortKey !== 'overallMean') params.set('sort', state.sortKey);
		if (state.sortDir === 'asc') params.set('dir', state.sortDir);
		if (state.familyFilter !== 'all') params.set('family', state.familyFilter);
		if (state.search) params.set('search', state.search);

		const url = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
		window.history.replaceState({}, '', url);
	} catch {
		// Silently ignore in test environments where window.location may be restricted
	}
}

export const filterStore = writable<FilterState>(getInitialFilter());

// Sync URL whenever filter changes
export function applyFilter(newPartial: Partial<FilterState>) {
	filterStore.update((prev) => {
		const next = { ...prev, ...newPartial };
		syncUrl(next);
		return next;
	});
}

// Listen for back/forward navigation
let popstateHandler: (() => void) | null = null;

export function initUrlSync() {
	// Remove any existing listener to prevent duplicates
	if (popstateHandler) {
		window.removeEventListener('popstate', popstateHandler);
	}
	popstateHandler = () => {
		const params = new URLSearchParams(window.location.search);
		filterStore.set({
			sortKey: params.get('sort') || 'overallMean',
			sortDir: (params.get('dir') as 'asc' | 'desc') || 'desc',
			familyFilter: params.get('family') || 'all',
			search: params.get('search') || '',
		});
	};
	window.addEventListener('popstate', popstateHandler);
}

// Utility: filter and sort models given a FilterState
export function applyFiltersToModels(models: any[], filters: FilterState): any[] {
	let filtered = models.filter((m: any) => m.siteVisibility === 'published');

	if (filters.search.trim()) {
		const q = filters.search.toLowerCase();
		filtered = filtered.filter(
			(m: any) => m.displayName?.toLowerCase().includes(q),
		);
	}

	if (filters.familyFilter !== 'all') {
		filtered = filtered.filter((m: any) => m.family === filters.familyFilter);
	}

	return [...filtered].sort((a: any, b: any) => {
		const aVal = a[filters.sortKey];
		const bVal = b[filters.sortKey];

		if (filters.sortKey === 'params') {
			const numA = parseFloat(a.params);
			const numB = parseFloat(b.params);
			return filters.sortDir === 'asc' ? numA - numB : numB - numA;
		}

		if (typeof aVal === 'number' && typeof bVal === 'number') {
			return filters.sortDir === 'asc' ? aVal - bVal : bVal - aVal;
		}

		return filters.sortDir === 'asc'
			? String(aVal).localeCompare(String(bVal))
			: String(bVal).localeCompare(String(aVal));
	});
}

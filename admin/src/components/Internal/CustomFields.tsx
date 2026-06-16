import { ComponentType, useCallback, useEffect, useState } from 'react';
import { useStrapiApp } from '@strapi/strapi/admin';

const componentStore = new Map<string, ComponentType | undefined>();

type LazyComponentStore = Record<string, ComponentType | undefined>;

interface UseLazyComponentsReturn {
	isLazyLoading: boolean;
	lazyComponentStore: LazyComponentStore;
	cleanup: () => void;
}

/**
 * A plugin-safe hook to lazy load custom fields like CKEditor using Strapi 5 public API
 */
const useLazyComponents = (componentUids: string[] = []): UseLazyComponentsReturn => {
	const [lazyComponentStore, setLazyComponentStore] = useState(Object.fromEntries(componentStore));
	const [loading, setLoading] = useState(() => componentUids.some((uid) => !componentStore.has(uid)));

	// Access customFields.get from Strapi context
	const getCustomField = useStrapiApp('custom-fields-lazy', (state: any) => state?.customFields?.get);

	useEffect(() => {
		const newUids = componentUids.filter((uid) => !componentStore.has(uid));
		if (newUids.length === 0 || !getCustomField) return;

		const loadComponents = async () => {
			setLoading(true);

			const componentPromises = newUids.map((uid) => {
				const customField = getCustomField(uid);
				return customField?.components?.Input?.();
			});

			const modules = await Promise.all(componentPromises);

			newUids.forEach((uid, index) => {
				componentStore.set(uid, modules[index]?.default);
			});

			setLazyComponentStore(Object.fromEntries(componentStore));
			setLoading(false);
		};

		loadComponents();
	}, [componentUids, getCustomField]);

	const cleanup = useCallback(() => {
		componentStore.clear();
		setLazyComponentStore({});
	}, []);

	return {
		isLazyLoading: loading,
		lazyComponentStore,
		cleanup,
	};
};

export { useLazyComponents };
export type { UseLazyComponentsReturn, LazyComponentStore };

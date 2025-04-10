import React from 'react';
import { useStrapiApp } from '@strapi/strapi/admin';

// import { prefixFileUrlWithBackendUrl, isImageResponsive } from '../utils';

type MediaLibProps = {
	isOpen: boolean;
	toggle: () => void;
	handleChangeAssets: (formattedFiles: object) => void;
};

function MediaLib({ isOpen = false, toggle, handleChangeAssets }: MediaLibProps) {
	const components = useStrapiApp('MediaLib', (state) => state.components);
	const MediaLibraryDialog = components['media-library'];

	function prefixFileUrlWithBackendUrl(fileURL: string): string {
		// @ts-ignore // Backend url does exist
		return !!fileURL && fileURL.startsWith('/') ? `${window.strapi.backendURL ?? ''}${fileURL}` : fileURL;
	}

	function handleSelectAssets(files: any[]): void {
		const formattedFiles = files.map((f) => ({
			name: f.name,
			alt: f.alternativeText || f.name,
			url: prefixFileUrlWithBackendUrl(f.url),
			mime: f.mime,
			formats: f.formats,
			width: f.width,
			height: f.height,
		}));

		handleChangeAssets(formattedFiles);
	}

	if (!isOpen) {
		return null;
	}

	// @ts-ignore
	return <MediaLibraryDialog onClose={toggle} onSelectAssets={handleSelectAssets} />;
}

const MemoizedMediaLib = React.memo(MediaLib);
export { MemoizedMediaLib as MediaLib };

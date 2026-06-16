//@ts-nocheck
import { useEffect, useState } from 'react';
import { useField } from 'formik';
import { Grid, Field } from '@strapi/design-system';
import { TextInput } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTranslation';
import { useLazyComponents } from './CustomFields';
import RichTextMediaField from '../Fields/RichTextMediaField';
import {
	getDefaultEmailFooter,
	getDefaultEmailHeader,
	getDefaultEmailBody,
	getDefaultEmailTemplate,
} from '../Settings/DefaultEmailPlaceholders';

const builtinComponents = {
	string: TextInput,
	text: TextInput,
	email: TextInput,
	richtext: RichTextMediaField,
};

const DynamicField = ({ config }) => {
	const { formatMessage } = useIntl();
	const { type, name, label, hint, attribute } = config;
	const uid = attribute?.customField || type;

	const [Component, setComponent] = useState(null);
	const { isLazyLoading, lazyComponentStore } = useLazyComponents(uid ? [uid] : []);
	const [field, meta, helpers] = useField(name);

	useEffect(() => {
		if (uid && lazyComponentStore[uid]) {
			setComponent(() => lazyComponentStore[uid]);
		} else if (builtinComponents[uid]) {
			setComponent(() => builtinComponents[uid]);
		}
	}, [uid, lazyComponentStore, type, isLazyLoading]);

	if (!Component) {
		return <></>;
	}

	if (uid === 'richtext' && !field.value) {
		const defaultValueMap: Record<string, () => string> = {
			html: getDefaultEmailTemplate,
		};

		const getDefaultValue = defaultValueMap[name];

		if (getDefaultValue) {
			field.value = getDefaultValue();
		}
	}

	return (
		<Grid.Item col={config.size ?? 6} xs={12}>
			<Field.Root
				name={name}
				style={{ width: '100%' }}
				hint={formatMessage({ id: getTranslation(`settings.description.${name}`) })}
				error={meta.touched && meta.error ? meta.error : undefined}
			>
				<Field.Label>{formatMessage({ id: getTranslation(`settings.label.${name}`) })}</Field.Label>
				<Component
					name={name}
					value={field.value ?? ''}
					onChange={(e) => {
						helpers.setValue(e?.target?.value ?? e);
					}}
					attribute={attribute}
					placeholder={config.placeholder}
					disabled={config.disabled}
					required={config.required}
				/>
				<Field.Hint />
				<Field.Error />
			</Field.Root>
		</Grid.Item>
	);
};

export default DynamicField;

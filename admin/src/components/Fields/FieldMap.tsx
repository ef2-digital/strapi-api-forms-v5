//@ts-nocheck
import { FunctionComponent } from 'react';
import { TextInput, Textarea } from '@strapi/design-system';
import { FieldType } from '../../utils/types';
import Checkbox from './Checkbox';
import CheckboxGroup from './CheckboxGroup';
import RadioGroup from './RadioGroup';
import Select from './Select';

const fieldMap = new Map<string, FunctionComponent<any>>([
  ['text', (props: FieldType) => <TextInput {...props} />],
  ['email', (props: FieldType) => <TextInput {...props} />],
  ['number', (props: FieldType) => <TextInput {...props} />],
  ['textarea', (props: FieldType) => <Textarea {...props} />],
  ['checkbox', (props: FieldType) => <Checkbox {...props} />],
  ['checkboxgroup', (props: FieldType) => <CheckboxGroup {...props} />],
  ['radio', (props: FieldType) => <RadioGroup {...props} />],
  ['select', (props: FieldType) => <Select {...props} />],
  ['file', (props: FieldType) => <TextInput {...props} />],
  ['tel', (props: FieldType) => <TextInput {...props} />],
]);

export default fieldMap;

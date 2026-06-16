import { Step } from '../context/FormContext';
import { FieldDirectionEnum, FieldTypeEnum, HandlerTypeEnum } from './enums';
import * as React from 'react';

export interface PaginationObject {
	pagination: {
		page: number;
		pageSize: number;
		pageCount: number;
		total: number;
	};
}

export interface MessageType {
	data: { message: string };
}
export interface FormResponse {
	data: FormType[] | [];
	meta: PaginationObject;
}

export interface SubmissionsResponse {
	data: SubmissionType[] | [];
	meta: PaginationObject;
}

export interface SubmissionResponse {
	data: SubmissionDetailType;
}

export interface FormRequest {
	data: FormType;
}

export interface NotificationRequest {
	data: NotificationType;
}
export interface FormType {
	id?: number | null;
	title: string;
	documentId: string;
	successMessage: string;
	errorMessage: string;
	active: boolean;
	dateFrom: string;
	dateTill: string;
	steps: Step[];
	createdAt?: string;
	updatedAt?: string;
	submission?: {
		count: number;
	};
	submissions?: SubmissionType[];
	notifications?: NotificationType[];
}

export interface NotificationType {
	id: number;
	documentId: string;
	from: string;
	to: string;
	subject: string;
	enabled: boolean;
	identifier: string;
	createdAt: string;
	updatedAt: string;
	message: string;
	service: string;
	form?: FormType;
}

export type FormCollectionType = Array<FormType>;

export interface SubmissionType {
	id: number;
	form?: {
		title: string;
	};
	submission: string;
	createdAt: string;
	updatedAt: string;
	files: Array<any>;
	referer?: string;
}

export interface SubmissionDetailType {
	id: number;
	attributes: {
		form?: {
			id?: string;
			title: string;
		};
		files: any;
		submission: string;
		createdAt: string;
		updatedAt: string;
	};
}

export type SubmissionCollectionType = Array<SubmissionType>;

export interface FieldType {
	label: string;
	placeholder?: string;
	name: string;
	type?: FieldTypeEnum;
	options: FieldOptionProps[] | [];
	config: FieldConfigProps;
}

export type FieldOptionProps = {
	label: string;
	value: string;
};
export type FieldConfigProps = {
	required: boolean;
	validation?: {
		allowedTypes?: string;
	};
	ui: {
		width?: string;
		classNames?: string;
		hideLabel?: boolean;
	};
};

export const FieldTypeDefaultProps = {
	label: '',
	name: '',
	options: [],
	config: {
		required: false,
		ui: { width: '100%', classNames: '', hideLabel: false },
	},
};

export type FieldCollectionType = Array<FieldType>;

export type ActionMap<M extends { [index: string]: any }> = {
	[Key in keyof M]: M[Key] extends undefined
		? {
				type: Key;
			}
		: {
				type: Key;
				payload: M[Key];
			};
};

export type FieldMoveProps = {
	event: React.MouseEvent<HTMLDivElement, MouseEvent>;
	position: number;
	name: string;
	direction: FieldDirectionEnum;
};

export type HandlerType = {
	id: number;
	identifier: string;
	type: HandlerTypeEnum;
	data: EmailHandlerDataType;
	enabled: boolean;
	service: string;
};

export type EmailHandlerDataType = {
	sendTo: string;
	sendFrom: string;
	subject: string;
	message: string;
};

export type EmailSubmissionType = {
	to: string[];
	from: string;
	subject: string;
	html: string;
	attachment?: { data?: string; filename: string }[];
	attachments?: { path?: string; filename: string }[];
};

export type HandlerCollectionType = Array<HandlerType>;

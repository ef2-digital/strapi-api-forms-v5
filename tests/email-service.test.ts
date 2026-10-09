import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import emailService from '../server/src/services/email-service';

const FORM = { id: 7, title: 'Contactformulier' };

const SUBMISSION = {
	submission: { voorEnachternaam: 'Test', eMail: 'visitor@example.test' },
	files: [],
};

function notification(overrides: Record<string, any>) {
	return {
		identifier: 'notification',
		enabled: true,
		service: 'emailService',
		subject: 'Nieuwe inzending',
		message: '<p>{{voorEnachternaam}}</p>',
		to: 'team@example.test',
		from: 'Team <team@example.test>',
		...overrides,
	};
}

let sent: any[];
let warnings: string[];
let errors: string[];

beforeEach(() => {
	sent = [];
	warnings = [];
	errors = [];

	(globalThis as any).strapi = {
		plugin: () => ({
			service: () => ({
				getProviderSettings: () => ({ provider: 'mailgun', settings: {} }),
				async send(message: any) {
					sent.push(message);
				},
			}),
		}),
		requestContext: { get: () => undefined },
		log: {
			info: () => {},
			warn: (line: string) => warnings.push(line),
			error: (line: string) => errors.push(line),
		},
	};
});

afterEach(() => {
	delete (globalThis as any).strapi;
});

describe('the recipient of a notification', () => {
	it('accepts an address with a display name', async () => {
		await emailService.process(notification({ to: 'Team <team@example.test>' }) as any, SUBMISSION as any, FORM as any);

		expect(sent.map((message) => message.to)).toEqual([['Team <team@example.test>']]);
	});

	it('reads the address from the submission for a confirmation', async () => {
		await emailService.process(notification({ identifier: 'confirmation', to: 'eMail' }) as any, SUBMISSION as any, FORM as any);

		expect(sent.map((message) => message.to)).toEqual([['visitor@example.test']]);
	});

	it('sends nothing when the recipient is empty', async () => {
		await emailService.process(notification({ identifier: 'confirmation', to: '' }) as any, SUBMISSION as any, FORM as any);

		expect(sent).toHaveLength(0);
		expect(errors.join('\n')).toContain('No valid email address');
	});

	it('sends nothing when the recipient is missing altogether', async () => {
		await emailService.process(notification({ to: null }) as any, SUBMISSION as any, FORM as any);

		expect(sent).toHaveLength(0);
		expect(errors.join('\n')).toContain('No valid email address');
	});
});

describe('the sender of a notification', () => {
	it('passes a sender with an address on unchanged', async () => {
		await emailService.process(notification({}) as any, SUBMISSION as any, FORM as any);

		expect(sent[0].from).toBe('Team <team@example.test>');
		expect(warnings).toHaveLength(0);
	});

	it('falls back to the default sender when the sender holds no address', async () => {
		await emailService.process(notification({ from: 'Vrijwilligerswerk' }) as any, SUBMISSION as any, FORM as any);

		expect(sent).toHaveLength(1);
		expect(sent[0].from).toBeUndefined();
		expect(warnings.join('\n')).toContain('"Vrijwilligerswerk"');
	});

	it('falls back to the default sender when the sender is empty, without a warning', async () => {
		await emailService.process(notification({ from: '' }) as any, SUBMISSION as any, FORM as any);

		expect(sent[0].from).toBeUndefined();
		expect(warnings).toHaveLength(0);
	});
});

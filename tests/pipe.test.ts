import { pipe } from '../src';


describe('The Pipe interface', () => {

	test('returns last result when there are no throws', () => {
		pipe(true)
			.try(data => data ? 99 : 0)
			.try(data => `I've got ${ data } problems!`)
			.do(result => {
				expect(result).toBe('I\'ve got 99 problems!')
			});
	});

	test.each`
		throwAt		| caughtAt		| caught	| lastData
		${ 'a' }	| ${ 'third' }	| ${ 'W' }	| ${ undefined }
		${ 'b' }	| ${ 'second' }	| ${ 'X' }	| ${ 'a' }
		${ 'c' }	| ${ 'second' }	| ${ 'Y' }	| ${ 'b' }
		${ 'd' }	| ${ 'first' }	| ${ 'Z' }	| ${ 'c' }
		${ 'e' }	| ${ 'first' }	| ${ 'Z' }	| ${ 'd' }
	`('handles throw while producing "$throwAt" at the $caughtAt catch', ({ throwAt, caughtAt, caught, lastData }) => {
		pipe()
			.guard<'W'>()
			.try(() => throwAt === 'a' ? (() => {throw 'W'})() : 'a' as const)
			.guard<'X'>()
			.try(() => throwAt === 'b' ? (() => {throw 'X'})() : 'b' as const)
			.guard<'Y'>()
			.try(() => throwAt === 'c' ? (() => {throw 'Y'})() : 'c' as const)
			.guard<'Z'>()
			.try(() => throwAt === 'd' ? (() => {throw 'Z'})() : 'd' as const)
			.try(() => throwAt === 'e' ? (() => {throw 'Z'})() : 'e' as const)
			.catch((thrown, saved) => {
				match({ at: 'first', thrown, saved })
			}, 0)
			.catch((thrown, saved) => {
				match({ at: 'second', thrown, saved })
			}, 1)
			.catch((thrown) => {
				match({ at: 'third', thrown, saved: undefined })
			});

		function match({ at, thrown, saved }: any) {
			expect(at).toBe(caughtAt);
			expect(thrown).toBe(caught);
			expect(saved).toBe(lastData);
		}
	});

	test('throws out when there is a throw within a do', () => {
		expect(() => {
			pipe()
				.do(() => {
					throw 'Error';
				})
		}).toThrow();
	});

	test('passes last result when the task argument for a try or do returns void', () => {
		pipe('Last Result')
			.try(data => {
				`Do nothing with ${ data }`;
			})
			.do(data => {
				`Do nothing with ${ data }`;
			})
			.do(result => {
				expect(result).toBe('Last Result')
			});
	});
});

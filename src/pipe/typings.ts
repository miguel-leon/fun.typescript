import { ValidIndices, VoidToUndefined } from '../utility';

export type Task<I, O> = Exclude<I, void> extends never ? () => O : (data: I) => O;

export type CatchTask<E, I, O> = Exclude<I, void> extends never ? (error: E) => O | void : (error: E, lastData: VoidToUndefined<I>) => O | void;

export type ContinueTask<I> = Exclude<I, void> extends never ? () => void : (data: I) => void;


export type PushGuarded<Current, Guarded extends any[][]> =
	Guarded extends [infer CurrentGuard, ...infer Guarded] ?
		CurrentGuard extends any[] ? // TODO: remove when bug is fixed (https://github.com/microsoft/TypeScript/issues/45448).
			[[Current, ...CurrentGuard], ...Guarded] :
			never : never;


export type ErrorThrown<Level extends number | undefined, Guards extends any[], Error extends any[] = []> =
	Level extends undefined ? Guards extends [] ? unknown : Guards[number] :
		Guards extends [infer E, ...infer Guards] ?
			Error['length'] extends Level ? [...Error, E][number] :
				ErrorThrown<Level, Guards, [...Error, E]> :
			never;


export type DataGuarded<Level extends number | undefined, Guarded extends any[][], Data extends any[] = []> =
	Level extends undefined ? Guarded[number][number] :
		Guarded extends [infer G, ...infer Guarded] ?
			G extends any[] ? Guarded extends any[][] ? // TODO: remove when bug is fixed (https://github.com/microsoft/TypeScript/issues/45448).
				Data['length'] extends Level ? [...Data, G[number]][number] :
					DataGuarded<Level, Guarded, [...Data, G[number]]> :
				never : never : never;


export type ReducePipe<Level extends number | undefined, Current, Guards extends any[], Guarded extends any[][], Count extends never[] = []> =
	Level extends undefined ? ClearPipe<Current> :
		Guards extends [any, ...infer Guards] ? Guarded extends [any, ...infer Guarded] ?
			Guarded extends any[][] ? // TODO: remove when bug is fixed (https://github.com/microsoft/TypeScript/issues/45448).
				Count['length'] extends Level ?
					Guards extends [] ? ClearPipe<Current> : Pipe<Current, Guards, Guarded> :
					ReducePipe<Level, Current, Guards, Guarded, [never, ...Count]> :
				never : never : never;


export interface ClearPipe<Current, Guards extends any[] = []> {
	guard<Error>(): ClearPipe<Current, [Error | Guards[number]]>;

	try<Next>(task: Task<Current, Next>): Pipe<Next, Guards extends [] ? [unknown] : Guards, [[Current]]>;

	continue(task: ContinueTask<Current>): ClearPipe<Current, Guards>;
}

export interface Pipe<Current, Guards extends any[], Guarded extends any[][]> {
	guard<Error>(): Pipe<Current, [Error, ...Guards], [[], ...Guarded]>;

	try<Next>(task: Task<Current, Next>): Pipe<Next, Guards, PushGuarded<Current, Guarded>>;

	catch(task: CatchTask<ErrorThrown<undefined, Guards>, DataGuarded<undefined, Guarded>, Current>): ReducePipe<undefined, Current, Guards, Guarded>;

	catch<Level extends ValidIndices<Guards>>(task: CatchTask<ErrorThrown<Level, Guards>, DataGuarded<Level, Guarded>, Current>, level: Level): ReducePipe<Level, Current, Guards, Guarded>;

	continue(task: ContinueTask<Current>): Pipe<Current, Guards, Guarded>;
}

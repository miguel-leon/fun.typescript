type ValidIndices_<Array extends any[], Indices extends number[] = []> =
	Indices['length'] extends Array['length'] ?
		Indices[number] :
		ValidIndices_<Array, [...Indices, Indices['length']]>;

export type ValidIndices<Array extends any[]> = ValidIndices_<Array>;


export type VoidToUndefined<T> = void extends T ? Exclude<T, void> | undefined : T;

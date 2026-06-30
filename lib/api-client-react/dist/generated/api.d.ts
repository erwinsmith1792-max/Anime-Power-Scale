import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Anime, BattleAnalysis, BattleRequest, BattleSummary, Character, CharacterDetail, Evidence, HealthStatus, ListBattlesParams, ListCharactersParams, ListEvidenceParams, StatsOverview } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListAnimeUrl: () => string;
/**
 * @summary List all supported anime
 */
export declare const listAnime: (options?: RequestInit) => Promise<Anime[]>;
export declare const getListAnimeQueryKey: () => readonly ["/api/anime"];
export declare const getListAnimeQueryOptions: <TData = Awaited<ReturnType<typeof listAnime>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAnime>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAnime>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAnimeQueryResult = NonNullable<Awaited<ReturnType<typeof listAnime>>>;
export type ListAnimeQueryError = ErrorType<unknown>;
/**
 * @summary List all supported anime
 */
export declare function useListAnime<TData = Awaited<ReturnType<typeof listAnime>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAnime>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetAnimeUrl: (id: number) => string;
/**
 * @summary Get anime by ID
 */
export declare const getAnime: (id: number, options?: RequestInit) => Promise<Anime>;
export declare const getGetAnimeQueryKey: (id: number) => readonly [`/api/anime/${number}`];
export declare const getGetAnimeQueryOptions: <TData = Awaited<ReturnType<typeof getAnime>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAnime>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAnime>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAnimeQueryResult = NonNullable<Awaited<ReturnType<typeof getAnime>>>;
export type GetAnimeQueryError = ErrorType<void>;
/**
 * @summary Get anime by ID
 */
export declare function useGetAnime<TData = Awaited<ReturnType<typeof getAnime>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAnime>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListCharactersUrl: (params?: ListCharactersParams) => string;
/**
 * @summary List characters, optionally filter by anime
 */
export declare const listCharacters: (params?: ListCharactersParams, options?: RequestInit) => Promise<Character[]>;
export declare const getListCharactersQueryKey: (params?: ListCharactersParams) => readonly ["/api/characters", ...ListCharactersParams[]];
export declare const getListCharactersQueryOptions: <TData = Awaited<ReturnType<typeof listCharacters>>, TError = ErrorType<unknown>>(params?: ListCharactersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCharacters>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCharacters>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCharactersQueryResult = NonNullable<Awaited<ReturnType<typeof listCharacters>>>;
export type ListCharactersQueryError = ErrorType<unknown>;
/**
 * @summary List characters, optionally filter by anime
 */
export declare function useListCharacters<TData = Awaited<ReturnType<typeof listCharacters>>, TError = ErrorType<unknown>>(params?: ListCharactersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCharacters>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCharacterUrl: (id: number) => string;
/**
 * @summary Get character by ID with full evidence
 */
export declare const getCharacter: (id: number, options?: RequestInit) => Promise<CharacterDetail>;
export declare const getGetCharacterQueryKey: (id: number) => readonly [`/api/characters/${number}`];
export declare const getGetCharacterQueryOptions: <TData = Awaited<ReturnType<typeof getCharacter>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCharacter>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCharacter>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCharacterQueryResult = NonNullable<Awaited<ReturnType<typeof getCharacter>>>;
export type GetCharacterQueryError = ErrorType<void>;
/**
 * @summary Get character by ID with full evidence
 */
export declare function useGetCharacter<TData = Awaited<ReturnType<typeof getCharacter>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCharacter>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAnalyzeBattleUrl: () => string;
/**
 * @summary Analyze battle between two characters using AI reasoning engine
 */
export declare const analyzeBattle: (battleRequest: BattleRequest, options?: RequestInit) => Promise<BattleAnalysis>;
export declare const getAnalyzeBattleMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeBattle>>, TError, {
        data: BodyType<BattleRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof analyzeBattle>>, TError, {
    data: BodyType<BattleRequest>;
}, TContext>;
export type AnalyzeBattleMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeBattle>>>;
export type AnalyzeBattleMutationBody = BodyType<BattleRequest>;
export type AnalyzeBattleMutationError = ErrorType<void>;
/**
* @summary Analyze battle between two characters using AI reasoning engine
*/
export declare const useAnalyzeBattle: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeBattle>>, TError, {
        data: BodyType<BattleRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof analyzeBattle>>, TError, {
    data: BodyType<BattleRequest>;
}, TContext>;
export declare const getListBattlesUrl: (params?: ListBattlesParams) => string;
/**
 * @summary Get recent battle analyses
 */
export declare const listBattles: (params?: ListBattlesParams, options?: RequestInit) => Promise<BattleSummary[]>;
export declare const getListBattlesQueryKey: (params?: ListBattlesParams) => readonly ["/api/battles/history", ...ListBattlesParams[]];
export declare const getListBattlesQueryOptions: <TData = Awaited<ReturnType<typeof listBattles>>, TError = ErrorType<unknown>>(params?: ListBattlesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBattles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBattles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBattlesQueryResult = NonNullable<Awaited<ReturnType<typeof listBattles>>>;
export type ListBattlesQueryError = ErrorType<unknown>;
/**
 * @summary Get recent battle analyses
 */
export declare function useListBattles<TData = Awaited<ReturnType<typeof listBattles>>, TError = ErrorType<unknown>>(params?: ListBattlesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBattles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetBattleUrl: (id: number) => string;
/**
 * @summary Get full battle analysis by ID
 */
export declare const getBattle: (id: number, options?: RequestInit) => Promise<BattleAnalysis>;
export declare const getGetBattleQueryKey: (id: number) => readonly [`/api/battles/${number}`];
export declare const getGetBattleQueryOptions: <TData = Awaited<ReturnType<typeof getBattle>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBattle>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBattle>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBattleQueryResult = NonNullable<Awaited<ReturnType<typeof getBattle>>>;
export type GetBattleQueryError = ErrorType<void>;
/**
 * @summary Get full battle analysis by ID
 */
export declare function useGetBattle<TData = Awaited<ReturnType<typeof getBattle>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBattle>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListEvidenceUrl: (params: ListEvidenceParams) => string;
/**
 * @summary List evidence for a character
 */
export declare const listEvidence: (params: ListEvidenceParams, options?: RequestInit) => Promise<Evidence[]>;
export declare const getListEvidenceQueryKey: (params?: ListEvidenceParams) => readonly ["/api/evidence", ...ListEvidenceParams[]];
export declare const getListEvidenceQueryOptions: <TData = Awaited<ReturnType<typeof listEvidence>>, TError = ErrorType<unknown>>(params: ListEvidenceParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEvidence>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listEvidence>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListEvidenceQueryResult = NonNullable<Awaited<ReturnType<typeof listEvidence>>>;
export type ListEvidenceQueryError = ErrorType<unknown>;
/**
 * @summary List evidence for a character
 */
export declare function useListEvidence<TData = Awaited<ReturnType<typeof listEvidence>>, TError = ErrorType<unknown>>(params: ListEvidenceParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEvidence>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStatsUrl: () => string;
/**
 * @summary Get app statistics overview
 */
export declare const getStats: (options?: RequestInit) => Promise<StatsOverview>;
export declare const getGetStatsQueryKey: () => readonly ["/api/stats/overview"];
export declare const getGetStatsQueryOptions: <TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStats>>>;
export type GetStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get app statistics overview
 */
export declare function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map
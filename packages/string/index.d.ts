/**
 * Replaces all occurrences of S in T with D
 * @example Replace<"foo bar", " ", "_"> // "foo_bar"
 */
export type Replace<T extends string, S extends string, D extends string, A extends string = ""> = T extends `${infer L}${S}${infer R}`
    ? Replace<R, S, D, `${A}${L}${D}`>
    : `${A}${T}`;

/**
 * Splits a string S by D
 * @example Split<"foo bar", " "> // ["foo", "bar"]
 */
type Split<S extends string, D extends string> = string extends S
    ? string[]
    : S extends ""
      ? []
      : S extends `${infer T}${D}${infer U}`
        ? [T, ...Split<U, D>]
        : [S];

/**
 * Parametrizes a string S with spaces by T
 * @example Parametrize<"{{foo}} bar {{baz}}", "{{", "}}"> // { foo: string, baz: string }
 */
export type Parametrize<S extends string, A extends string, B extends string = A> = Record<
    Extract<Split<S, " ">[number], `${string}${A}${string}${B}${string}`> extends `${string}${A}${infer K}${B}${string}` ? K : never,
    string
>;

/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 */
export type OverridableStringUnion<T extends string | number, U = Record<string, any>> = GenerateStringUnion<Overwrite<Record<T, true>, U>>;
type GenerateStringUnion<T> = Extract<
    {
        [Key in keyof T]: true extends T[Key] ? Key : never;
    }[keyof T],
    string
>;

/**
 * Converts a camelCase string to snake_case
 * @example CamelToSnakeCase<"fooBar"> // "foo_bar"
 */
export type CamelToSnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
    ? `${Head extends Uppercase<Head> ? "_" : ""}${Lowercase<Head>}${CamelToSnakeCase<Tail>}`
    : S;

/**
 * Converts a snake_case string to camelCase
 * @example SnakeToCamelCase<"foo_bar"> // "fooBar"
 */
export type SnakeToCamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamelCase<Tail>>}`
    : S;

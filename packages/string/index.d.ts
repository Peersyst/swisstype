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
 * Joins a string array T by S
 * @example Join<["foo", "bar"]> // "foobar"
 * @example Join<["foo", "bar"], " "> // "foo bar"
 */
type Join<T extends string[], S extends string = ""> = T extends [infer F, ...infer R]
    ? R["length"] extends 0
        ? `${F}`
        : `${F}${S}${Join<R, S>}`
    : "";

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
 */
export type CamelCaseToSnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
    ? `${Head extends Exclude<Uppercase<Head>, "_"> ? "_" : ""}${Lowercase<Head>}${CamelCaseToSnakeCase<Tail>}`
    : S;

/**
 * Splits a string into words by ` `, `-`, `_` and uppercase letters
 */
export type ToWords<S extends string> = Split<CamelCaseToSnakeCase<Replace<Replace<S, " ", "_">, "-", "_">>, "_">;

/**
 * Converts a string to PascalCase
 */
export type ToPascalCase<S extends string> =
    ToWords<S> extends [infer F, ...infer R]
        ? R["length"] extends 0
            ? Capitalize<F>
            : `${Capitalize<F>}${ToPascalCase<Join<R, "_">>}`
        : never;

/**
 * Converts a string to camelCase
 */
export type ToCamelCase<S extends string> = Uncapitalize<ToPascalCase<S>>;

/**
 * Converts a string to snake_case
 */
export type ToSnakeCase<S extends string> =
    ToWords<S> extends [infer F, ...infer R]
        ? R["length"] extends 0
            ? Lowercase<F>
            : `${Lowercase<F>}_${ToSnakeCase<Join<R, "_">>}`
        : never;

/**
 * Converts a string to kebab-case
 */
export type ToKebabCase<S extends string> =
    ToWords<S> extends [infer F, ...infer R]
        ? R["length"] extends 0
            ? Lowercase<F>
            : `${Lowercase<F>}-${ToKebabCase<Join<R, "_">>}`
        : never;

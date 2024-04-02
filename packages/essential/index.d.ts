/**
 * Any object
 */
export type AnyObject = Record<string | symbol | number, any>;

/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 */
export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

/**
 * Remove properties `K` from `T`.
 * Distributive for union types.
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

/**
 * Creates a type with common properties of A and B
 */
export type Common<A, B> = Pick<
    A,
    {
        [K in keyof A & keyof B]: A[K] extends B[K] ? (B[K] extends A[K] ? K : never) : never;
    }[keyof A & keyof B]
>;

/**
 * Creates a type with the difference between A and B
 */
export type Difference<A, B> = Omit<A, keyof B>;

/**
 * Makes all properties, included nested ones, partial
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes all properties, included nested ones, partial. Except those of type K
 */
export type DeepPartialExcept<T, K extends keyof T> = DeepPartial<T> & Pick<T, K>;

/**
 * Makes properties of type K required
 */
export type Demand<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Makes properties of type K optional
 */
export type Loosen<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes properties of type K optional deeply
 */
export type LoosenDeeply<T, K extends keyof T> = Omit<T, K> & DeepPartial<Pick<T, K>>;

/**
 * Get all keys with type T from O
 */
export type TypeKeys<O, T> = {
    [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];

/**
 * Removes properties of type T from O
 */
export type OmitType<O, T> = Omit<O, TypeKeys<O, T>>;

/**
 * Gets all keys with type undefined of T
 */
export type UndefinedKeys<T> = TypeKeys<T, undefined>;

/**
 * Removes properties of type undefined from T
 */
export type Defined<T> = OmitType<T, undefined>;

/**
 * All possible iterations for a recursive type
 */
type MaxRecursiveIterations = 10;
// prettier-ignore
type Iterations = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Get nested keys from T in the form of key1.key2...
 */
export type NestedKeys<T extends object> = CoreNestedKeys<T>;
type CoreNestedKeys<T extends object, I extends number = MaxRecursiveIterations> = I extends 0
    ? never
    : {
          [Key in keyof T]: T[Key] extends object
              ? T[Key] extends any[]
                  ? Key
                  : `${Key}` | `${Key}.${CoreNestedKeys<T[Key], Iterations[I]>}`
              : Key;
      }[Extract<keyof T, string>];

/**
 * Get nested keys from T in the form of key1.key2...
 */
export type FlattenedNestedKeys<T extends object> = FlattenedCoreNestedKeys<T>;
type FlattenedCoreNestedKeys<T extends object, I extends number = MaxRecursiveIterations> = I extends 0
    ? never
    : {
          [Key in keyof T]: T[Key] extends object ? (T[Key] extends any[] ? Key : `${Key}.${CoreNestedKeys<T[Key], Iterations[I]>}`) : Key;
      }[Extract<keyof T, string>];

/**
 * Pick K types from T with keys in the form of key1.key2...
 */
export type DeepPick<T extends object, K extends NestedKeys<T>> = CoreDeepPick<T, K>;
type CoreDeepPick<T extends object, K extends string, I extends number = MaxRecursiveIterations> = I extends 0
    ? never
    : K extends `${infer FirstKey}.${infer RestKey}`
      ? CoreDeepPick<T[FirstKey], RestKey, Iterations[I]>
      : T[K];

/**
 * Overrides type T with O
 */
export type Override<T extends AnyObject, O extends AnyObject> = {
    [K in keyof T]: K extends keyof O ? O[K] : T[K];
};

/**
 * Deeply overrides type T with O
 */
export type DeepOverride<T extends AnyObject, O extends AnyObject> = CoreDeepOverride<T, O>;
type CoreDeepOverride<T extends AnyObject, O extends AnyObject, I extends number = MaxRecursiveIterations> = I extends 0
    ? never
    : Override<
          {
              [K in keyof T]: T[K] extends AnyObject | undefined ? DeepOverride<T[K], O> : T[K];
          },
          O
      >;

/**
 * Injects type O into type T
 */
export type Inject<T extends AnyObject, O extends AnyObject> = T & O;

/**
 * Deeply injects type O into type T
 */
export type DeepInject<T extends AnyObject, O extends AnyObject> = CoreDeepInject<T, O>;
type CoreDeepInject<T extends AnyObject, O extends AnyObject, I extends number = MaxRecursiveIterations> = I extends 0
    ? never
    : Inject<
          {
              [K in keyof T]: T[K] extends AnyObject | undefined ? DeepInject<T[K], O> : T[K];
          },
          O
      >;

/**
 * Unites all types from U.
 * @example Unite<{ a: string } | { b: number }> = { a: string } & { b: number }
 */
export type Unite<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * Omit required properties from T
 */
export type OmitRequired<T extends AnyObject> = {
    [K in keyof T as Pick<T, K> extends Pick<Required<T>, K> ? never : K]: T[K];
};

/**
 * Omit optional properties from T
 */
export type OmitOptional<T> = {
    [K in keyof T as Pick<T, K> extends Pick<Required<T>, K> ? K : never]: T[K];
};

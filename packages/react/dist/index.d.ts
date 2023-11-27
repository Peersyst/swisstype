import { ReactElement } from "react";

/**
 * A react child
 */
export type ReactChild = ReactElement | string | number;

/**
 * An updater
 */
export type Updater<T> = T | ((old: T) => T);
/**
 * An updater function
 */
export type UpdaterFn<T> = (updaterOrValue: Updater<T>) => void;

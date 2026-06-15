export {};

declare module 'react' {
  interface HTMLAttributes<T> {
    /**
     * Removes element and all descendants from tab order and assistive technologies.
     * Use empty string `''` to activate; `undefined` to deactivate.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert
     */
    inert?: '' | undefined;
  }
}

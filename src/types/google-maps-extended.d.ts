declare namespace JSX {
  interface IntrinsicElements {
    "gmpx-place-autocomplete": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      placeholder?: string;
      countries?: string;
      class?: string;
      id?: string;
    };
  }
}

import React, { useMemo } from 'react';
import katex from 'katex';

export default function KatexMath({ math, block = false }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false
      });
    } catch (e) {
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={block ? "block my-2 overflow-x-auto text-center py-1" : "inline-block px-1"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

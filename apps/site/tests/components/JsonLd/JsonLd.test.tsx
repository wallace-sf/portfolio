import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonLd } from '~components/JsonLd';

describe('JsonLd', () => {
  it('should render a script tag with type application/ld+json', () => {
    const { container } = render(<JsonLd data={{ '@type': 'Person' }} />);

    const script = container.querySelector('script');
    expect(script).not.toBeNull();
    expect(script?.getAttribute('type')).toBe('application/ld+json');
  });

  it('should serialize the data object to a JSON string', () => {
    const { container } = render(
      <JsonLd data={{ name: 'Wallace Ferreira' }} />,
    );

    const script = container.querySelector('script');
    expect(script?.innerHTML).toContain('"name":"Wallace Ferreira"');
  });

  it('should escape "<" characters to prevent script-tag breakout', () => {
    const { container } = render(
      <JsonLd data={{ description: '</script><script>alert(1)</script>' }} />,
    );

    const script = container.querySelector('script');
    expect(script?.innerHTML).not.toContain('</script><script>');
    expect(script?.innerHTML).toContain('\\u003c/script>');
  });
});

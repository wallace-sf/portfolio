interface JsonLdProps {
  data: object;
}

export function JsonLd({ data }: JsonLdProps) {
  const html = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

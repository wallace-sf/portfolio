import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

const SIZE = { width: 1200, height: 630 };

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'Wallace Ferreira';
  const subtitle = searchParams.get('subtitle') ?? '';
  const tag = searchParams.get('tag') ?? 'React • Next.js • TypeScript';
  const locale = searchParams.get('locale') ?? 'en-US';
  const page = searchParams.get('page') ?? '';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background:
          'linear-gradient(135deg, #070B12 0%, #0E1622 60%, #10251C 100%)',
        color: '#F8FAFC',
        padding: 72,
        fontFamily: 'Arial',
        position: 'relative',
      }}
    >
      {/* Watermark W */}
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: 80,
          fontSize: 420,
          fontWeight: 800,
          color: 'rgba(92, 214, 110, 0.10)',
          lineHeight: 1,
          display: 'flex',
        }}
      >
        W
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
              color: '#5CD66E',
              display: 'flex',
            }}
          >
            W
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 28, fontWeight: 600, display: 'flex' }}>
              Wallace Ferreira
            </div>
            <div style={{ fontSize: 22, color: '#94A3B8', display: 'flex' }}>
              Front-end Software Engineer
            </div>
          </div>
        </div>
        {locale && (
          <div
            style={{
              background: '#5CD66E',
              color: '#070B12',
              borderRadius: 999,
              padding: '10px 22px',
              fontSize: 22,
              fontWeight: 800,
              display: 'flex',
            }}
          >
            {locale}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: title.length > 20 ? 64 : 76,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            maxWidth: 760,
            lineHeight: 1.05,
            display: 'flex',
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 150,
            height: 6,
            background: '#5CD66E',
            borderRadius: 999,
            marginTop: 24,
            marginBottom: 32,
            display: 'flex',
          }}
        />
        {subtitle && (
          <div
            style={{
              fontSize: 30,
              color: '#CBD5E1',
              maxWidth: 760,
              lineHeight: 1.3,
              display: 'flex',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              border: '1px solid rgba(92, 214, 110, 0.7)',
              color: '#5CD66E',
              borderRadius: 999,
              padding: '12px 24px',
              fontSize: 24,
              fontWeight: 700,
              display: 'flex',
            }}
          >
            {tag}
          </div>
          <div style={{ fontSize: 18, color: '#475569', display: 'flex' }}>
            portfolio-web-kohl-two.vercel.app
          </div>
        </div>
        {page && (
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'rgba(92, 214, 110, 0.5)',
              letterSpacing: '0.1em',
              display: 'flex',
            }}
          >
            {page}
          </div>
        )}
      </div>
    </div>,
    SIZE,
  );
}

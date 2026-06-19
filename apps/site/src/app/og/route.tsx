import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'Wallace Ferreira';
  const description = searchParams.get('description') ?? '';
  const imageUrl = searchParams.get('image') ?? '';

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#1C1C1C',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 8,
          height: '100%',
          backgroundColor: '#8efb9d',
        }}
      />

      {/* Decorative circle — top-right (only when no image) */}
      {!imageUrl && (
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: '50%',
            backgroundColor: '#4452ff',
            opacity: 0.12,
          }}
        />
      )}

      {/* Profile image — right side */}
      {imageUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 420,
            height: '100%',
            display: 'flex',
          }}
        >
          {/* Gradient overlay so text stays readable */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 160,
              height: '100%',
              background:
                'linear-gradient(to right, #1C1C1C 0%, transparent 100%)',
              zIndex: 1,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          width: imageUrl ? 780 : '100%',
          height: '100%',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#8efb9d',
            }}
          />
          <span
            style={{
              color: '#8efb9d',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Wallace Ferreira
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              color: '#d9d9d9',
              fontSize: title.length > 40 ? 52 : 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: imageUrl ? 680 : 900,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                color: '#8d8d8d',
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: imageUrl ? 640 : 820,
              }}
            >
              {description}
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
          <span style={{ color: '#494949', fontSize: 18 }}>
            {SITE_URL.replace(/^https?:\/\//, '')}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#282828',
              borderRadius: 12,
              padding: '10px 20px',
            }}
          >
            <span style={{ color: '#a4a4a4', fontSize: 16 }}>
              Software Engineer
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}

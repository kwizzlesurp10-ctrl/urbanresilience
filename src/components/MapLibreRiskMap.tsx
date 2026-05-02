'use client';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';

/**
 * Default tile style — OpenFreeMap dark vector, free, no API key required.
 * Automatically overridden when NEXT_PUBLIC_MAPBOX_TOKEN is set:
 *   => uses Mapbox Streets v12 via the MapLibre-compatible endpoint.
 * Can also be overridden directly via NEXT_PUBLIC_MAP_STYLE_URL.
 * @see https://openfreemap.org/quick_start
 * @see https://docs.mapbox.com/api/maps/styles/
 */
export const DEFAULT_MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

/**
 * Mapbox style slug to use when a Mapbox token is present.
 * Swap to 'mapbox://styles/mapbox/satellite-streets-v12' etc. as needed.
 */
const MAPBOX_DEFAULT_STYLE = 'mapbox://styles/mapbox/dark-v11';

export type MapLibreRiskMapProps = {
  className?: string;
  centerLng?: number;
  centerLat?: number;
  initialZoom?: number;
};

/**
 * Priority order for the map style URL:
 *  1. NEXT_PUBLIC_MAP_STYLE_URL  — explicit full URL override
 *  2. NEXT_PUBLIC_MAPBOX_TOKEN   — auto-builds Mapbox style URL + injects token
 *  3. DEFAULT_MAP_STYLE_URL      — OpenFreeMap dark fallback (no key needed)
 */
function resolveStyleUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim();
  if (explicit && explicit.length > 0) return explicit;

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
  if (mapboxToken && mapboxToken.length > 0) {
    // MapLibre GL JS supports Mapbox styles natively when the token is
    // supplied via the transformRequest callback set below.
    return MAPBOX_DEFAULT_STYLE;
  }

  return DEFAULT_MAP_STYLE_URL;
}

/**
 * Returns a MapLibre transformRequest function that injects the Mapbox
 * access token into every request destined for Mapbox APIs/CDN.
 * Returns undefined when no Mapbox token is configured (no-op path).
 */
function buildTransformRequest(
  token: string | undefined,
): maplibregl.RequestTransformFunction | undefined {
  if (!token) return undefined;
  return (url: string, resourceType: maplibregl.ResourceType | undefined) => {
    // Inject token for all Mapbox tile, sprite, glyph and style endpoints
    if (
      resourceType === 'Tile' ||
      resourceType === 'Glyphs' ||
      resourceType === 'Source' ||
      resourceType === 'SpriteImage' ||
      resourceType === 'SpriteJSON' ||
      resourceType === 'Style'
    ) {
      const separator = url.includes('?') ? '&' : '?';
      return { url: `${url}${separator}access_token=${token}` };
    }
    return { url };
  };
}

function buildRiskFeatures(centerLng: number, centerLat: number) {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { intensity: 0.85 },
        geometry: { type: 'Point' as const, coordinates: [centerLng - 0.04, centerLat + 0.02] },
      },
      {
        type: 'Feature' as const,
        properties: { intensity: 0.55 },
        geometry: { type: 'Point' as const, coordinates: [centerLng + 0.05, centerLat - 0.03] },
      },
      {
        type: 'Feature' as const,
        properties: { intensity: 0.7 },
        geometry: { type: 'Point' as const, coordinates: [centerLng, centerLat + 0.04] },
      },
      {
        type: 'Feature' as const,
        properties: { intensity: 0.35 },
        geometry: { type: 'Point' as const, coordinates: [centerLng + 0.02, centerLat - 0.01] },
      },
    ],
  };
}

export function MapLibreRiskMap({
  className,
  centerLng = -80.1918,
  centerLat = 25.7617,
  initialZoom = 10.5,
}: MapLibreRiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const styleUrl = resolveStyleUrl();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() || undefined;
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    queueMicrotask(() => setMapError(null));
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const transformRequest = buildTransformRequest(mapboxToken);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [centerLng, centerLat],
      zoom: initialZoom,
      pitch: reduceMotion ? 0 : 42,
      bearing: reduceMotion ? 0 : -18,
      maxPitch: 72,
      attributionControl: { compact: true },
      ...(transformRequest ? { transformRequest } : {}),
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'imperial' }), 'bottom-left');
    mapRef.current = map;

    const onError = (e: { error?: Error }) => {
      const msg = e.error?.message ?? 'Map failed to load.';
      setMapError(msg);
    };
    map.on('error', onError);

    map.on('load', () => {
      // ── Risk heatmap (inline GeoJSON) ──────────────────────────────────────
      map.addSource('risk-heatmap', {
        type: 'geojson',
        data: buildRiskFeatures(centerLng, centerLat),
      });
      map.addLayer({
        id: 'risk-heat',
        type: 'heatmap',
        source: 'risk-heatmap',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 8, 1.0, 14, 2.4],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 8, 28, 14, 52],
          'heatmap-opacity': 0.72,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,    'rgba(16, 204, 247, 0)',
            0.25, 'rgba(16, 204, 247, 0.35)',
            0.45, 'rgba(140, 248, 219, 0.55)',
            0.65, 'rgba(253, 186, 120, 0.75)',
            0.85, 'rgba(239, 68, 68, 0.9)',
            1,    'rgba(185, 28, 28, 0.95)',
          ],
        },
      });

      // ── Carbon footprint heatmap (public/data/carbon-footprint.geojson) ───
      // Served from public/ — resolves to /data/carbon-footprint.geojson
      // in both local dev and Vercel production.
      map.addSource('carbon-data', {
        type: 'geojson',
        data: process.env.NEXT_PUBLIC_CARBON_DATA_URL || '/data/carbon-footprint.geojson',
      });
      map.addLayer({
        id: 'carbon-heatmap',
        type: 'heatmap',
        source: 'carbon-data',
        paint: {
          'heatmap-weight': ['get', 'carbon_footprint'],
          'heatmap-radius': 20,
          'heatmap-intensity': 1,
          'heatmap-opacity': 0.85,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,   'rgba(33, 102, 172, 0)',
            0.2, 'rgb(103, 169, 207)',
            0.4, 'rgb(209, 229, 240)',
            0.6, 'rgb(253, 219, 199)',
            0.8, 'rgb(239, 138, 98)',
            1,   'rgb(178, 24, 43)',
          ],
        },
      });
    });

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => { map.resize(); })
        : null;
    ro?.observe(containerRef.current);

    return () => {
      ro?.disconnect();
      map.off('error', onError);
      map.remove();
      mapRef.current = null;
    };
  }, [centerLng, centerLat, initialZoom, styleUrl, mapboxToken]);

  return (
    <div className={cn('relative h-full w-full', className)}>
      {mapError ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80 p-6 text-center">
          <p className="font-semibold text-destructive">Could not load the map</p>
          <p className="text-sm text-muted-foreground">{mapError}</p>
          <p className="text-xs text-muted-foreground">
            Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> for Mapbox tiles, or{' '}
            <code>NEXT_PUBLIC_MAP_STYLE_URL</code> for a custom MapLibre style.
          </p>
        </div>
      ) : null}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

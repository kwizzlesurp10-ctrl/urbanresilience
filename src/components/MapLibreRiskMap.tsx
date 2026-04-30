'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';

/**
 * OpenFreeMap dark vector style — free, MapLibre-native, no API key.
 * @see https://openfreemap.org/quick_start
 */
export const DEFAULT_MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

export type MapLibreRiskMapProps = {
  className?: string;
  centerLng?: number;
  centerLat?: number;
  initialZoom?: number;
};

function resolveStyleUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_MAP_STYLE_URL;
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
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    queueMicrotask(() => setMapError(null));

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [centerLng, centerLat],
      zoom: initialZoom,
      pitch: reduceMotion ? 0 : 42,
      bearing: reduceMotion ? 0 : -18,
      maxPitch: 72,
      attributionControl: { compact: true },
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
            0,
            'rgba(16, 204, 247, 0)',
            0.25,
            'rgba(16, 204, 247, 0.35)',
            0.45,
            'rgba(140, 248, 219, 0.55)',
            0.65,
            'rgba(253, 186, 120, 0.75)',
            0.85,
            'rgba(239, 68, 68, 0.9)',
            1,
            'rgba(185, 28, 28, 0.95)',
          ],
        },
      });
    });

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            map.resize();
          })
        : null;
    ro?.observe(containerRef.current);

    return () => {
      ro?.disconnect();
      map.off('error', onError);
      map.remove();
      mapRef.current = null;
    };
  }, [centerLng, centerLat, initialZoom, styleUrl]);

  return (
    <div className={cn('relative h-full min-h-[320px] w-full', className)}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden rounded-[inherit]" />
      {mapError ? (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-background/90 px-6 text-center text-sm text-muted-foreground backdrop-blur-sm"
          role="alert"
        >
          <p className="font-medium text-foreground">Could not load the map</p>
          <p className="max-w-sm text-xs leading-relaxed">{mapError}</p>
          <p className="text-xs opacity-80">
            Set <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_MAP_STYLE_URL</code> to a valid
            MapLibre style JSON if this persists.
          </p>
        </div>
      ) : null}
    </div>
  );
}

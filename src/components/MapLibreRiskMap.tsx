'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';

/** MapLibre Style JSON URL — defaults to MapLibre demo vector tiles (no API key). */
export const DEFAULT_MAP_STYLE_URL = 'https://demotiles.maplibre.org/style.json';

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

export function MapLibreRiskMap({
  className,
  centerLng = -80.1918,
  centerLat = 25.7617,
  initialZoom = 10.5,
}: MapLibreRiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const styleUrl = resolveStyleUrl();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [centerLng, centerLat],
      zoom: initialZoom,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      map.addSource('risk-heatmap', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { intensity: 0.85 },
              geometry: {
                type: 'Point',
                coordinates: [centerLng - 0.04, centerLat + 0.02],
              },
            },
            {
              type: 'Feature',
              properties: { intensity: 0.55 },
              geometry: {
                type: 'Point',
                coordinates: [centerLng + 0.05, centerLat - 0.03],
              },
            },
            {
              type: 'Feature',
              properties: { intensity: 0.7 },
              geometry: {
                type: 'Point',
                coordinates: [centerLng, centerLat + 0.04],
              },
            },
          ],
        },
      });

      map.addLayer({
        id: 'risk-heat',
        type: 'heatmap',
        source: 'risk-heatmap',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1.2,
          'heatmap-radius': 45,
          'heatmap-opacity': 0.65,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.3,
            'rgb(103,169,207)',
            0.6,
            'rgb(209,229,240)',
            0.8,
            'rgb(253,219,199)',
            1,
            'rgb(178,24,43)',
          ],
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [centerLng, centerLat, initialZoom, styleUrl]);

  return <div ref={containerRef} className={cn('h-full min-h-[320px] w-full', className)} />;
}

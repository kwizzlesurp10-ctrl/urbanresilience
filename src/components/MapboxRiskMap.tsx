'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

export type MapboxRiskMapProps = {
  className?: string;
  centerLng?: number;
  centerLat?: number;
  initialZoom?: number;
};

export function MapboxRiskMap({
  className,
  centerLng = -80.1918,
  centerLat = 25.7617,
  initialZoom = 10.5,
}: MapboxRiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!containerRef.current || !token) {
      return;
    }

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [centerLng, centerLat],
      zoom: initialZoom,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
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
  }, [centerLng, centerLat, initialZoom]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div
        className={cn(
          'flex h-full min-h-[320px] w-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/40 p-6 text-center text-sm text-muted-foreground',
          className
        )}
      >
        Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the live risk map.
      </div>
    );
  }

  return <div ref={containerRef} className={cn('h-full min-h-[320px] w-full', className)} />;
}

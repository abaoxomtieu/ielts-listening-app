'use client';

import React, { useRef, useState, useCallback } from 'react';
import type { ImageHotspot, QuestionImage } from '@/types';

interface Props {
  image: QuestionImage;
  onHotspotsChange: (hotspots: ImageHotspot[]) => void;
  disabled?: boolean;
}

export default function ImageWithHotspotsEditor({ image, onHotspotsChange, disabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hotspots = image.hotspots ?? [];
  const imgW = image.width ?? 1;
  const imgH = image.height ?? 1;

  const displayToImageCoords = useCallback(
    (displayX: number, displayY: number) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const scaleX = imgW / rect.width;
      const scaleY = imgH / rect.height;
      const x = Math.round((displayX - rect.left) * scaleX);
      const y = Math.round((displayY - rect.top) * scaleY);
      return {
        x: Math.max(0, Math.min(imgW, x)),
        y: Math.max(0, Math.min(imgH, y))
      };
    },
    [imgW, imgH]
  );

  const handleHotspotMouseDown = (e: React.MouseEvent, id: number) => {
    if (disabled) return;
    if (e.detail === 2) {
      e.preventDefault();
      const h = hotspots.find((x) => x.id === id);
      const raw = h ? h.label : String(id);
      setEditingValue(raw.slice(0, 3));
      setEditingId(id);
      return;
    }
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const hotspot = hotspots.find((h) => h.id === id);
    if (!hotspot) return;
    const scaleX = rect.width / imgW;
    const scaleY = rect.height / imgH;
    const nodeCenterX = rect.left + hotspot.x * scaleX;
    const nodeCenterY = rect.top + hotspot.y * scaleY;
    setDragOffset({ x: e.clientX - nodeCenterX, y: e.clientY - nodeCenterY });
    setDraggingId(id);
  };

  const handleLabelChange = (id: number, value: string) => {
    onHotspotsChange(
      hotspots.map((h) => (h.id === id ? { ...h, label: value || String(id) } : h))
    );
  };

  const MAX_LABEL_LENGTH = 3;

  const finishEditing = (id: number) => {
    const value = (editingValue.trim() || String(id)).slice(0, MAX_LABEL_LENGTH) || String(id).slice(0, MAX_LABEL_LENGTH);
    handleLabelChange(id, value);
    setEditingId(null);
  };

  React.useEffect(() => {
    if (draggingId === null) return;

    const onMove = (e: MouseEvent) => {
      const centerX = e.clientX - dragOffset.x;
      const centerY = e.clientY - dragOffset.y;
      const { x, y } = displayToImageCoords(centerX, centerY);
      onHotspotsChange(
        hotspots.map((h) => (h.id === draggingId ? { ...h, x, y } : h))
      );
    };

    const onUp = () => setDraggingId(null);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [draggingId, dragOffset, displayToImageCoords, hotspots, onHotspotsChange]);

  if (!image.url) return null;

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative inline-block max-w-full overflow-hidden rounded border border-gray-300 bg-gray-100"
        style={{ maxWidth: 600 }}
      >
        <img
          src={image.url}
          alt={image.altText || 'Uploaded'}
          className="block max-h-[400px] w-auto object-contain"
          style={{ maxWidth: '100%' }}
          draggable={false}
        />
        {hotspots.map((hotspot) => {
          const leftPct = imgW ? (hotspot.x / imgW) * 100 : 0;
          const topPct = imgH ? (hotspot.y / imgH) * 100 : 0;
          const isEditing = editingId === hotspot.id;
          return (
            <div
              key={hotspot.id}
              className={`absolute cursor-grab active:cursor-grabbing flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-md border-2 border-white transition-[width,height,min-width,min-height] ${
                isEditing
                  ? 'min-w-[56px] min-h-[56px] w-14 h-14 text-base'
                  : 'min-w-[32px] min-h-[32px] max-w-[48px] text-sm'
              }`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseDown={(e) => handleHotspotMouseDown(e, hotspot.id)}
              title={`${hotspot.label} – drag to move, double-click to edit (max 3 chars)`}
            >
              {isEditing ? (
                <input
                  ref={(el) => {
                    inputRef.current = el;
                    if (el) {
                      el.focus();
                      el.select();
                    }
                  }}
                  type="text"
                  maxLength={MAX_LABEL_LENGTH}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value.slice(0, MAX_LABEL_LENGTH))}
                  onBlur={() => finishEditing(hotspot.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                    e.stopPropagation();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-full min-w-0 max-w-[52px] h-8 px-1 rounded bg-white text-blue-700 text-center text-sm font-bold border-0 outline-none"
                />
              ) : (
                <span className="truncate px-1 max-w-full" title={hotspot.label}>{hotspot.label}</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        Image size: {imgW}×{imgH} px. Drag nodes to move. Double-click node to edit label.
      </p>
    </div>
  );
}

import type { TooltipPosition } from "./tooltip.types";

const VIEWPORT_PADDING = 8;
const TOOLTIP_OFFSET = 10;

export type TooltipCoords = {
  top: number;
  left: number;
  placement: TooltipPosition;
};

type ResolveTooltipPositionParams = {
  preferred: TooltipPosition;
  anchorRect: DOMRect;
  tooltipRect: DOMRect;
  viewportPadding?: number;
  offset?: number;
};

const FLIP_ORDER: Record<TooltipPosition, TooltipPosition[]> = {
  top: ["bottom", "right", "left"],
  bottom: ["top", "right", "left"],
  left: ["right", "bottom", "top"],
  right: ["left", "bottom", "top"],
};

function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getCoordsForPlacement(
  placement: TooltipPosition,
  anchorRect: DOMRect,
  tooltipRect: DOMRect,
  offset: number,
): Pick<TooltipCoords, "top" | "left"> {
  switch (placement) {
    case "top":
      return {
        top: anchorRect.top - tooltipRect.height - offset,
        left: anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2,
      };
    case "bottom":
      return {
        top: anchorRect.bottom + offset,
        left: anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2,
      };
    case "left":
      return {
        top: anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2,
        left: anchorRect.left - tooltipRect.width - offset,
      };
    case "right":
      return {
        top: anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2,
        left: anchorRect.right + offset,
      };
  }
}

function clampToViewport(
  top: number,
  left: number,
  tooltipRect: DOMRect,
  padding: number,
) {
  const { width: viewportWidth, height: viewportHeight } = getViewportSize();

  return {
    top: Math.min(
      Math.max(padding, top),
      viewportHeight - tooltipRect.height - padding,
    ),
    left: Math.min(
      Math.max(padding, left),
      viewportWidth - tooltipRect.width - padding,
    ),
  };
}

function fitsInViewport(
  top: number,
  left: number,
  tooltipRect: DOMRect,
  padding: number,
) {
  const { width: viewportWidth, height: viewportHeight } = getViewportSize();

  return (
    top >= padding &&
    left >= padding &&
    top + tooltipRect.height <= viewportHeight - padding &&
    left + tooltipRect.width <= viewportWidth - padding
  );
}

export function resolveTooltipPosition({
  preferred,
  anchorRect,
  tooltipRect,
  viewportPadding = VIEWPORT_PADDING,
  offset = TOOLTIP_OFFSET,
}: ResolveTooltipPositionParams): TooltipCoords {
  const candidates = [preferred, ...FLIP_ORDER[preferred]];

  for (const placement of candidates) {
    const coords = getCoordsForPlacement(
      placement,
      anchorRect,
      tooltipRect,
      offset,
    );

    if (
      fitsInViewport(coords.top, coords.left, tooltipRect, viewportPadding)
    ) {
      return { ...coords, placement };
    }
  }

  const fallbackCoords = getCoordsForPlacement(
    preferred,
    anchorRect,
    tooltipRect,
    offset,
  );
  const clamped = clampToViewport(
    fallbackCoords.top,
    fallbackCoords.left,
    tooltipRect,
    viewportPadding,
  );

  return {
    ...clamped,
    placement: preferred,
  };
}

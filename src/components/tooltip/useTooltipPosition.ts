import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { resolveTooltipPosition } from "./calculateTooltipPosition";
import type { TooltipCoords } from "./calculateTooltipPosition";
import type { TooltipPosition } from "./tooltip.types";

const SHOW_DELAY_MS = 350;

type UseTooltipPositionOptions = {
  preferred: TooltipPosition;
  enabled: boolean;
};

type UseTooltipPositionResult = {
  anchorRef: RefObject<HTMLSpanElement | null>;
  tooltipRef: RefObject<HTMLSpanElement | null>;
  isVisible: boolean;
  isPositioned: boolean;
  coords: TooltipCoords;
  show: () => void;
  hide: () => void;
};

const INITIAL_COORDS: TooltipCoords = {
  top: 0,
  left: 0,
  placement: "top",
};

export function useTooltipPosition({
  preferred,
  enabled,
}: UseTooltipPositionOptions): UseTooltipPositionResult {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const showTimeoutRef = useRef<number | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords>({
    ...INITIAL_COORDS,
    placement: preferred,
  });

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const tooltip = tooltipRef.current;
    if (!anchor || !tooltip) return;

    const nextCoords = resolveTooltipPosition({
      preferred,
      anchorRect: anchor.getBoundingClientRect(),
      tooltipRect: tooltip.getBoundingClientRect(),
    });

    setCoords(nextCoords);
    setIsPositioned(true);
  }, [preferred]);

  const show = useCallback(() => {
    if (!enabled) return;

    window.clearTimeout(showTimeoutRef.current);
    showTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY_MS);
  }, [enabled]);

  const hide = useCallback(() => {
    window.clearTimeout(showTimeoutRef.current);
    setIsVisible(false);
    setIsPositioned(false);
  }, []);

  useLayoutEffect(() => {
    if (!isVisible) return;
    updatePosition();
  }, [isVisible, updatePosition]);

  useEffect(() => {
    if (!isVisible) return;

    const handleViewportChange = () => updatePosition();

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isVisible, updatePosition]);

  useEffect(
    () => () => {
      window.clearTimeout(showTimeoutRef.current);
    },
    [],
  );

  return {
    anchorRef,
    tooltipRef,
    isVisible,
    isPositioned,
    coords,
    show,
    hide,
  };
}

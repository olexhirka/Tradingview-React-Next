import { differenceInDays } from "date-fns";
import { isSameDay } from "date-fns/fp";
import { difference } from "ramda";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { findClosestIndexByX } from "../../../utils/data.utils";
import { usePointerGet } from "../context/pointer.context";
import { useRangeGet } from "../context/range.context";

export const usePointSync = (key: string, chart?: Highcharts.Chart) => {
  const { event, x } = usePointerGet(key) || {};
  const [dx] = useDebounce(x, 10);
  useEffect(() => {
    if (event && chart && dx) {
      const points = chart?.series
        ?.map(
          (v) =>
            v?.points?.find(
              (v) =>
                isSameDay(v?.x, dx) || Math.abs(differenceInDays(v?.x, dx)) < 2
            )! || null
        )
        .filter((v) => v);

      const point = points?.[0];

      if (point) {
        point?.series?.yAxis?.drawCrosshair?.(event, point);
        point?.series?.xAxis?.drawCrosshair?.(event, point);
        point?.setState?.("hover");

        chart?.tooltip?.refresh?.(points);
      }
      // if (points?.length > 1) {
      //   points?.forEach((v, idx) => v.graphic?.translate(0, idx * 10));
      // }
      return () => {
        points?.forEach((v) => v?.setState?.("normal"));
        chart?.tooltip?.hide(2);
        // if (points?.length > 1) {
        //   points?.forEach((v, ) => v.graphic?.translate(0, 0));
        // }
      };
    }
  }, [event, chart, dx]);
};

export const useRangeSync = (key: string, chart?: Highcharts.Chart) => {
  const range = useRangeGet(key);
  useEffect(() => {
    if (range && chart) {
      chart?.xAxis[0]?.setExtremes?.(range.min, range.max, undefined, false, {
        trigger: "sync",
      });
    }
  }, [range, chart]);
};

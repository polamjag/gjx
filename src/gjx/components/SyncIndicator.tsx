import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { realtimeSyncMetaState } from "../atoms";

export const SyncIndicator: React.FC<{}> = () => {
  const [lastGot, setLastGot] = useState<number>(0);
  const syncMeta = useRecoilValue(realtimeSyncMetaState);
  const [indicatorOpacity, setIndicatorOpacity] = useState<number>(0);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      if (lastGot !== syncMeta.lastGotEpoch) {
        setLastGot(syncMeta.lastGotEpoch);
        setIndicatorOpacity(1);
      } else if (indicatorOpacity > 0.001) {
        setIndicatorOpacity(indicatorOpacity * 0.91);
      }
    });
    return () => window.cancelAnimationFrame(id);
  });

  return (
    <div className="sync-indicator" style={{ opacity: indicatorOpacity }}></div>
  );
};

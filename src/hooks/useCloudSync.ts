import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface CloudData {
  petStatus: any;
  purchasedItems: string[];
  streak: number;
  lastStudyDate: string | null;
  studyPlan: any;
  studyLogs: any[];
  distractApps: string[];
}

/**
 * Loads the signed-in user's saved data from Firestore once, and hands it
 * back via onLoad so the caller can hydrate its React state. Returns
 * `ready: true` once the load attempt (success or "no doc yet") completes,
 * so the caller can avoid saving before the initial load finishes (which
 * would otherwise overwrite cloud data with fresh-session defaults).
 */
export function useCloudLoad(uid: string | undefined, onLoad: (data: Partial<CloudData>) => void) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    if (!uid) return;

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (!cancelled && snap.exists()) {
          onLoad(snap.data() as Partial<CloudData>);
        }
      } catch (err) {
        console.error('Failed to load cloud data:', err);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return ready;
}

/**
 * Debounced save of the given data to Firestore under users/{uid}.
 * Pass `enabled=false` until the initial cloud load has completed.
 */
export function useCloudSave(uid: string | undefined, data: CloudData, enabled: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serialized = JSON.stringify(data);

  useEffect(() => {
    if (!uid || !enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setDoc(doc(db, 'users', uid), JSON.parse(serialized), { merge: true }).catch((err) => {
        console.error('Failed to save cloud data:', err);
      });
    }, 1200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, enabled, serialized]);
}

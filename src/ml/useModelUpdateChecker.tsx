/**
 * Component that runs once on mount and silently checks for a new model.
 * If a new version is installed, optionally surface a toast (gated by the
 * user's "Model updates" notification preference).
 *
 * Mount this once at root (inside Toast + Redux providers).
 */

import { useEffect, useRef } from 'react';

import { useAppSelector } from '@/store/hooks';
import { selectSettings } from '@/store/slices/settingsSlice';
import { useToast } from '@/ui/Toast';

import { checkAndUpdate } from './modelManager';
import { invalidateModelCache } from './tfliteModel';

export function ModelUpdateChecker() {
  const settings = useAppSelector(selectSettings);
  const toast = useToast();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const result = await checkAndUpdate();
      if (result.kind === 'update-installed') {
        // Force next inference call to re-load the model from the new file.
        invalidateModelCache();
        if (settings.notifications?.modelUpdates ?? true) {
          toast.success(
            `Now using ${result.manifest.displayName}. Active on your next screening.`,
            'Model updated'
          );
        }
      } else if (result.kind === 'error' && settings.notifications?.modelUpdates) {
        toast.warning(`Couldn't update model: ${result.message}`);
      }
      // 'no-network', 'manifest-missing', and 'up-to-date' are silent on launch.
    })();
  }, [settings.notifications?.modelUpdates, toast]);

  return null;
}

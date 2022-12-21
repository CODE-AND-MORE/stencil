import { isBoolean } from '@utils';

import type * as d from '../../../declarations';
import { COPY, isOutputTargetDist, isOutputTargetDistCustomElementsBundle } from '../../output-targets/output-utils';
import { getAbsolutePath } from '../config-utils';
import { validateCopy } from '../validate-copy';
import { DIST_TYPES } from '../../output-targets/output-utils';

export const validateCustomElementBundle = (config: d.ValidatedConfig, userOutputs: d.OutputTarget[]) => {
  return userOutputs.filter(isOutputTargetDistCustomElementsBundle).reduce((arr, o) => {
    const outputTarget = {
      ...o,
      dir: getAbsolutePath(config, o.dir || 'dist/custom-elements'),
    };
    if (!isBoolean(outputTarget.empty)) {
      outputTarget.empty = true;
    }
    if (!isBoolean(outputTarget.externalRuntime)) {
      outputTarget.externalRuntime = true;
    }
    outputTarget.copy = validateCopy(outputTarget.copy, []);

    if (outputTarget.copy.length > 0) {
      arr.push({
        type: COPY,
        dir: config.rootDir,
        copy: [...outputTarget.copy],
      });
    }
    arr.push(outputTarget);

    if (!userOutputs.find(isOutputTargetDist)) {
      arr.push({
        type: DIST_TYPES,
        dir: outputTarget.dir,
        typesDir: outputTarget.typesDir || outputTarget.dir + "/types",
        keepCoreRefs: true
      });
    }
    
    return arr;
  }, [] as (d.OutputTargetDistCustomElementsBundle | d.OutputTargetCopy | d.OutputTargetDistTypes)[]);
};

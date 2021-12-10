import type { Config, OutputTarget, OutputTargetDistCustomElements, OutputTargetCopy, OutputTargetDistTypes } from '../../../declarations';
import { getAbsolutePath } from '../config-utils';
import { isBoolean } from '@utils';
import { COPY, DIST_TYPES, isOutputTargetDist, isOutputTargetDistCustomElements } from '../../output-targets/output-utils';
import { validateCopy } from '../validate-copy';

export const validateCustomElement = (config: Config, userOutputs: OutputTarget[]) => {
  return userOutputs.filter(isOutputTargetDistCustomElements).reduce((arr, o) => {
    const outputTarget = {
      ...o,
      dir: getAbsolutePath(config, o.dir || 'dist/components'),
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
        typesDir: outputTarget.dir + "/types",
        keepCoreRefs: true
      });
    }

    return arr;
  }, [] as (OutputTargetDistCustomElements | OutputTargetCopy | OutputTargetDistTypes)[]);
};

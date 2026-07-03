// ─────────────────────────────────────────────────────────
// Frame-by-frame algorithm generators
// Each function returns an array of "state frame" objects
// that the visualizer plays back via setTimeout.
// ─────────────────────────────────────────────────────────

/**
 * Binary Search – requires a SORTED array and a target value.
 * Returns frames: { type, left, right, mid, array, checkingValue, found, description }
 */
export function generateBinarySearchFrames(arr, target) {
  const frames = [];
  let left = 0;
  let right = arr.length - 1;

  frames.push({
    type: "init",
    left,
    right,
    mid: -1,
    array: [...arr],
    checkingValue: null,
    found: false,
    eliminated: [],
    description: `Starting Binary Search for target ${target} in a sorted array of ${arr.length} elements. Setting Left=0, Right=${right}.`,
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const checkingValue = arr[mid];

    // Frame: highlight mid
    frames.push({
      type: "check_mid",
      left,
      right,
      mid,
      array: [...arr],
      checkingValue,
      found: false,
      eliminated: arr.map((_, i) => i < left || i > right).map((v, i) => (v ? i : -1)).filter((i) => i !== -1),
      description: `Calculating mid = floor((${left} + ${right}) / 2) = ${mid}. Checking arr[${mid}] = ${checkingValue}.`,
    });

    if (checkingValue === target) {
      frames.push({
        type: "found",
        left,
        right,
        mid,
        array: [...arr],
        checkingValue,
        found: true,
        eliminated: [],
        description: `🎉 Found target ${target} at index ${mid}! arr[${mid}] = ${checkingValue}.`,
      });
      return frames;
    } else if (checkingValue < target) {
      const oldLeft = left;
      left = mid + 1;
      frames.push({
        type: "move_left",
        left,
        right,
        mid,
        array: [...arr],
        checkingValue,
        found: false,
        eliminated: arr.map((_, i) => i < left || i > right).map((v, i) => (v ? i : -1)).filter((i) => i !== -1),
        description: `arr[${mid}] = ${checkingValue} < ${target} (target). Value is too small. Moving Left pointer from ${oldLeft} → ${left}. Eliminating left half.`,
      });
    } else {
      const oldRight = right;
      right = mid - 1;
      frames.push({
        type: "move_right",
        left,
        right,
        mid,
        array: [...arr],
        checkingValue,
        found: false,
        eliminated: arr.map((_, i) => i < left || i > right).map((v, i) => (v ? i : -1)).filter((i) => i !== -1),
        description: `arr[${mid}] = ${checkingValue} > ${target} (target). Value is too large. Moving Right pointer from ${oldRight} → ${right}. Eliminating right half.`,
      });
    }
  }

  frames.push({
    type: "not_found",
    left,
    right,
    mid: -1,
    array: [...arr],
    checkingValue: null,
    found: false,
    eliminated: arr.map((_, i) => i),
    description: `Target ${target} was not found in the array. Left (${left}) crossed Right (${right}). Search space exhausted.`,
  });

  return frames;
}

// ─────────────────────────────────────────────────────────

/**
 * Kadane's Algorithm – Maximum Subarray Sum.
 * Returns frames: { type, currentIndex, currentSum, maxSum, subarrayStart, subarrayEnd,
 *                   maxStart, maxEnd, array, description }
 */
export function generateKadanesFrames(arr) {
  const frames = [];
  let currentSum = arr[0];
  let maxSum = arr[0];
  let subarrayStart = 0;
  let subarrayEnd = 0;
  let maxStart = 0;
  let maxEnd = 0;

  frames.push({
    type: "init",
    currentIndex: 0,
    currentSum,
    maxSum,
    subarrayStart: 0,
    subarrayEnd: 0,
    maxStart: 0,
    maxEnd: 0,
    array: [...arr],
    description: `Initializing: currentSum = arr[0] = ${arr[0]}, maxSum = ${arr[0]}. Starting from index 0.`,
  });

  for (let i = 1; i < arr.length; i++) {
    const extendSum = currentSum + arr[i];
    const restartSum = arr[i];

    if (extendSum >= restartSum) {
      currentSum = extendSum;
      subarrayEnd = i;
      frames.push({
        type: "extend",
        currentIndex: i,
        currentSum,
        maxSum,
        subarrayStart,
        subarrayEnd,
        maxStart,
        maxEnd,
        array: [...arr],
        description: `Index ${i}: Extend subarray. currentSum(${extendSum - arr[i]}) + arr[${i}](${arr[i]}) = ${extendSum} ≥ arr[${i}](${restartSum}). Extending → currentSum = ${currentSum}. Subarray [${subarrayStart}..${subarrayEnd}].`,
      });
    } else {
      currentSum = restartSum;
      subarrayStart = i;
      subarrayEnd = i;
      frames.push({
        type: "restart",
        currentIndex: i,
        currentSum,
        maxSum,
        subarrayStart,
        subarrayEnd,
        maxStart,
        maxEnd,
        array: [...arr],
        description: `Index ${i}: Start new subarray. currentSum(${extendSum - arr[i]}) + arr[${i}](${arr[i]}) = ${extendSum} < arr[${i}](${restartSum}). Restarting → currentSum = ${currentSum}. New subarray starts at [${i}].`,
      });
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxStart = subarrayStart;
      maxEnd = subarrayEnd;
      frames.push({
        type: "new_max",
        currentIndex: i,
        currentSum,
        maxSum,
        subarrayStart,
        subarrayEnd,
        maxStart,
        maxEnd,
        array: [...arr],
        description: `🏆 New maximum found! maxSum updated to ${maxSum}. Best subarray is [${maxStart}..${maxEnd}] = [${arr.slice(maxStart, maxEnd + 1).join(", ")}].`,
      });
    }
  }

  frames.push({
    type: "completed",
    currentIndex: arr.length - 1,
    currentSum,
    maxSum,
    subarrayStart,
    subarrayEnd,
    maxStart,
    maxEnd,
    array: [...arr],
    description: `✅ Kadane's complete! Maximum subarray sum = ${maxSum}. Subarray [${maxStart}..${maxEnd}] = [${arr.slice(maxStart, maxEnd + 1).join(", ")}].`,
  });

  return frames;
}

// ─────────────────────────────────────────────────────────

/**
 * Two Sum – Two Pointers on a SORTED array.
 * Returns frames: { type, left, right, currentSum, target, array, found, resultIndices, description }
 */
export function generateTwoSumFrames(arr, target) {
  const frames = [];
  let left = 0;
  let right = arr.length - 1;

  frames.push({
    type: "init",
    left,
    right,
    currentSum: null,
    target,
    array: [...arr],
    found: false,
    resultIndices: [],
    checked: [],
    description: `Starting Two Sum (Two Pointers) on sorted array. Target = ${target}. Left=0 (${arr[0]}), Right=${right} (${arr[right]}).`,
  });

  const checked = [];

  while (left < right) {
    const currentSum = arr[left] + arr[right];

    frames.push({
      type: "check_sum",
      left,
      right,
      currentSum,
      target,
      array: [...arr],
      found: false,
      resultIndices: [],
      checked: [...checked],
      description: `Checking: arr[${left}](${arr[left]}) + arr[${right}](${arr[right]}) = ${currentSum}. Target = ${target}.`,
    });

    if (currentSum === target) {
      frames.push({
        type: "found",
        left,
        right,
        currentSum,
        target,
        array: [...arr],
        found: true,
        resultIndices: [left, right],
        checked: [...checked],
        description: `🎉 Found pair! arr[${left}](${arr[left]}) + arr[${right}](${arr[right]}) = ${currentSum} equals target ${target}!`,
      });
      return frames;
    } else if (currentSum < target) {
      checked.push(left);
      frames.push({
        type: "move_left",
        left: left + 1,
        right,
        currentSum,
        target,
        array: [...arr],
        found: false,
        resultIndices: [],
        checked: [...checked],
        description: `Sum ${currentSum} < target ${target}. Need a larger sum. Moving Left pointer ${left} → ${left + 1}.`,
      });
      left++;
    } else {
      checked.push(right);
      frames.push({
        type: "move_right",
        left,
        right: right - 1,
        currentSum,
        target,
        array: [...arr],
        found: false,
        resultIndices: [],
        checked: [...checked],
        description: `Sum ${currentSum} > target ${target}. Need a smaller sum. Moving Right pointer ${right} → ${right - 1}.`,
      });
      right--;
    }
  }

  frames.push({
    type: "not_found",
    left,
    right,
    currentSum: null,
    target,
    array: [...arr],
    found: false,
    resultIndices: [],
    checked: [...checked],
    description: `No pair found that sums to ${target}. Pointers have crossed — search space exhausted.`,
  });

  return frames;
}

// ─────────────────────────────────────────────────────────

/**
 * Sliding Window – Maximum Sum of Sub-array of Size K.
 * Returns frames: { type, windowStart, windowEnd, currentSum, maxSum, maxStart, array, description }
 */
export function generateSlidingWindowFrames(arr, k) {
  const frames = [];

  if (k > arr.length || k <= 0) {
    frames.push({
      type: "error",
      windowStart: -1,
      windowEnd: -1,
      currentSum: 0,
      maxSum: 0,
      maxStart: -1,
      array: [...arr],
      description: `Error: Window size K=${k} is invalid. Must be between 1 and ${arr.length}.`,
    });
    return frames;
  }

  let currentSum = 0;
  let maxSum = -Infinity;
  let maxStart = 0;

  // Phase 1: Build the first window
  for (let i = 0; i < k; i++) {
    currentSum += arr[i];
    frames.push({
      type: "build_window",
      windowStart: 0,
      windowEnd: i,
      currentSum,
      maxSum: i === k - 1 ? currentSum : maxSum,
      maxStart: 0,
      addedIndex: i,
      removedIndex: -1,
      array: [...arr],
      description: `Building initial window: Adding arr[${i}] = ${arr[i]}. Window sum so far = ${currentSum}. [${arr.slice(0, i + 1).join(", ")}]`,
    });
  }

  maxSum = currentSum;
  maxStart = 0;

  frames.push({
    type: "window_ready",
    windowStart: 0,
    windowEnd: k - 1,
    currentSum,
    maxSum,
    maxStart: 0,
    addedIndex: -1,
    removedIndex: -1,
    array: [...arr],
    description: `Initial window [0..${k - 1}] ready. Sum = ${currentSum}. This is our current maxSum.`,
  });

  // Phase 2: Slide the window
  for (let i = k; i < arr.length; i++) {
    const removedVal = arr[i - k];
    const addedVal = arr[i];
    currentSum = currentSum - removedVal + addedVal;
    const windowStart = i - k + 1;
    const windowEnd = i;

    frames.push({
      type: "slide",
      windowStart,
      windowEnd,
      currentSum,
      maxSum,
      maxStart,
      addedIndex: i,
      removedIndex: i - k,
      array: [...arr],
      description: `Sliding window → Remove arr[${i - k}](${removedVal}), Add arr[${i}](${addedVal}). Window [${windowStart}..${windowEnd}] = [${arr.slice(windowStart, windowEnd + 1).join(", ")}]. Sum = ${currentSum}.`,
    });

    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxStart = windowStart;
      frames.push({
        type: "new_max",
        windowStart,
        windowEnd,
        currentSum,
        maxSum,
        maxStart,
        addedIndex: -1,
        removedIndex: -1,
        array: [...arr],
        description: `🏆 New maximum! Window [${windowStart}..${windowEnd}] sum = ${maxSum} > previous max. maxSum updated to ${maxSum}.`,
      });
    }
  }

  frames.push({
    type: "completed",
    windowStart: maxStart,
    windowEnd: maxStart + k - 1,
    currentSum,
    maxSum,
    maxStart,
    addedIndex: -1,
    removedIndex: -1,
    array: [...arr],
    description: `✅ Sliding Window complete! Maximum sum = ${maxSum} at window [${maxStart}..${maxStart + k - 1}] = [${arr.slice(maxStart, maxStart + k).join(", ")}].`,
  });

  return frames;
}

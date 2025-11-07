// Validators and conflict detection utilities

export function isTimeRangeOverlap(aStart, aEnd, bStart, bEnd) {
  // expects 'HH:MM'
  const toMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const aS = toMin(aStart), aE = toMin(aEnd), bS = toMin(bStart), bE = toMin(bEnd);
  return Math.max(aS, bS) < Math.min(aE, bE);
}

export function findSlotConflicts(slots) {
  const conflicts = [];
  const byDay = slots.reduce((acc, s) => {
    acc[s.day] = acc[s.day] || [];
    acc[s.day].push(s);
    return acc;
  }, {});
  Object.keys(byDay).forEach((day) => {
    const arr = byDay[day];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (isTimeRangeOverlap(arr[i].start, arr[i].end, arr[j].start, arr[j].end)) {
          conflicts.push({ day, a: arr[i], b: arr[j] });
        }
      }
    }
  });
  return conflicts;
}

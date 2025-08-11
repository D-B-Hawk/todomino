type GetCurrentTimeReturn = [
  Date,
  {
    hours: number;
    minutes: number;
    seconds: number;
  },
];

export function getCurrentTime(): GetCurrentTimeReturn {
  const now = Date.now();
  const currentDate = new Date(now);
  return [
    currentDate,
    {
      hours: currentDate.getHours(),
      minutes: currentDate.getMinutes(),
      seconds: currentDate.getSeconds(),
    },
  ];
}

export const formatCountdown = (secondsRemaining: number): string => {
  const hrs = Math.floor(secondsRemaining / 3600);
  const mins = Math.floor((secondsRemaining % 3600) / 60);
  const secs = secondsRemaining % 60;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(hrs)}h:${pad(mins)}m:${pad(secs)}s`;
};


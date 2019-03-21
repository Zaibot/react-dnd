export const trackCallsPerFrame = (message: string) => {
  let counter = 0;
  let timer: any = null;
  return () => {
    counter++;
    if (!timer) {
      timer = window.requestAnimationFrame(() => {
        console.log(`[@zaibot/react-dnd] ${message}, ${counter} in frame`);
        timer = null;
        counter = 0;
      });
    }
  };
};

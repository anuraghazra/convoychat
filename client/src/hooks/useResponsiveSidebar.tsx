import { useState, useEffect } from "react";

const useResponsiveSidebar = () => {
  const mql = window.matchMedia(`(min-width: 800px)`);
  const [isDocked, setIsDocked] = useState<boolean>(mql.matches);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onMatchMedia = () => {
    setIsDocked(mql.matches);
  };
  useEffect(() => {
    mql.addListener(onMatchMedia);

    return () => mql.removeListener(onMatchMedia);
  }, []);

  return { isDocked, isOpen, setIsOpen };
};

export default useResponsiveSidebar;

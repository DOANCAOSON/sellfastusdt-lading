import { useEffect, useState } from "preact/compat";
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div
      className={`scroll-to-top ${
        isVisible ? "" : "hidden"
      } fixed bottom-10 right-2 sm:bottom-10 bg-[#789363]  sm:right-5 lg:right-[300px] lg:bottom-[100px] z-[8000]`}
    >
      <div
        onClick={scrollToTop}
        className="scroll-button bg-bgcontainer rounded-lg border-[1px] border-boderhex "
      >
        {/* <BiChevronUp className="text-[32px] text-text rounded-lg " /> */}
      </div>
    </div>
  );
};

export default ScrollToTop;

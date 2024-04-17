import "../assets/menu.css";
const ScrollYPro = ({ telegram }: { telegram: string | null }) => {
  if (!telegram) return <></>;
  return (
    <a href={telegram} target="_blank">
      <div className="bg-[#0088CC] p-2 rounded-lg fixed z-[10000] bottom-14 left-10 hover:drop-shadow-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="40"
          viewBox="0 0 24 24"
          width="40"
          className="text-[#ffff]"
        >
          <path
            d="M9.417 15.18l-.397 5.584c.568 0 .814-.244 1.11-.537l2.663-2.545 5.518 4.04c1.012.564 1.725.267 1.998-.93L23.93 3.82h.001c.32-1.496-.54-2.08-1.527-1.714l-21.3 8.15c-1.453.564-1.43 1.374-.247 1.74L6.3 13.69l12.643-7.91c.595-.394 1.136-.176.69.218"
            fill="#ffffff"
          ></path>
        </svg>

        <div className="bg-[#fff] shadow rounded-lg p-[1px] px-[10px]  absolute top-[30%] left-[120%]">
          Telegram
        </div>
      </div>
    </a>
  );
};

export default ScrollYPro;

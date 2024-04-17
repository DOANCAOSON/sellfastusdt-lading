function Faqs(props: any) {
  return (
    <div
      style={{ gridColumn: "b", gridRow: "b" }}
      className="m-0 min-[767px]:mb-28"
      id="div-6"
    >
      <div className="m-0">
        <div className="text-xl font-semibold m-0">FAQ</div>
        <div className="flex-col pt-6 flex gap-4 m-0">
          <div className="items-center cursor-pointer pb-2 flex gap-6 m-0">
            <div className="bg-yellow-500/[0.1] relative w-28 h-auto rounded-lg m-0">
              <img
                src="https://bin.bnbstatic.com/static/images/wallet/video-new.svg"
                className="w-28 h-auto max-w-full m-0"
              />
              <div className="bottom-0 blur-[24px] left-0 absolute top-0 w-8 h-8 m-auto text-white">
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="rgb(0, 0, 0)"
                  className="w-8 h-8 m-0"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 12a9 9 0 1118 0 9 9 0 01-18 0zm8.934 3.5H10v-7h1.934L16 12l-4.066 3.5z"
                    fill="rgb(255, 255, 255)"
                    className="m-0"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-col flex-grow flex gap-1 m-0">
              <div className="font-medium m-0">Cách nạp tiền mã hóa?</div>
              <div className="text-slate-500 text-sm m-0">4:10</div>
            </div>
          </div>
          <a
            href="https://www.binance.com/vi/support/faq/how-to-deposit-crypto-to-binance-115003764971"
            className="items-center flex m-0"
          >
            Hướng dẫn nạp tiền mã hóa từng bước
          </a>
          <a
            href="https://www.binance.com/vi/support/faq/4d1347b4d6d44564ba44ea785703a4fd"
            className="items-center flex m-0"
          >
            Tiền đã nạp vẫn chưa vào tài khoản?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Faqs;

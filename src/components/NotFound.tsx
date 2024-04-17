const contextText = {
  description:
    'The page you are looking for could not be found. The link to this address may be outdated or we may have moved the since you last bookmarked it.',
  btnLabel: 'Back To Home Screen'
}

export const NotFound = () => (
  <div className='text-neutral-800 flex-wrap text-sm flex'>
    <div className='px-[calc(3rem*.5)] w-full max-w-full mt-12'>
      <div className='text-center'>
        <img src='/assets/images/404.png' className='blur-[0px] w-2/4 h-auto max-w-full' id='img-1' />
      </div>
    </div>

    <div className='px-[calc(3rem*.5)] w-full max-w-full mt-12'>
      <div className='text-center' id='div-1'>
        <h3 className='text-slate-600 text-lg'>{contextText.description}</h3>
        <a
          href='/'
          className='text-white mx-auto my-0 bg-teal-600 items-center cursor-pointer font-medium justify-center py-3 px-6 flex w-52 h-12 mt-[calc(14.4px_+_0.5vw)] rounded overflow-visible'>
          {contextText.btnLabel}
        </a>
      </div>
    </div>
  </div>
)

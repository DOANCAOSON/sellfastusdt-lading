interface Props {
  className?: string
}
function CoinSample({ className }: Props) {
  return (
    <div className={` w-full max-w-full mt-12 ${className}`}>
      <div className='sticky'>
        <div className='bg-stone-50 rounded-lg p-8'>
          <div className='border-b-gray-200 border-b-2 pb-4 mb-3 border-solid text-xl font-semibold'>
            <h3>ATTENTION</h3>
          </div>
          <p>
            Please check your balance after the transaction has been marked as paid. If there are any issues, please
            contact us immediately through the chat channel. The system will send a confirmation email for your
            transaction, so please check your email regularly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CoinSample

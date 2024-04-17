import Image from '@/components/Image'
interface Props {
  content: {
    'Interbank transfer': string
    'Account number': number
    'Account name': string
    'Account price': string
    'Transfer content (memo):': string
    'Created by': string
  }
  qrCode: string
}

function Payment(props: Props) {
  const { content, qrCode } = props
  return (
    <div class='px-[calc(3rem*.5)] w-full max-w-full mt-12 min-[992px]:w-2/4 min-[1200px]:w-1/3 min-[1400px]:w-1/4'>
      <div class='bg-stone-50 text-center rounded-lg flex items-center justify-center'>
        <div class='w-full max-w-sm'>
          {qrCode && (
            <Image src={qrCode} className='p-5 rounded-t-lg' ariaLabel='buy-button_image' alt='buy-button_image' />
          )}
          <div class='px-5 pb-5'>
            <div class='flex items-center mt-2.5 mb-5 w-full'>
              <ul role='list' class='divide-y divide-gray-200 w-full'>
                {Object.entries(content).map(([label, value]) => (
                  <li class='py-1'>
                    <div class='flex items-center'>
                      <div class='flex-1 min-w-0 ms-4'>
                        <p class='text-sm font-medium text-gray-900 truncate'>{label}</p>
                        <p class='text-sm text-gray-500 truncate'>{value}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment

import Image from '@/components/Image'

interface Props {
  status: { type: string; message: 'Waiting to receive money' }
}

function Status(props: Props) {
  const { status } = props

  const getStatusClass = () => {
    switch (status?.type) {
      case 'NEW':
        return 'bg-orange-400'
      case 'PAID':
        return 'bg-primary'
      case 'CONFIRMED':
        return 'bg-green-500'
      case 'CANCELLED':
        return 'bg-red-600'
    }
  }

  if (!status) return <></>
  return (
    <div className='md:px-[calc(3rem*.5)] w-full max-w-full mt-4 md:mt-12 min-[576px]:w-2/4 min-[1200px]:w-1/3'>
      <div className='bg-stone-50 flex h-full rounded-lg gap-4 p-5'>
        <div className='text-slate-600 w-[10%]'>
          <Image src='/assets/icons/info.svg' ariaLabel='info_image' alt='info_image' />
        </div>

        <div>
          <h5 className='text-slate-600 mb-1.5'>Status</h5>
          <h4
            className={`font-medium overflow-hidden text-white text-[13px] px-2.5 py-[5px] flex gap-2 rounded-[7px] ${getStatusClass()}`}>
            {status.type === 'NEW' && (
              <div className='spinner-border text-light' role='status' style={{ color: '#fff' }} />
            )}
            {status.message}
          </h4>
        </div>
      </div>
    </div>
  )
}

Status.propTypes = {}

export default Status

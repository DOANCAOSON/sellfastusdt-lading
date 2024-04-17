import { formattedDate } from '@/utils'

interface Props {
  histories: { action: { content: string; createdAt: string }[] }[]
  createdAt: string
}

function Processing(props: Props) {
  const { histories = [], createdAt } = props

  const transactionStatuses = [
    {
      title: 'Waiting to receive money',
      time: formattedDate(createdAt, { hour: 'numeric', minute: 'numeric', second: 'numeric' }),
      type: 'NEW',
      active: true
    },
    { title: 'Received money', time: 'Processing', type: 'PAID' },
    { title: 'Accomplished', time: 'Pending', type: 'CONFIRMED' },
    { title: 'Cancelled', time: 'Pending', type: 'CANCELLED' }
  ]

  histories.forEach((his) => {
    const index = transactionStatuses.findIndex((t) => t.type === JSON.parse(his.action[0].content).status)
    transactionStatuses[index].active = true
    transactionStatuses[index].time = formattedDate(his.action[0].createdAt, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
  })

  return (
    <div class='md:px-[calc(3rem*.5)] w-full max-w-full mt-4 md:mt-12 overflow-hidden'>
      <ol class='items-start list-decimal flex mt-3.5' id='transaction-list'>
        {transactionStatuses.map((status, index) => (
          <li
            key={index + 1}
            class={`${status.active && 'border-t-teal-600'} relative border-t-4 text-center inline-block w-full my-3 border-solid`}
            id={`transaction-${index + 1}`}>
            {status.active && (
              <svg
                class='w-6 h-6 text-green-600 absolute top-[-17%] lg:top-[-33%] left-[44%]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'>
                <path
                  fill-rule='evenodd'
                  d='M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm13.7-1.3a1 1 0 0 0-1.4-1.4L11 12.6l-1.8-1.8a1 1 0 0 0-1.4 1.4l2.5 2.5c.4.4 1 .4 1.4 0l4-4Z'
                  clip-rule='evenodd'
                />
              </svg>
            )}
            <h5 class='font-medium justify-center flex w-full mt-5'>{status.title}</h5>
            <h6 class='text-slate-600 mt-2'>{status.time}</h6>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Processing

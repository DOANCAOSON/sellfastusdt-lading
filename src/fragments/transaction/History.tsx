import { formattedDate } from '@/utils'

const messageStatus: any = {
  NEW: 'Waiting to receive money',
  PAID: 'Received money',
  CONFIRMED: 'Accomplished',
  CANCELLED: 'Cancelled'
}

interface Props {
  histories: { action: { content: string; createdAt: string }[] }[]
}

function History(props: Props) {
  const { histories = [] } = props

  const data = histories.map((his) => {
    const status = JSON.parse(his.action[0].content).status
    return {
      description: messageStatus[status],
      date: formattedDate(his.action[0].createdAt, { hour: 'numeric', minute: 'numeric', second: 'numeric' }),
      status
    }
  })

  if (!data.length) return <></>
  return (
    <div className='text-neutral-800 text-sm'>
      <table style='caption-side: bottom;' className='text-neutral-800 border-collapse w-full mt-10 table'>
        <thead className='table-header-group text-xl text-neutral-800'>
          <tr className='table-row'>
            <th className='bg-neutral-200 border-b-2 py-3.5 px-5 text-center align-bottom table-cell border-zinc-200 border-solid'>
              Status
            </th>
            <th className='bg-neutral-200 border-b-2 py-3.5 px-5 text-center align-bottom table-cell border-zinc-200 border-solid'>
              Date
            </th>
            <th className='bg-neutral-200 border-b-2 py-3.5 px-5 text-center align-bottom table-cell border-zinc-200 border-solid'>
              Description
            </th>
          </tr>
        </thead>
        <tbody className='table-row-group text-lg text-neutral-500 font-light'>
          {data.map((item) => (
            <tr className='table-row'>
              <td className='border-b-zinc-200 border-b-2 py-3.5 px-5 text-center align-top table-cell border-solid'>
                {item.status}
              </td>
              <td className='border-b-zinc-200 border-b-2 py-3.5 px-5 text-center align-top table-cell border-solid'>
                {item.date}
              </td>
              <td className='border-b-zinc-200 border-b-2 py-3.5 px-5 text-center align-top table-cell border-solid'>
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

History.propTypes = {}

export default History

import { auth } from '@/store/auth-store'
import { formattedAmount, formattedDate } from '@/utils'
import { useEffect, useState } from 'preact/compat'
import Loading from '../Loading'
import { Image } from '../image/Image'

function History({ type }: any) {
  const [state, setState] = useState<{
    pagination: {
      page: number
      pageSize: number
      totalRecords: number
    }
    data: Array<Record<string, unknown>>
  }>()
  const [loading, setLoading] = useState(true)

  const userId = auth.get().auth?.id

  useEffect(() => {
    if (userId && loading) {
      fetch(`/api/balance?userId=${userId}?type=${type}`)
        .then((res) => res.json())
        .then((data) => setState(data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [userId])

  return (
    <div style={{ gridColumn: 'c', gridRow: 'c' }} className='mx-0 min-[767px]:mr-0 min-[767px]:mb-28 min-[767px]:ml-0'>
      <div className='m-0'>
        <div className='items-center justify-between flex m-0'>
          <div className='items-center flex m-0'>
            <div className='text-xl font-semibold my-0 mr-4 ml-0'>History wallet funds</div>
          </div>
        </div>
        <div className='items-center flex-col flex mt-20 mx-0 mb-0 gap-4'>
          {loading ? <Loading /> : <Balances state={state as any} />}
        </div>
      </div>
    </div>
  )
}

function TableRow({ data, idx }: any) {
  const Dot = (s: string) => {
    switch (s) {
      case 'CANCELLED':
        return <span class='h-2.5 w-2.5 rounded-full bg-red-500 me-2'></span>
      case 'CONFIRMED':
        return <span class='h-2.5 w-2.5 rounded-full bg-green-500 me-2'></span>
      case 'NEW':
        return <span class='h-2.5 w-2.5 rounded-full bg-blue-500 me-2'></span>
      case 'PAID':
        return <span class='h-2.5 w-2.5 rounded-full bg-orange-500 me-2'></span>
      default:
        break
    }
  }
  return (
    <tr className='bg-white border-b'>
      <td className='px-6 py-4'>{idx}</td>
      <td scope='row' class='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap '>
        <Image
          className='w-10 h-10 rounded-full'
          src={data.token?.images?.split(',')[0]}
          alt='Jese image'
          ariaLabel={data.token?.binance}
        />
        <div class='ps-3'>
          <div class='text-base font-semibold text-gray-500'>{data.token?.tokenName.toUpperCase()}</div>
          <div class='font-normal text-gray-500'>{data.token?.binance.replace('usdt', '').toUpperCase()}</div>
        </div>
      </td>
      <td className='px-6 py-4'>{data.type}</td>
      <td className='px-6 py-4'>{formattedAmount(data.amount)}</td>
      <td class='px-6 py-4'>
        {Dot(data.status)} {data.status}
      </td>
      <td className='px-6 py-4'>
        {formattedDate(data.createdAt, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}
      </td>
      <td className='px-6 py-4'>
        <a href={`/crypto/${data.id}`} className='font-medium text-blue-600  hover:underline'>
          View
        </a>
      </td>
    </tr>
  )
}

function Table({ rows }: { rows: Array<Record<string, unknown>> }) {
  return (
    <table className='w-full text-sm text-left rtl:text-right text-gray-500 '>
      <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
        <tr>
          <th scope='col' className='px-6 py-3'>
            #
          </th>
          <th scope='col' className='px-6 py-3'>
            Coin
          </th>
          <th scope='col' className='px-6 py-3'>
            Type
          </th>
          <th scope='col' className='px-6 py-3'>
            Amount
          </th>
          <th scope='col' className='px-6 py-3'>
            Status
          </th>
          <th scope='col' className='px-6 py-3'>
            Created At
          </th>
          <th scope='col' className='px-6 py-3'>
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((data, idx) => (
          <TableRow key={data.id} data={data} idx={idx} />
        ))}
      </tbody>
    </table>
  )
}

function Pagination({
  pagination
}: {
  pagination: {
    page: number
    pageSize: number
    totalRecords: number
  }
}) {
  const { page, pageSize, totalRecords } = pagination
  const totalPages = Math.ceil(totalRecords / pageSize)
  const getPaginationLink = (p: number) => `?page=${p}`
  const paginationList = Array.from({ length: totalPages }, (_, i) => i + 1)

  if (paginationList.length <= 1) return <></>
  return (
    <nav
      className='flex items-center flex-column flex-wrap md:flex-row justify-between pt-4'
      aria-label='Table navigation'>
      <span className='text-sm font-normal text-gray-500  mb-4 md:mb-0 block w-full md:inline md:w-auto'>
        Showing <span className='font-semibold text-gray-900 '>1-10</span> of{' '}
        <span className='font-semibold text-gray-900 '>{pagination.totalRecords}</span>
      </span>
      <ul className='inline-flex -space-x-px rtl:space-x-reverse text-sm h-8'>
        {page === 2 && (
          <li>
            <a
              href='#'
              class='flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 '>
              Previous
            </a>
          </li>
        )}
        {paginationList.map((p) => (
          <li>
            <span
              onClick={() => getPaginationLink(p)}
              class={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                page === p ? 'bg-blue-50' : ''
              }`}>
              {p}
            </span>
          </li>
        ))}
        {paginationList.length >= 2 && page >= 2 && (
          <li>
            <a
              href='#'
              class='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 '>
              Next
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}

const Balances = ({
  state
}: {
  state: {
    pagination: {
      page: number
      pageSize: number
      totalRecords: number
    }
    data: Array<Record<string, unknown>>
  }
}) => {
  if (!state.data?.length) return <Empty />
  return (
    <div className='w-full relative overflow-x-auto shadow-md sm:rounded-lg'>
      <Table rows={state.data} />
      <Pagination pagination={state.pagination} />
    </div>
  )
}

const Empty = () => {
  return (
    <>
      <svg viewBox='0 0 96 96' xmlns='http://www.w3.org/2000/svg' fill='rgb(0, 0, 0)' className='w-16 h-16 m-0'>
        <path opacity='0.5' d='M84 28H64V8l20 20z' fill='rgb(146, 154, 165)' className='opacity-50 m-0' />
        <path
          opacity='0.15'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M24 8h40v20h20v60H24V8zm10 30h40v4H34v-4zm40 8H34v4h40v-4zm-40 8h40v4H34v-4z'
          fill='rgb(146, 154, 165)'
          className='opacity-[0.15] m-0'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M22.137 64.105c7.828 5.781 18.916 5.127 26.005-1.963 7.81-7.81 7.81-20.474 0-28.284-7.81-7.81-20.474-7.81-28.284 0-7.09 7.09-7.744 18.177-1.964 26.005l-14.3 14.3 4.243 4.243 14.3-14.3zM43.9 57.9c-5.467 5.468-14.331 5.468-19.799 0-5.467-5.467-5.467-14.331 0-19.799 5.468-5.467 14.332-5.467 19.8 0 5.467 5.468 5.467 14.332 0 19.8z'
          fill='rgb(146, 154, 165)'
          className='m-0'
        />
      </svg>
      <div className='text-slate-500 text-sm m-0'>No recent deposit history.</div>
    </>
  )
}
export default History

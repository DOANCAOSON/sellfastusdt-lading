import { formattedDate } from '@/utils'
import { Image } from './image/Image'

function PostCard({ item }: { item: Post }) {
  return (
    <div class='bg-white rounded-lg  hover:bg-gray-50  shadow-md  p-4 text-start w-[100%] h-[400px]'>
      <div class='bg-white rounded-lg max-w-sm mb-5 h-[45%]'>
        <a href={`/blog/${item.slug}`}>
          <Image className='h-[100%] w-full' src={item?.images} alt={item.title} ariaLabel='' />
        </a>
        <div>
          <a href={`/blog/${item.slug}`}>
            <h5 class=' text-break text-gray-900 font-bold text-2xl tracking-tight mb-2' style='word-wrap: break-word;'>
              {item.title}
            </h5>
          </a>
          <p class='font-normal text-gray-700 mb-3 text-break'>{item.description}</p>
          <p class='font-sm text-gray-500 mb-3'>{formattedDate(item.createdAt)}</p>
          <a
            class='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center'
            href={`/blog/${item.slug}`}>
            Read more
          </a>
        </div>
      </div>
    </div>
  )
}

PostCard.propTypes = {}

export default PostCard

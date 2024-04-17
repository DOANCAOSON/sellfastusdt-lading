const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={`${className} w-full status flex justify-center items-center`}>
      <div className='pl3'>
        <div className='pl3__a'></div>
        <div className='pl3__b'></div>
        <div className='pl3__c'></div>
        <div className='pl3__d'></div>
      </div>
    </div>
  )
}
export default Loading

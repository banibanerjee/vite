import React from 'react'

 const ProductDescription = () => {
  return (
    <div className='mt-20'>
        <div className='flex gap-3 mb-4'>
            <button className='btn_dark_rounded !rounded-none !text-xs !py-[6px] w-36'>Description</button>
            <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Care Guide</button>
            <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Size Guide</button>
        </div>
        <div className='flex flex-col pb-16'>
            <p className='text-sm'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit quia cumque natus laudantium blanditiis aliquam, suscipit corporis, voluptas iste, voluptates quas illo veniam totam ullam minus earum temporibus eos sunt.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis sint distinctio magnam dignissimos veniam corrupti architecto dolores quod maiores deleniti laboriosam commodi suscipit aliquid labore mollitia, nostrum alias consequatur a.</p>
            <p className='text-sm'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam illum impedit suscipit mollitia, molestiae inventore recusandae fugit sed? Aut quidem, quis dicta itaque quibusdam perspiciatis provident optio minima voluptatum dolorum.</p>
        
        </div>
    </div>
  )
}
export default ProductDescription
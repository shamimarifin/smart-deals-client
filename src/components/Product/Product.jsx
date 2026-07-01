import React from 'react'
import { Link } from 'react-router'

const Product = ({product}) => {
    const {_id,title,image,price_min, price_max,usage} = product
  return (
       <div className="card bg-base-100 rounded-lg shadow-sm mt-5">
      <figure className="px-3 pt-3">
        <img
          src={image}
          alt={title}
          className="rounded-md  object-cover w-full bg-gray-200 h-60"
        />
      </figure>
      <div className="card-body px-3 pb-3 pt-2">
        <h3 className="font-medium text-gray-800 leading-snug text-xl">
          {title} [{usage}]
        </h3>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#632EE3] font-semibold">${price_min}-{price_max}</span>
          
        </div>

        <Link to={`/productDetails/${_id}`} className="btn btn-outline btn-sm w-full mt-1 border-[#632EE3] text-[#632EE3] hover:bg-[#632EE3] hover:text-white">
          View Details
        </Link>
      </div>
    </div>
  )
}

export default Product

import React, { use, useEffect, useRef, useState } from 'react'
import { data, Link, useLoaderData, useLocation, useNavigate } from 'react-router'
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const ProductDetails = () => {

  const { _id: productId, category, condition, created_at, description, email, image, location, price_max, price_min, seller_name, seller_contact, seller_image, status, title, usage } = useLoaderData();
  const [bids, setBids] = useState([])
  const bidModalRef = useRef(null)
  const { user } = use(AuthContext)
  const navigate = useNavigate()


  const handleModalRefOpen = () => {

    if (!user) {
      navigate("/register")
      return
    }

    bidModalRef.current.showModal()
  }

  useEffect(() => {
    fetch(`http://localhost:3000/products/bids/${productId}`)
      .then(res => res.json())
      .then(data => {
        console.log('bids for this product', data)
        setBids(data)
      })
  }, [productId])


  const handleBidSubmit = (e) => {
    e.preventDefault()
    const name = e.target.buyer_name.value
    const email = e.target.buyer_email.value
    const bid = e.target.bid_price.value
    const contact = e.target.buyer_contact.value

    console.log(productId, name, email, bid, contact)

    const newBid = {
      product: productId,
      buyer_name: name,
      buyer_email: email,
      buyer_image: user?.photoURL,
      bid_price: bid,
      buyer_contact: contact,
      status: "pending"
    }

    console.log(newBid)

    fetch('http://localhost:3000/bids', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(newBid)
    })
      .then(res => res.json())
      .then(data => {
        console.log('after bid data', data)

        if (data.insertedId) {
          bidModalRef.current.close()
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });

          // add the new bio to the state
          newBid._id = data.insertedId
          const newBids = [...bids, newBid]
          newBids.sort((a,b) => b.bid_price - a.bid_price)
          setBids(newBids)
        }
      })

  }

  return (
    <div>
      {/* Product Info */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Link to="/" className="text-sm mb-3 inline-block hover:underline">
          ← Back To Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side */}
          <div>
            <img
              src={image}
              alt={title}
              className="w-full h-[420px] object-cover rounded-xl"
            />

            <div className="card bg-base-100 shadow-md mt-5">
              <div className="card-body">
                <h2 className="card-title text-lg">
                  Product Description
                </h2>

                <div className="flex gap-10 text-sm mb-3">
                  <p>
                    <span className="font-semibold text-primary">
                      Condition :
                    </span>{" "}
                    {condition}
                  </p>

                  <p>
                    <span className="font-semibold text-primary">
                      Usage Time :
                    </span>{" "}
                    {usage}
                  </p>
                </div>

                <div className="divider my-1"></div>

                <p className="text-sm text-gray-500">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div>
            <h1 className="text-4xl font-bold">
              {title}
            </h1>

            <div className="badge badge-secondary badge-outline mt-2">
              {category}
            </div>

            {/* Price */}
            <div className="card bg-base-100 shadow-md mt-4">
              <div className="card-body py-5">
                <h2 className="text-3xl font-bold text-success">
                  ${price_min} - {price_max}
                </h2>

                <p className="text-gray-500">
                  Price starts from
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div className="card bg-base-100 shadow-md mt-4">
              <div className="card-body">
                <h2 className="card-title">
                  Product Details
                </h2>

                <p>
                  <span className="font-semibold">
                    Product ID:
                  </span>{" "}
                  {productId}
                </p>

                <p>
                  <span className="font-semibold">
                    Posted:
                  </span>{" "}
                  {created_at}
                </p>
              </div>
            </div>

            {/* Seller */}
            <div className="card bg-base-100 shadow-md mt-4">
              <div className="card-body">
                <h2 className="card-title">
                  Seller Information
                </h2>

                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img src={seller_image} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {seller_name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-sm">
                  <p>
                    <span className="font-semibold">
                      Location:
                    </span>{" "}
                    {location}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Contact:
                    </span>{" "}
                    {seller_contact}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Status:
                    </span>{" "}
                    <span className="badge badge-warning">
                      {status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <button

              onClick={handleModalRefOpen}
              className="btn btn-primary w-full mt-5">
              I Want Buy This Product
            </button>

            <dialog ref={bidModalRef} id="my_modal_5" className="modal modal-bottom sm:modal-middle">
              <div className="modal-box">
                <h3 className="font-bold text-3xl text-center">Give Seller Your Offered Price</h3>
                <div className="modal-action">

                  <form onSubmit={handleBidSubmit}>
                    <div className="card-body space-y-6">

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="label">
                            <span className="label-text font-semibold">Buyer Name</span>
                          </label>
                          <input
                            readOnly
                            defaultValue={user?.displayName}
                            type="text"
                            name="buyer_name"
                            placeholder="Your name"
                            className="input input-bordered w-full"
                          />
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text font-semibold">Buyer Email</span>
                          </label>
                          <input

                            readOnly
                            defaultValue={user?.email}
                            type="email"
                            name="buyer_email"
                            placeholder="Your Email"
                            className="input input-bordered w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Buyer Image URL</span>
                        </label>
                        <input
                          type="url"
                          name="buyer_image"
                          placeholder="https://example.com/profile.jpg"
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Place Your Bid</span>
                        </label>
                        <input
                          required
                          type="number"
                          name="bid_price"
                          placeholder="Enter your offer price"
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Contact Number</span>
                        </label>
                        <input
                          required
                          type="tel"
                          name="buyer_contact"
                          placeholder="+88017XXXXXXXX"
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div className="flex justify-end gap-4">
                        <button type='button' className="btn" onClick={() => bidModalRef.current.close()}>Close</button>

                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Submit Bid
                        </button>
                      </div>
                    </div>

                  </form>
                </div>
              </div>
            </dialog>


          </div>
        </div>
      </div>
      {/* Bids for the product */}
      <div className='py-20'>
        <h3 className="text-3xl font-bold">Bids for this product : <span className='text-primary font-bold'>{bids.length}</span></h3>

        <div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>SL NO</th>
                  <th>Buyer Name</th>
                  <th>Buyer Email</th>
                  <th>Bid Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>

                {
                  bids.map((bid, index) => <tr>
                    <th>
                      {index + 1}
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={bid.buyer_image}
                              alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{bid.buyer_name}</div>
                          <div className="text-sm opacity-50">{location}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {bid.buyer_email}
                    </td>
                    <td>${bid.bid_price}</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>)
                }





              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

import React, { use, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Swal from 'sweetalert2'
import { data } from 'react-router'

const MyBids = () => {
  const { user } = use(AuthContext)
  const [bids, setBids] = useState([])

  console.log(bids)


  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/bids?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setBids(data)
        })
    }
  }, [user?.email])

  const handleRemoveBid = (_id) => {


    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {



        fetch(`http://localhost:3000/bids/${_id}`, {
          method: 'DELETE',
        })
          .then(res => res.json())
          .then(data => {
            console.log('after delete this', data)

            if (data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Your bids has been deleted.",
                icon: "success"
              })

              const remainingBids = bids.filter(bid=> bid._id !== _id);
              console.log('My Remaing Bids',remainingBids)
              setBids(remainingBids)
            }

          })
      };
    });


  }

  return (
    <div>
      <h3 className="text-3xl">My Bids : <span>{bids.length}</span></h3>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                SL No
              </th>
              <th>Product</th>
              <th>Seller</th>
              <th>Bid Price</th>
              <th>Status</th>
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
                          src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                          alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Hart Hagerty</div>
                      <div className="text-sm opacity-50">United States</div>
                    </div>
                  </div>
                </td>
                <td>
                  Zemlak, Daniel and Leannon
                  <br />
                  <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
                </td>
                <td>${bid.bid_price}</td>
                <td>
                  {bid.status === "pending" ?
                    <div className="badge badge-warning">{bid.status}</div> :
                    <div className="badge badge-success">{bid.status}</div>
                  }
                </td>
                <th>
                  <button
                    onClick={() => handleRemoveBid(bid._id)}
                    className="btn btn-outline btn-secondary btn-xs">Remove Bid</button>
                </th>
              </tr>)
            }

          </tbody>

        </table>
      </div>
    </div>
  )
}

export default MyBids

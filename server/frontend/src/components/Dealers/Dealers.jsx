import React, { useState, useEffect, useCallback } from 'react';
import "./Dealers.css";
import Header from '../Header/Header';
const review_icon = "https://img.icons8.com/ios/100/ffffff/feedback.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([])

  const get_dealers = useCallback(async () => {
    const res = await fetch("/djangoapp/get_dealers", {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers)
      let uniqueStates = [];
      all_dealers.forEach((dealer) => {
        uniqueStates.push(dealer.state)
      });

      setStates(Array.from(new Set(uniqueStates)))
      setDealersList(all_dealers)
    }
  }, []);

  const filterDealers = useCallback(async (state) => {
    if (state === 'All'){
      get_dealers();
      return;
    }
    try {
    const res = await fetch("/djangoapp/get_dealers/" + state, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let state_dealers = Array.from(retobj.dealers)
      setDealersList(state_dealers)
      }
    } catch (error) {
      console.error("Failed to filter dealers by state", error);
    }
  }, [get_dealers]);

  useEffect(() => {
    get_dealers();
  }, [get_dealers]);  

  let isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div>
      <Header/>

      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            
            <div className="card dealers-card">
              <div className="banner">
                <h1 className="h3 fw-bold text-white mb-2">Dealerships</h1>
                <p className="mb-0 small" style={{ color: '#94a3b8' }}>Browse our network of trusted car dealerships</p>
              </div>
              
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-dark-custom">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Dealer Name</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Zip</th>
                        <th>
                          <select 
                            name="state" 
                            id="state" 
                            className="form-select form-select-sm"
                            onChange={(e) => filterDealers(e.target.value)}
                          >
                            <option value="" disabled hidden>State</option>
                            <option value="All">All States</option>
                            {states.map((state, index) => (
                              <option key={index} value={state}>{state}</option>
                            ))}
                          </select>        
                        </th>
                        {isLoggedIn && <th>Review</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {dealersList.map((dealer, index) => (
                        <tr key={index}>
                          <td>{dealer['id']}</td>
                          <td>
                            <a href={'/dealer/' + dealer['id']} className="text-cyan text-decoration-none fw-semibold">
                              {dealer['full_name']}
                            </a>
                          </td>
                          <td>{dealer['city']}</td>
                          <td>{dealer['address']}</td>
                          <td>{dealer['zip']}</td>
                          <td>{dealer['state']}</td>
                          {isLoggedIn && (
                            <td>
                              <a href={`/postreview/${dealer['id']}`} className="review-link">
                                <img src={review_icon} className="review-icon" alt="Post Review"/>
                              </a>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default Dealers

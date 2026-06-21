import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState();
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const params = useParams();
  const id = params.id;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if(!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory")
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    const res = await fetch("/djangoapp/add_review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    }
  }

  const get_dealer = useCallback(async () => {
    const res = await fetch(`/djangoapp/dealer/${id}`, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      if(dealerobjs.length > 0)
        setDealer(dealerobjs[0])
    }
  }, [id]);

  const get_cars = useCallback(async () => {
    const res = await fetch("/djangoapp/get_cars", {
      method: "GET"
    });
    const retobj = await res.json();
    
    let carmodelsarr = Array.from(retobj.CarModels)
    setCarmodels(carmodelsarr)
  }, []);

  useEffect(() => {
    get_dealer();
    get_cars();
  }, [get_dealer, get_cars]);

  return (
    <div className="post-review-page-wrapper">
      <Header/>
      
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            
            <div className="card post-review-card">
              <div className="banner">
                <h1 className="h3 fw-bold text-white mb-2">Post a Review</h1>
                <p className="mb-0 small" style={{ color: '#94a3b8' }}>
                  Share your experience with {dealer.full_name}
                </p>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Review</label>
                    <textarea 
                      className="form-control" 
                      rows="5" 
                      placeholder="Write your review here..." 
                      onChange={(e) => setReview(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="col-12 col-sm-6">
                    <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Purchase Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="col-12 col-sm-6">
                    <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Car Year</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="YYYY" 
                      max={2023} 
                      min={2015}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Car Make & Model</label>
                    <select 
                      className="form-select" 
                      onChange={(e) => setModel(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>Choose Car Make and Model</option>
                      {carmodels.map((carmodel, index) => (
                        <option key={index} value={carmodel.CarMake + " " + carmodel.CarModel}>
                          {carmodel.CarMake} {carmodel.CarModel}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12 pt-2">
                    <button 
                      className="btn btn-cyan px-4 py-2 rounded-pill w-100 fw-bold"
                      onClick={postreview}
                    >
                      Post Review
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default PostReview

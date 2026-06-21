import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import Header from '../Header/Header';
const review_icon = "https://img.icons8.com/ios/100/ffffff/feedback.png"

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);

  const params = useParams();
  const id = params.id;

  const get_dealer = useCallback(async () => {
    const res = await fetch(`/djangoapp/dealer_details/${id}`, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      setDealer(dealerobjs[0])
    }
  }, [id]);

  const get_reviews = useCallback(async () => {
    const res = await fetch(`/djangoapp/reviews/dealer/${id}`, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      if(retobj.reviews.length > 0) {
        setReviews(retobj.reviews)
      } else {
        setUnreviewed(true);
      }
    }
  }, [id]);

  const senti_icon = (sentiment) => {
    let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
    return icon;
  }

  useEffect(() => {
    get_dealer();
    get_reviews();
  }, [get_dealer, get_reviews]);

  const isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div className="dealer-page-wrapper">
      <Header/>
      
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            
            <div className="card dealer-card">
              <div className="banner">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="h3 fw-bold text-white mb-2">{dealer.full_name}</h1>
                    <p className="mb-0 small" style={{ color: '#94a3b8' }}>
                      {dealer['city']}, {dealer['address']}, Zip - {dealer['zip']}, {dealer['state']}
                    </p>
                  </div>
                  {isLoggedIn && (
                    <a href={`/postreview/${id}`} className="post-review-link">
                      <img src={review_icon} className="post-review-icon" alt='Post Review'/>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="card-body p-4">
                <h4 className="fw-bold text-white mb-4">Customer Reviews</h4>
                
                <div className="reviews-panel">
                  {reviews.length === 0 && unreviewed === false ? (
                    <div className="text-center py-5">
                      <p className="text-secondary" style={{ color: '#94a3b8' }}>Loading Reviews...</p>
                    </div>
                  ) : unreviewed === true ? (
                    <div className="text-center py-5">
                      <p className="text-secondary" style={{ color: '#94a3b8' }}>No reviews yet!</p>
                    </div>
                  ) : (
                    reviews.map((review, index) => (
                      <div key={index} className="review-card">
                        <div className="d-flex align-items-start gap-3">
                          <img src={senti_icon(review.sentiment)} className="sentiment-icon" alt='Sentiment'/>
                          <div className="review-content">
                            <p className="review-text mb-2">{review.review}</p>
                            <p className="reviewer-info mb-0">
                              {review.name} - {review.car_make} {review.car_model} {review.car_year}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default Dealer

import React from 'react'
import { dummyTestimonial, assets } from '../../assets/assets'

const TestimonailSection = () => {
  // Helper function to calculate rating if needed
  const calculateRating = (testimonial) => {
    if (!testimonial || !testimonial.rating) return 0;
    return testimonial.rating;
  };

  return (
    <div className='py-16 md:px-40 px-8 bg-gray-50'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>Testimonials</h2>
        <p className='text-gray-500 max-w-2xl mx-auto mt-3 text-sm md:text-base'>
          Hear from our learners as they share their journeys of transformation,
          success, and how our platform has made a difference in their lives.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 md:gap-8 mt-10'>
        {dummyTestimonial.map((testimonial, index) => {
          const rating = testimonial.rating || 0;
          const fullStars = Math.floor(rating);
          
          return (
            <div 
              key={index}  // ← Fixed: 'key' not 'keys'
              className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100'
            >
              {/* User Info */}
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-50/80 border-b border-gray-100'>
                <img 
                  className='h-12 w-12 rounded-full object-cover' 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                />
                <div>
                  <h3 className='text-base font-semibold text-gray-800'>{testimonial.name}</h3>
                  <p className='text-gray-500 text-sm'>{testimonial.role}</p>
                </div>
              </div>
              
              {/* Feedback */}
              <div className='p-5'>
                {/* Stars */}
                <div className='flex gap-0.5 mb-3'>
                  {[...Array(5)].map((_, i) => (  // ← Fixed: added closing ']'
                    <img 
                      className='h-4 w-4' 
                      key={i} 
                      src={i < fullStars ? assets.star : assets.star_blank} 
                      alt={i < fullStars ? 'star' : 'empty star'} 
                    />
                  ))}
                </div>
                <p className='text-gray-600 text-sm leading-relaxed'>
                  "{testimonial.feedback}"
                </p>
              </div>
              <a href="#" className='text-blue-500 mt-5'>Read more</a>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default TestimonailSection
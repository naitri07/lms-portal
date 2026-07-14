import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'

const Player = () => {
  // ✅ Add allCourses as fallback
  const { enrolledCourses, allCourses, calculateChapterTime } = useContext(AppContext)
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)

  const getCourseData = () => {
    let course = null
    
    // ✅ First try enrolledCourses
    if (enrolledCourses && enrolledCourses.length > 0) {
      course = enrolledCourses.find((course) => course._id === courseId)
    }
    
    // ✅ If not found, try allCourses (preview mode)
    if (!course && allCourses && allCourses.length > 0) {
      course = allCourses.find((course) => course._id === courseId)
    }
    
    if (course) {
      setCourseData(course)
    }
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  useEffect(() => {
    getCourseData()
  }, [enrolledCourses, allCourses, courseId])

  // ✅ Show loading if no course data
  if (!courseData) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <div className='text-gray-500 text-center'>
          <p>Loading course content...</p>
          <p className='text-sm text-gray-400 mt-2'>
            {allCourses?.length === 0 ? 'No courses available' : ''}
          </p>
        </div>
      </div>
    )
  }

  // ✅ Get YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null
    // Handle youtu.be/abc123 format
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0]
    }
    // Handle youtube.com/watch?v=abc123 format
    if (url.includes('watch?v=')) {
      return url.split('watch?v=')[1].split('&')[0]
    }
    // Handle youtube.com/embed/abc123 format
    if (url.includes('embed/')) {
      return url.split('embed/')[1].split('?')[0]
    }
    return url
  }

  return (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        {/* Left Column */}
        <div className='pt-8 text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          <div className='pt-5'>
            {courseData.courseContent?.map((chapter, index) => (
              <div className='border border-gray-300 bg-white mb-2 rounded' key={index}>
                <div 
                  className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' 
                  onClick={() => toggleSection(index)}
                >
                  <div className='flex items-center gap-2'>
                    <img 
                      className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                      src={assets.down_arrow_icon} 
                      alt="arrow icon"
                    />
                    <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm md:text-default'>
                    {chapter.chapterContent?.length || 0} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className='list-disc md:pl-10 pl-4 py-2 text-gray-600 border-t border-gray-300'>
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className='flex items-start gap-2 py-1'>
                        <img 
                          src={false ? assets.blue_tick_icon : assets.play_icon} 
                          alt="play icon" 
                          className='w-4 h-4 mt-1'
                        />
                        <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                          <p>{lecture.lectureTitle}</p>
                          <div className='flex gap-2'>
                            {lecture.lectureUrl && (
                              <p 
                                onClick={() => setPlayerData({
                                  ...lecture, 
                                  chapter: index + 1, 
                                  lecture: i + 1
                                })} 
                                className='text-blue-500 cursor-pointer hover:underline'
                              >
                                Watch
                              </p>
                            )}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units: ['h', 'm']})}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this Course:</h1>
            <Rating initialRating={0}/>
          </div>
        </div>

        {/* Right Column - Video Player */}
        <div className='md:mt-10'>
          {playerData ? (
            <div>
              {playerData.lectureUrl && (
                <YouTube 
                  videoId={getYouTubeId(playerData.lectureUrl)} 
                  iframeClassName='w-full aspect-video rounded-lg'
                />
              )}
              <div className='flex justify-between items-center mt-3'>
                <p className='text-sm text-gray-600'>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button className='text-blue-600 hover:underline text-sm'>
                  {false ? 'Completed' : 'Complete'}
                </button>
              </div>
            </div>
          ) : (
            <div className='bg-gray-100 rounded-lg p-8 text-center'>
              <img 
                src={courseData?.courseThumbnail || assets.play_icon} 
                alt="Course thumbnail" 
                className='w-full max-h-64 object-cover rounded-lg mb-4'
              />
              <p className='text-gray-500'>Select a lecture to start watching</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Player
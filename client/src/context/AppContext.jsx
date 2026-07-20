import { createContext, useEffect, useState, useCallback } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY || '₹';
    const navigate = useNavigate();

    const { getToken, isLoaded: authLoaded } = useAuth();
    const { user, isLoaded: userLoaded } = useUser();

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch all courses
    const fetchAllCourses = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/course/all');

            if(data.success){
                setAllCourses(data.courses)
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    //fetch user data
    const fetchUserData = async()=>{

        if(user?.publicMetadata?.role === 'educator'){
            setIsEducator(true)
        }
        try {
            const token = await getToken();

            const {data} = await axios.get(backendUrl + '/api/user/data', {headers: {Authorization: `Bearer ${token}`}})

            if(data.success){
                setUserData(data.user)
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            
        }
    }

    // Fetch enrolled courses
    const fetchUserEnrolledCourses = async () => {

        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses',
                {headers: {Authorization: `Bearer ${token}`}}
            )

            if(data.success){
                setEnrolledCourses(data.enrolledCourses.reverse())
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    };

    // Calculate average rating
    const calculateRating = (course) => {
        if (!course?.courseRatings?.length) return 0;
        const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
        return Math.floor(total / course.courseRatings.length)
    };

    // Chapter duration
    const calculateChapterTime = (chapter) => {
        const time = chapter?.chapterContent?.reduce((sum, lec) => sum + (lec.lectureDuration || 0), 0) || 0;
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // Course duration
    const calculateCourseDuration = (course) => {
        let time = 0;
        course?.courseContent?.forEach(chapter => {
            chapter?.chapterContent?.forEach(lecture => {
                time += lecture.lectureDuration || 0;
            });
        });
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // Number of lectures
    const calculateNoOfLectures = (course) => {
        let total = 0;
        course?.courseContent?.forEach(chapter => {
            if (Array.isArray(chapter?.chapterContent)) {
                total += chapter.chapterContent.length;
            }
        });
        return total;
    };

    // Check if user is educator
    const checkEducatorRole = useCallback(() => {
        if (user?.publicMetadata?.role === 'educator') {
            setIsEducator(true);
        } else {
            setIsEducator(false);
        }
    }, [user]);

    // Initial data loading
    useEffect(() => {
        fetchAllCourses();
    }, []);

    // Update educator status
    useEffect(() => {
        if (userLoaded) {
            checkEducatorRole();
            setLoading(false);
        }
    }, [userLoaded, checkEducatorRole]);

    // Log FULL token in development
    useEffect(() => {
        if (user){         
            fetchUserData()
            fetchUserEnrolledCourses();
        }
    }, [user]);

    // Update role to educator
    const updateRoleToEducator = async () => {
        try {
            const token = await getToken();
            if (!token) throw new Error("No authentication token found");

            const response = await fetch('http://localhost:5000/api/educator/update-role', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            
            if (data.success) {
                alert("Role updated successfully! Refreshing...");
                window.location.reload();
            } else {
                alert("Failed: " + data.message);
            }
            return data;
        } catch (error) {
            console.error("Update role error:", error);
            alert("Error: " + error.message);
            return { success: false, message: error.message };
        }
    };

    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateNoOfLectures,
        calculateCourseDuration,
        calculateChapterTime,
        enrolledCourses,
        fetchUserEnrolledCourses,
        loading,
        user,
        updateRoleToEducator,
        backendUrl,
        userData,
        setUserData,
        getToken,
        fetchAllCourses
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};